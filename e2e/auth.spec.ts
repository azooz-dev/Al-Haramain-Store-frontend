import { test, expect } from "@playwright/test";

test.describe("Authentication Pages", () => {
  test("signin page loads", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForLoadState("networkidle");

    // Check page loaded - use getByRole for best practice
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("signin page has email input", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForLoadState("networkidle");

    // Check for email input
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();
  });

  test("signin page has password input", async ({ page }) => {
    await page.goto("/signin");
    await page.waitForLoadState("networkidle");

    // Check for password input
    const passwordInput = page.locator('input[type="password"]').first();
    await expect(passwordInput).toBeVisible();
  });

  test("signup page loads", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    // Check page loaded - use getByRole for best practice
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("signup page has email input", async ({ page }) => {
    await page.goto("/signup");
    await page.waitForLoadState("networkidle");

    // Check for email input
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    await expect(emailInput).toBeVisible();
  });
});
