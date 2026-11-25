import { test, expect, type Page } from "@playwright/test";

async function difference(page: Page, first: Buffer, second: Buffer) {
  return page.evaluate(async urls => {
    const pixels = async (url: string) => {
      const image = await createImageBitmap(await (await fetch(url)).blob());
      const canvas = document.createElement("canvas");
      canvas.width = image.width; canvas.height = image.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(image, 0, 0); image.close();
      return ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    const [a, b] = await Promise.all(urls.map(pixels));
    if (a.length !== b.length) return 1;
    let changed = 0;
    for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 15) changed++;
    return changed / (a.length / 4);
  }, [first, second].map(buffer => `data:image/png;base64,${buffer.toString("base64")}`));
}

test("diagram signals move, pause together, and resume", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const art = page.locator(".art-automation");
  await art.scrollIntoViewIfNeeded();
  const canvas = art.locator("canvas");
  await expect(canvas).toBeVisible();
  const first = await canvas.screenshot();
  await expect.poll(async () => difference(page, first, await canvas.screenshot())).toBeGreaterThan(.0001);
  await page.getByRole("button", { name: "Pause diagram motion" }).click();
  // Screenshot the same canvas repeatedly: pausing must stop WebGL frames.
  await expect(page.getByRole("button", { name: "Play diagram motion" })).toHaveAttribute("aria-pressed", "true");
  await page.waitForTimeout(700); // Let the separate gallery scroll reveal settle.
  const frozen = await canvas.screenshot();
  await expect.poll(async () => difference(page, frozen, await canvas.screenshot())).toBeLessThan(.001);
  await page.waitForTimeout(350);
  expect(await difference(page, frozen, await canvas.screenshot())).toBeLessThan(.001);
  await page.getByRole("button", { name: "Play diagram motion" }).click();
  await expect.poll(async () => difference(page, frozen, await canvas.screenshot())).toBeGreaterThan(.0001);
  await page.locator(".project-grid").screenshot({ path: testInfo.outputPath("animated-diagrams.png") });
  await page.locator(".art-git-hosting").scrollIntoViewIfNeeded();
  await expect(page.locator(".art-git-hosting canvas")).toBeVisible();
  const monitoring = page.locator(".art-monitoring");
  await monitoring.scrollIntoViewIfNeeded();
  await expect(monitoring.locator("canvas")).toBeVisible();
  await expect(page.locator("body")).toHaveJSProperty("scrollWidth", await page.evaluate(() => innerWidth));
  expect(errors).toEqual([]);
});

test("diagrams follow live reduced-motion preferences", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const art = page.locator(".art-automation");
  await art.scrollIntoViewIfNeeded();
  await expect(art.locator("svg")).toBeVisible();
  await expect(page.locator(".project-art canvas")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(art.locator("canvas")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".project-art canvas")).toHaveCount(0);
  await expect(art.locator("svg")).toBeVisible();
});

test("unavailable WebGL preserves illustrations and card navigation", async ({ page }) => {
  await page.addInitScript(() => { HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext; });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const card = page.locator(".project-card").first();
  await card.scrollIntoViewIfNeeded();
  await expect(card.locator("svg").first()).toBeVisible();
  await expect(card.locator("canvas")).toHaveCount(0);
  await card.click();
  await expect(page).toHaveURL(/\/homelab\/services\/automation$/);
  await expect(page.locator(".article-header .project-art svg")).toBeVisible();
});

