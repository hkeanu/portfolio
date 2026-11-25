import { test, expect } from "@playwright/test";

test("keyboard arrival stays immediate and subsequent pointer scrolling enables motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/about");
  await page.getByRole("link", { name: /Keanu.*home/ }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  const card = page.locator(".project-card").first();
  await expect(card).toHaveCSS("transform", "none");
  await page.mouse.wheel(0, 120);
  await expect.poll(() => card.evaluate(element => getComputedStyle(element).transform)).not.toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("transform", "none");
});

test("scrolling visibly assembles project cards and reduced motion clears their transforms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const card = page.locator(".project-card").first();
  await expect.poll(() => card.evaluate(element => Number(getComputedStyle(element).opacity))).toBeLessThan(.3);
  await page.evaluate(() => {
    const rect = document.querySelector('.project-card')!.getBoundingClientRect();
    window.scrollTo({ top: scrollY + rect.top - innerHeight * .35, behavior: "instant" });
  });
  await expect.poll(() => card.evaluate(element => Number(getComputedStyle(element).opacity))).toBeGreaterThan(.98);
  const heading = page.locator("#selected-work-title [data-heading-line]");
  await expect(heading).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("transform", "none");
  await expect(heading).toHaveCSS("transform", "none");
  await expect(card).toHaveCSS("opacity", "1");
});

test("service connections follow selection and resize; keyboard changes settle immediately", async ({ page }) => {
  await page.goto("/homelab");
  const connection = page.locator(".selection-connection path");
  await expect(connection).toHaveAttribute("d", /^M/);
  const original = await connection.getAttribute("d");
  const monitoring = page.getByRole("button", { name: /Monitoring/ });
  await monitoring.click();
  await expect(connection).not.toHaveAttribute("d", original!);
  await expect(page.locator("#service-preview h3")).toHaveText("Keeping an eye on things");
  await page.getByRole("button", { name: /Git hosting/ }).focus();
  await page.keyboard.press("Enter");
  expect(await connection.evaluate(element => element.getAnimations().length)).toBe(0);
  expect(await page.locator(".service-preview-content").evaluate(element => element.getAnimations().length)).toBe(0);
  await page.setViewportSize({ width: 360, height: 844 });
  await expect.poll(() => connection.evaluate(element => {
    const path = element as SVGPathElement;
    const end = path.getPointAtLength(path.getTotalLength());
    const map = document.querySelector(".lab-map")!.getBoundingClientRect();
    const selected = document.querySelector('.service-node[aria-pressed="true"]')!.getBoundingClientRect();
    return Math.abs(end.x + map.left - (selected.left + selected.width / 2)) + Math.abs(end.y + map.top - selected.top);
  })).toBeLessThan(1);
});

test("reduced motion leaves editorial lines readable without movement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const heading = page.getByRole("heading", { name: /A few interests/ });
  await heading.scrollIntoViewIfNeeded();
  await expect(heading.locator("[data-heading-line]")).toHaveCount(2);
  for (const line of await heading.locator("[data-heading-line]").all()) {
    await expect(line).toHaveCSS("opacity", "1");
    await expect(line).toHaveCSS("transform", "none");
  }
});
