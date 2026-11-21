import { test, expect, type Page } from "@playwright/test";

// GPU antialiasing may differ by a few channel values between otherwise
// identical frames. Compare decoded pixels, rather than PNG byte streams.
async function changedPixels(page: Page, a: Buffer, b: Buffer) {
  return page.evaluate(async ([first, second]) => {
    const decode = async (url: string) => {
      const bitmap = await createImageBitmap(await (await fetch(url)).blob());
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width; canvas.height = bitmap.height;
      const context = canvas.getContext("2d")!;
      context.drawImage(bitmap, 0, 0); bitmap.close();
      return context.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    const [x, y] = await Promise.all([decode(first), decode(second)]);
    let changed = 0;
    for (let i = 0; i < x.length; i += 4) if (Math.abs(x[i] - y[i]) + Math.abs(x[i + 1] - y[i + 1]) + Math.abs(x[i + 2] - y[i + 2]) > 15) changed++;
    return changed / (x.length / 4);
  }, [a, b].map(buffer => `data:image/png;base64,${buffer.toString("base64")}`));
}

test("the sculpture offers explicit perspective changes without autoplay", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const art = page.locator(".hero-artwork");
  const canvas = art.locator("canvas");
  // Controls overlay the canvas bounds on phones. Exclude their focus rings
  // from the image comparison while retaining the actual rendered sculpture.
  const capture = () => canvas.screenshot({ style: ".scene-caption { visibility: hidden !important; }" });
  await expect(canvas).toHaveCount(0);
  await page.getByRole("button", { name: "Enable 3D artwork" }).click();
  await expect(art).toHaveAttribute("data-rendered", "true");
  await page.evaluate(() => document.fonts.ready);
  const original = await capture();
  const perspective = page.getByRole("button", { name: "Change sculpture perspective" });
  await perspective.focus();
  await page.keyboard.press("Enter");
  await expect(art).toHaveAttribute("data-perspective", "1");
  expect(await changedPixels(page, original, await capture())).toBeGreaterThan(.01);
  await perspective.click();
  await expect(page.getByRole("status")).toHaveText("Elevated view");
  await page.locator(".hero").screenshot({ path: testInfo.outputPath("hero-elevated.png") });
  await perspective.click();
  await expect(art).toHaveAttribute("data-perspective", "0");
  await expect.poll(async () => changedPixels(page, original, await capture())).toBeLessThan(.001);
  await expect(page.getByRole("button", { name: "Play motion" })).toBeVisible();
});

test("page transitions commit the destination, survive interruption, and preserve Back", async ({ page, isMobile }) => {
  test.skip(isMobile);
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    const native = document.startViewTransition.bind(document);
    document.startViewTransition = (update: Parameters<Document["startViewTransition"]>[0]) => {
      const start = performance.now();
      const transition = native(update);
      void transition.updateCallbackDone.then(() => { document.documentElement.dataset.testCommitMs = String(performance.now() - start); });
      return transition;
    };
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-page-transition", "running");
  await expect(page).toHaveURL(/\/about$/);
  // The persistent header remains interactive while the main surface changes.
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Homelab", exact: true }).click();
  await expect(page).toHaveURL(/\/homelab$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-page-transition");
  expect(Number(await page.locator("html").getAttribute("data-test-commit-ms")), "A cached route should commit before the slow-route watchdog").toBeLessThan(1600);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Small infrastructure.");
  await page.goBack();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-page-transition");
  expect(errors).toEqual([]);
});

test("unsupported view transitions keep normal navigation and visible headings", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(document, "startViewTransition", { value: undefined }));
  await page.goto("/");
  await page.getByRole("link", { name: "All certifications", exact: true }).click();
  await expect(page).toHaveURL(/\/certifications$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).not.toHaveAttribute("data-page-transition");
});

test("a disabled canvas retains the poster and working portfolio links", async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
  await page.goto("/");
  const poster = page.locator(".hero-artwork img");
  await expect(poster).toBeVisible();
  await expect.poll(() => poster.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: /motion|perspective/i })).toHaveCount(0);
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/#selected-work$/);
});

test("without JavaScript the poster, content, and navigation remain available", async ({ browser, isMobile }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 } });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:3000/");
    await expect(page.locator(".hero-artwork img")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Curiosity,");
    await page.getByRole("navigation", { name: "Navigation without JavaScript" }).getByRole("link", { name: "Homelab", exact: true }).click();
    await expect(page).toHaveURL(/\/homelab$/);
    await page.locator(".stack-list").getByRole("link", { name: /Keeping an eye/ }).click();
    await expect(page.getByRole("heading", { name: "Two complementary views" })).toBeVisible();
  } finally { await context.close(); }
});

