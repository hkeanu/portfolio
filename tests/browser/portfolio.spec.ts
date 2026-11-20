import { test, expect, type Locator } from "@playwright/test";

function readCanvas(canvas: Locator) {
  return canvas.evaluate(element => (element as HTMLCanvasElement).toDataURL());
}

test("every launch page loads with one main heading and no horizontal overflow", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/about", "/homelab", "/certifications", "/contact"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator("body")).not.toContainText("you@example.com");
    if (path === "/about") {
      const avatar = page.getByRole("img", { name: /illustrated avatar/ });
      await avatar.scrollIntoViewIfNeeded();
      await expect.poll(() => avatar.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(1077);
      await page.evaluate(() => window.scrollTo(0, 0));
    }
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: testInfo.outputPath(`${path === "/" ? "home" : path.slice(1)}.png`), fullPage: true });
  }
  expect(errors).toEqual([]);
});

test("layouts fit narrow phones, tablets, and compact desktops", async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/about", "/homelab", "/certifications", "/contact"]) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${path} overflows at ${width}px`).toBe(true);
    }
  }
});

test("credential topics filter the inventory and keep evidence links", async ({ page }) => {
  await page.goto("/certifications");
  await expect(page.locator(".credential-directory .credential-row")).toHaveCount(9);
  await page.getByRole("button", { name: "Automation", exact: true }).click();
  await expect(page.locator(".credential-directory .credential-row")).toHaveCount(1);
  await expect(page.locator(".credential-directory .credential-title")).toHaveText("Robotic Process Automation (RPA)");
  await expect(page.getByRole("button", { name: "Automation", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status")).toContainText("1 credential shown");
  await page.getByRole("button", { name: /^All/ }).click();
  await expect(page.locator(".credential-directory .credential-row")).toHaveCount(9);
  const image = await page.request.get("/media/certifications/snowflake-fundamentals.jpg");
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toContain("image/jpeg");
});

test("homelab selection opens the corresponding published MDX note", async ({ page }) => {
  await page.goto("/homelab");
  await page.getByRole("button", { name: /Monitoring/ }).click();
  await expect(page.locator("#service-preview h3")).toHaveText("Keeping an eye on things");
  await page.getByRole("link", { name: "Explore this stack" }).click();
  await expect(page).toHaveURL(/\/homelab\/services\/monitoring$/);
  await expect(page.getByRole("heading", { name: "Two complementary views" })).toBeVisible();
  for (const slug of ["automation", "git-hosting", "media"]) {
    expect((await page.goto(`/homelab/services/${slug}`))?.status()).toBe(200);
    await expect(page.locator(".prose h2").first()).toBeVisible();
  }
  expect((await page.goto("/homelab/services/not-published"))?.status()).toBe(404);
});

test("keyboard access and reduced motion retain visible content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  const canvas = page.locator(".hero-artwork canvas");
  await expect(page.locator(".hero-artwork")).toHaveAttribute("data-rendered", "true");
  const initial = await readCanvas(canvas);
  const play = page.getByRole("button", { name: "Play motion" });
  await expect(play).toBeVisible();
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  expect(await readCanvas(canvas)).toBe(initial);
  await play.click();
  await expect.poll(() => readCanvas(canvas)).not.toBe(initial);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await page.getByRole("heading", { name: /A few interests/ }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: /A few interests/ })).toHaveCSS("opacity", "1");
});

test("homepage motion loops, suspends offscreen, and can be paused", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/");
  await expect(page.locator(".hero-artwork")).toHaveAttribute("data-rendered", "true");
  const canvas = page.locator(".hero-artwork canvas");
  const initial = await readCanvas(canvas);
  const pause = page.getByRole("button", { name: "Pause motion" });
  await expect(pause).toBeVisible();
  await expect.poll(() => readCanvas(canvas)).not.toBe(initial);
  await page.clock.fastForward(7_200);
  await expect(pause).toBeVisible();

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await expect(canvas).not.toBeInViewport();
  await page.clock.fastForward(250);
  const offscreen = await readCanvas(canvas);
  await page.clock.fastForward(500);
  expect(await readCanvas(canvas)).toBe(offscreen);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(canvas).toBeInViewport();
  await expect.poll(() => readCanvas(canvas)).not.toBe(offscreen);
  await pause.click();
  await expect(page.getByRole("button", { name: "Resume motion" })).toBeVisible();
  const paused = await readCanvas(canvas);
  await page.clock.fastForward(500);
  expect(await readCanvas(canvas)).toBe(paused);
  await page.getByRole("link", { name: "Explore my work" }).click();
  await expect(page).toHaveURL(/#selected-work$/);
  await page.locator("#selected-work").getByRole("link", { name: /Monitoring/ }).click();
  await expect(page).toHaveURL(/\/homelab\/services\/monitoring$/);
});

test("mobile navigation closes on Escape and after route selection", async ({ page, isMobile }) => {
  test.skip(!isMobile);
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
  await toggle.click();
  await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: /Certifications/ }).click();
  await expect(page).toHaveURL(/\/certifications$/);
  await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeHidden();
});
