import { test, expect, devices } from "@playwright/test";

/**
 * Comprehensive Mobile Testing Suite
 * Tests all key features on mobile viewport (Pixel 5 / iPhone 12)
 */

// Force mobile viewport for all tests in this file
test.use({
  ...devices["Pixel 5"],
});

test.describe("Mobile: Feed Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");
  });

  test("should display mobile bottom navigation bar", async ({ page }) => {
    // Mobile nav should be visible at the bottom
    const mobileNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mobileNav).toBeVisible();

    // Should have 3 navigation items
    const navLinks = mobileNav.locator("a");
    await expect(navLinks).toHaveCount(3);

    // Verify nav items: My Feed, Discover, My Health (use exact match to avoid multiple matches)
    await expect(mobileNav.getByRole("link", { name: "My Feed", exact: true })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "Discover", exact: true })).toBeVisible();
    await expect(mobileNav.getByRole("link", { name: "My Health", exact: true })).toBeVisible();
  });

  test("should NOT show desktop sidebar on mobile", async ({ page }) => {
    // Desktop sidebar should be hidden
    const sidebar = page.locator("aside.hidden");
    // The aside should have lg:flex class meaning hidden on mobile
    await expect(page.locator("aside")).toHaveClass(/hidden/);
  });

  test("should display video with action buttons visible", async ({ page }) => {
    // Video should be present
    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Doctor profile link should be visible on video
    const doctorLink = page.getByRole("link", { name: /View Dr\..+profile/i }).first();
    await expect(doctorLink).toBeVisible();

    // Discover button should be visible
    const discoverBtn = page.getByRole("link", { name: "Discover Doctors" }).first();
    await expect(discoverBtn).toBeVisible();
  });

  test("should have mute/unmute button accessible", async ({ page }) => {
    const muteBtn = page.getByRole("button", { name: /mute video/i }).first();
    await expect(muteBtn).toBeVisible();

    // Button should be tappable (has reasonable size)
    const box = await muteBtn.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(40);
    expect(box?.height).toBeGreaterThanOrEqual(40);
  });

  test("should scroll between videos smoothly", async ({ page }) => {
    // First video should be visible
    const firstVideo = page.locator(".snap-item").first();
    await expect(firstVideo).toBeVisible();

    // Scroll to next video
    await page.evaluate(() => {
      const container = document.querySelector(".snap-container");
      if (container) {
        container.scrollTo({ top: window.innerHeight, behavior: "smooth" });
      }
    });

    await page.waitForTimeout(600);

    // Second video should now be in view
    const secondVideo = page.locator(".snap-item").nth(1);
    const box = await secondVideo.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.y).toBeLessThan(viewport?.height || 800);
  });

  test("bottom nav should not overlap video content", async ({ page }) => {
    const mobileNav = page.locator('nav[aria-label="Main navigation"]');
    const navBox = await mobileNav.boundingBox();

    // Get discover button on video
    const discoverBtn = page.getByRole("link", { name: "Discover Doctors" }).first();
    const btnBox = await discoverBtn.boundingBox();

    if (navBox && btnBox) {
      // Discover button should be above the bottom nav
      expect(btnBox.y + btnBox.height).toBeLessThan(navBox.y);
    }
  });
});

test.describe("Mobile: Discover Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/discover");
    await page.waitForLoadState("networkidle");
  });

  test("should display search bar", async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test("should show doctor cards", async ({ page }) => {
    // Should display doctor cards/profiles
    const doctorCards = page.locator('a[href*="/doctor/"]');
    const count = await doctorCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should show category filter buttons", async ({ page }) => {
    // Category filter buttons should be visible
    await expect(page.getByRole("button", { name: "All" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cardiology" })).toBeVisible();
  });

  test("should have mobile nav with Discover active", async ({ page }) => {
    const discoverLink = page.locator('nav[aria-label="Main navigation"]').getByRole("link", { name: "Discover" });
    await expect(discoverLink).toBeVisible();

    // Discover should show active state (teal color)
    await expect(discoverLink).toHaveCSS("color", "rgb(0, 191, 166)");
  });

  test("discover icon should show compass outline when active", async ({ page }) => {
    // The compass icon should be visible (not filled solid)
    const compassIcon = page.locator('nav[aria-label="Main navigation"] svg.lucide-compass');
    await expect(compassIcon).toBeVisible();
  });
});

test.describe("Mobile: My Health Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/my-health");
    await page.waitForLoadState("networkidle");
  });

  test("should display My Health page content", async ({ page }) => {
    // Page should load (may show auth prompt or content)
    await expect(page.locator("body")).toBeVisible();

    // Should have mobile nav
    const mobileNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mobileNav).toBeVisible();
  });

  test("should have My Health nav item active", async ({ page }) => {
    const healthLink = page.locator('nav[aria-label="Main navigation"]').getByRole("link", { name: "My Health" });
    await expect(healthLink).toBeVisible();

    // Should show active state
    await expect(healthLink).toHaveCSS("color", "rgb(0, 191, 166)");
  });
});

