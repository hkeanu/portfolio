import { test, expect } from "@playwright/test";

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
  expect(await page.locator(".sculpture-layer").first().evaluate(element => getComputedStyle(element).animationName)).toBe("none");
  await page.getByRole("heading", { name: /A few interests/ }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: /A few interests/ })).toHaveCSS("opacity", "1");
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
