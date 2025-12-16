import { test, expect } from "@playwright/test";

test.describe("Doctor Portal Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/doctor");
  });

  test("should load doctor dashboard", async ({ page }) => {
    // Welcome message or doctor greeting should be visible
    await expect(page.getByText(/Good|Welcome|Dr\.|Dashboard|Ellis/i).first()).toBeVisible();
  });

  test("should display dashboard statistics", async ({ page }) => {
    // Stats cards should be visible - look for stat values
    const statsContainer = page.locator('.bg-white.rounded-xl').first();
    await expect(statsContainer).toBeVisible();
  });

  test("should show time filter buttons", async ({ page }) => {
    // Week/Month/Year filters
    const weekBtn = page.getByRole("button", { name: /week/i });
    const monthBtn = page.getByRole("button", { name: /month/i });
    const yearBtn = page.getByRole("button", { name: /year/i });

    await expect(weekBtn).toBeVisible();
    await expect(monthBtn).toBeVisible();
    await expect(yearBtn).toBeVisible();
  });

  test("should switch time filter when clicked", async ({ page }) => {
    const monthBtn = page.getByRole("button", { name: /month/i });
    await monthBtn.click();

    // Month button should now be active (styled differently)
    await expect(monthBtn).toHaveClass(/bg-white|shadow/);
  });

  test("should display recent patient activity", async ({ page }) => {
    // Patient activity section
    await expect(page.getByText(/Recent Patient Activity/i)).toBeVisible();

    // Patient names should be visible
    await expect(page.getByText(/Dave Thompson|Sarah Mitchell/i).first()).toBeVisible();
  });

  test("should show patient video progress bars", async ({ page }) => {
    // Progress bars for video completion
    const progressBars = page.locator('[class*="bg-sky-500"], [class*="bg-emerald-500"]');
    await expect(progressBars.first()).toBeVisible();
  });

  test("should display messages section", async ({ page }) => {
    // Messages section heading or link
    await expect(page.getByText(/Messages|Message/i).first()).toBeVisible();
  });

  test("should have navigation elements", async ({ page }) => {
    // Should have navigable links
    const links = page.locator('a[href*="/doctor/"]');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test("should have Send Content button", async ({ page }) => {
    // Send content button or link
    const sendBtn = page.locator('a[href="/doctor/send"]');
    await expect(sendBtn.first()).toBeVisible();
  });

  test("should navigate to patients page", async ({ page }) => {
    const viewAllLink = page.getByRole("link", { name: /View All/i }).first();
    await viewAllLink.click();

    // Should navigate to patients page
    await expect(page).toHaveURL(/\/doctor\/patients/);
  });
});

test.describe("Doctor Portal - AI Studio Section", () => {
  test("should display AI Studio section", async ({ page }) => {
    await page.goto("/doctor");

    // AI Studio heading or sparkles icon section
    const aiSection = page.getByText(/AI Studio|AI|Avatar/i).first();
    await expect(aiSection).toBeVisible();
  });

  test("should show HeyGen training link", async ({ page }) => {
    await page.goto("/doctor");

    // HeyGen link for avatar training
    const heygenLink = page.getByRole("link", { name: /Train with HeyGen/i });
    await expect(heygenLink).toBeVisible();

    // Should open in new tab (external link)
    await expect(heygenLink).toHaveAttribute("target", "_blank");
  });

  test("should have Create Chapters link", async ({ page }) => {
    await page.goto("/doctor");

    const createChaptersLink = page.getByRole("link", {
      name: /Create.*Chapters/i,
    });
    await expect(createChaptersLink).toBeVisible();
  });

  test("should display how it works steps", async ({ page }) => {
    await page.goto("/doctor");

    // Step indicators
    await expect(page.getByText(/Train Your Avatar/i)).toBeVisible();
    await expect(page.getByText(/Select Templates/i)).toBeVisible();
    await expect(page.getByText(/Send to Patients/i)).toBeVisible();
  });
});

test.describe("Doctor Portal - Popular Chapters", () => {
  test("should display popular chapters list", async ({ page }) => {
    await page.goto("/doctor");

    // Popular chapters section
    await expect(page.getByText(/Popular Chapters/i)).toBeVisible();

    // Chapter titles
    await expect(page.getByText(/Heart Health Basics/i)).toBeVisible();
    await expect(page.getByText(/Blood Pressure Management/i)).toBeVisible();
  });

  test("should show view counts for chapters", async ({ page }) => {
    await page.goto("/doctor");

    // View counts
    await expect(page.getByText(/views/i).first()).toBeVisible();
  });

  test("should navigate to chapters library", async ({ page }) => {
    await page.goto("/doctor");

    const manageLibraryLink = page.getByRole("link", {
      name: /Manage Library/i,
    });
    await manageLibraryLink.click();

    await expect(page).toHaveURL(/\/doctor\/chapters/);
  });
});

test.describe("Doctor Portal - Quick Actions", () => {
  test("should have quick action links", async ({ page }) => {
    await page.goto("/doctor");

    // Quick action cards - look for any action link
    const actionLinks = page.locator('a[href*="/doctor/"]');
    const linkCount = await actionLinks.count();
    expect(linkCount).toBeGreaterThan(2); // Should have multiple action links
  });

  test("should navigate to send page from quick action", async ({ page }) => {
    await page.goto("/doctor");

    const sendLink = page.getByRole("link", { name: /Send Videos/i });
    await sendLink.click();

    await expect(page).toHaveURL(/\/doctor\/send/);
  });
});