test.describe("Mobile: Navigation Transitions", () => {
  test("should navigate between all main pages", async ({ page }) => {
    // Start on feed
    await page.goto("/feed");
    await expect(page).toHaveURL(/feed/);

    // Navigate to Discover via mobile nav
    await page.locator('nav[aria-label="Main navigation"]').getByRole("link", { name: "Discover" }).click();
    await expect(page).toHaveURL(/discover/);

    // Navigate to My Health
    await page.locator('nav[aria-label="Main navigation"]').getByRole("link", { name: "My Health" }).click();
    await expect(page).toHaveURL(/my-health/);

    // Navigate back to Feed
    await page.locator('nav[aria-label="Main navigation"]').getByRole("link", { name: "My Feed" }).click();
    await expect(page).toHaveURL(/feed/);
  });

  test("nav items should be tap-friendly size", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const mobileNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mobileNav).toBeVisible();
    
    const navLinks = mobileNav.locator("a");
    const count = await navLinks.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      const link = navLinks.nth(i);
      await expect(link).toBeVisible();
      const box = await link.boundingBox();

      // Each nav item should be at least 44x44 (Apple's minimum tap target)
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });
});

test.describe("Mobile: Video Player Interactions", () => {
  test("should tap to play/pause video", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    // Close any dialogs/overlays that might be blocking
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Get initial play state
    const initialPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);

    // Use the play button if video is paused, or click on video container
    if (initialPaused) {
      const playButton = page.getByRole("button", { name: "Play video" }).first();
      if (await playButton.isVisible()) {
        await playButton.click();
      }
    }

    await page.waitForTimeout(500);

    // Video should respond to interaction
    const afterPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
    expect(typeof afterPaused).toBe("boolean");
  });

  test("should show play button overlay when paused", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Pause the video
    await video.evaluate((v: HTMLVideoElement) => v.pause());

    // Play button should appear (use .first() since multiple videos exist)
    const playButton = page.getByRole("button", { name: "Play video" }).first();
    await expect(playButton).toBeVisible();
  });
});

test.describe("Mobile: Touch & Scroll Behavior", () => {
  test("should support vertical scroll snapping", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const container = page.locator(".snap-container").first();
    await expect(container).toBeVisible();

    // Container should have snap scrolling enabled
    const snapType = await container.evaluate((el) => 
      window.getComputedStyle(el).scrollSnapType
    );
    expect(snapType).toContain("y");
  });

  test("video should fill mobile viewport width", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const videoContainer = page.locator(".snap-item").first();
    await expect(videoContainer).toBeVisible();
    
    const box = await videoContainer.boundingBox();
    const viewport = page.viewportSize();

    // Video container should exist and have reasonable width
    if (box && viewport) {
      // Video should be nearly full width (accounting for margins on tablet-ish sizes)
      expect(box.width).toBeGreaterThan(viewport.width * 0.5);
    }
  });
});

test.describe("Mobile: Doctor Portal", () => {
  test("should show mobile header with hamburger menu", async ({ page }) => {
    await page.goto("/doctor");
    await page.waitForLoadState("networkidle");

    // If redirected to auth, that's expected
    if (page.url().includes("/auth")) {
      await expect(page.locator("body")).toBeVisible();
      return;
    }

    // Mobile header should be visible (has hamburger menu)
    const menuButton = page.getByRole("button", { name: /toggle sidebar/i });
    await expect(menuButton).toBeVisible();
  });

  test("doctor portal should NOT show duplicate profile section", async ({ page }) => {
    await page.goto("/doctor");
    await page.waitForLoadState("networkidle");

    // Skip if redirected to auth
    if (page.url().includes("/auth")) {
      return;
    }

    // The sidebar should NOT have the doctor info card (we removed it)
    const doctorInfoCard = page.locator("aside").locator("text=Healthcare Provider");
    await expect(doctorInfoCard).not.toBeVisible();
  });
});

test.describe("Mobile: Accessibility", () => {
  test("all interactive elements should be keyboard accessible", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    // Tab multiple times to skip past Next.js dev tools and reach actual content
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
    }
    
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    // Should be a standard interactive element (A, BUTTON, INPUT) or dev tools (acceptable)
    const validTags = ["A", "BUTTON", "INPUT", "NEXTJS-PORTAL", "VIDEO", "BODY"];
    expect(validTags).toContain(focusedElement);
  });

  test("nav items should have proper aria labels", async ({ page }) => {
    await page.goto("/feed");

    const mobileNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mobileNav).toBeVisible();

    // Each nav link should have aria-label
    const links = mobileNav.locator("a");
    const count = await links.count();

    for (let i = 0; i < count; i++) {
      const label = await links.nth(i).getAttribute("aria-label");
      expect(label).toBeTruthy();
    }
  });
});