test("losing WebGL restores the artwork and keeps project navigation usable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-artwork")).toHaveAttribute("data-rendered", "true");
  await page.locator(".hero-artwork canvas").evaluate(canvas => {
    (canvas as HTMLCanvasElement).getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
  });
  await expect(page.locator(".hero-artwork img")).toBeVisible();
  await expect(page.locator(".hero-artwork canvas")).toHaveCount(0);
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page.locator("#selected-work-title")).toBeInViewport();
});

test("changing motion preference replaces an active scene with a static poster", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-artwork")).toHaveAttribute("data-rendered", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-artwork canvas")).toHaveCount(0);
  await expect(page.locator(".hero-artwork img")).toBeVisible();
  await expect(page.getByRole("button", { name: "Enable 3D artwork" })).toBeVisible();
});

test("the tool strip serves recognizable logos locally with visible names", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const tools = page.getByRole("list", { name: "Tools in my practice" });
  for (const name of ["Python", "R", "n8n", "Alteryx", "PostgreSQL", "Docker"]) {
    const item = tools.getByRole("listitem").filter({ has: page.getByText(name, { exact: true }) });
    await expect(item).toBeVisible();
    const img = item.locator("img");
    await expect(img).toHaveAttribute("src", /^\/media\/tools\//);
    await expect.poll(() => img.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  }
});

test("discipline exploration updates real links and works without WebGL", async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
  await page.goto("/");
  const choices = page.getByRole("group", { name: "Explore my disciplines" });
  await choices.getByRole("button", { name: "Automation", exact: true }).click();
  await expect(page.locator("#discipline-detail h2")).toHaveText("Less repetition. More possibility.");
  await expect(page.getByRole("link", { name: "Explore automation", exact: true })).toHaveAttribute("href", "/homelab/services/automation");
  await choices.getByRole("button", { name: "Systems", exact: true }).click();
  await choices.getByRole("button", { name: "Data", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#discipline-detail h2")).toHaveText("From information to understanding.");
  expect(await page.locator("#discipline-detail").evaluate(element => element.getAnimations().length)).toBe(0);
  await expect(choices.locator('[aria-pressed="true"]')).toHaveCount(1);
  await page.getByRole("link", { name: "Meet my practice" }).click();
  await expect(page).toHaveURL(/\/about$/);
});

test("discipline selections change the sculpture while explicit 3D playback stays paused", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Enable 3D artwork" }).click();
  const art = page.locator(".hero-artwork");
  await expect(art).toHaveAttribute("data-rendered", "true");
  await page.evaluate(() => document.fonts.ready);
  const capture = () => art.locator("canvas").screenshot({ style: ".scene-caption{visibility:hidden!important}" });
  const original = await capture();
  const choices = page.getByRole("group", { name: "Explore my disciplines" });
  await choices.getByRole("button", { name: "Automation", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(art).toHaveAttribute("data-discipline", "automation");
  await expect.poll(async () => changedPixels(page, original, await capture())).toBeGreaterThan(.01);
  await expect(page.getByRole("button", { name: "Play motion" })).toBeVisible();
  await choices.getByRole("button", { name: "Together", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect.poll(async () => changedPixels(page, original, await capture())).toBeLessThan(.001);
});

test("project artwork carries into its article and keyboard navigation skips route animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const native = document.startViewTransition.bind(document);
    document.startViewTransition = update => {
      document.documentElement.dataset.transitionCalls = String(Number(document.documentElement.dataset.transitionCalls ?? 0) + 1);
      const transition = native(update);
      void transition.ready.then(() => { document.documentElement.dataset.transitionReady = "true"; document.documentElement.dataset.snapshotScroll = String(scrollY); }, error => { document.documentElement.dataset.transitionError = error.name; });
      return transition;
    };
  });
  await page.goto("/");
  const card = page.locator('.project-card').filter({ hasText: "Automation & documents" });
  await expect(card.locator(".project-art")).toHaveCSS("view-transition-name", "project-automation");
  await card.click();
  await expect(page).toHaveURL(/\/homelab\/services\/automation$/);
  await expect(page.locator("html")).toHaveAttribute("data-transition-ready", "true");
  await expect(page.locator("html")).toHaveAttribute("data-snapshot-scroll", "0");
  await expect(page.locator(".article-header h1")).toBeInViewport();
  await expect(page.locator(".article-header .project-art")).toHaveCSS("view-transition-name", "project-automation");
  await expect(page.locator("html")).not.toHaveAttribute("data-transition-error");
  await expect(page.locator("html")).not.toHaveAttribute("data-page-transition");
  await expect(page.locator(".article-header h1")).toHaveCSS("animation-name", "none");
  await expect(page.locator(".article-summary")).toHaveCSS("opacity", "1");
  await page.goto("/");
  await card.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/homelab\/services\/automation$/);
  await expect(page.locator("html")).not.toHaveAttribute("data-transition-calls");
});
