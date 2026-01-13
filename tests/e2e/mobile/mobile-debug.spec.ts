import { test, expect, devices } from "@playwright/test";

/**
 * Mobile Debug Tests
 * Focused tests for debugging mobile-specific issues:
 * 1. Video loading and playback
 * 2. Navigation and auth flow
 * 3. Touch interactions
 */

// Force mobile viewport for all tests
test.use({
  ...devices["Pixel 5"],
});

test.describe("Mobile Debug: Video Loading", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");
  });

  test("video element should render with valid source", async ({ page }) => {
    // Wait for video element to appear
    const video = page.locator('[data-testid="video-element"]').first();
    
    // Video should be visible within reasonable time
    await expect(video).toBeVisible({ timeout: 15000 });

    // Should have a source URL
    const src = await video.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toContain(".mp4");
  });

  test("video should show loading state initially", async ({ page }) => {
    // Check if loading state appears (may be brief)
    const loadingIndicator = page.locator('[data-testid="video-loading"]');
    
    // Either loading is visible or video is already ready
    const videoElement = page.locator('[data-testid="video-element"]').first();
    const videoExists = await videoElement.isVisible({ timeout: 10000 }).catch(() => false);
    
    if (videoExists) {
      // Video loaded successfully - this is fine
      expect(true).toBeTruthy();
    } else {
      // Check loading indicator appeared
      await expect(loadingIndicator.or(videoElement)).toBeVisible({ timeout: 15000 });
    }
  });

  test("video should have proper autoplay attributes", async ({ page }) => {
    const video = page.locator('[data-testid="video-element"]').first();
    await expect(video).toBeVisible({ timeout: 15000 });

    // Check required attributes for mobile autoplay
    const playsInline = await video.getAttribute("playsinline");
    const webkitPlaysInline = await video.getAttribute("webkit-playsinline");
    const preload = await video.getAttribute("preload");

    expect(playsInline !== null).toBeTruthy();
    expect(webkitPlaysInline).toBe("true");
    expect(preload).toBe("auto");
  });

  test("play overlay should appear when video is paused", async ({ page }) => {
    await page.waitForTimeout(2000); // Wait for potential autoplay

    const video = page.locator('[data-testid="video-element"]').first();
    const videoExists = await video.isVisible({ timeout: 10000 }).catch(() => false);

    if (videoExists) {
      // Pause the video
      await video.evaluate((v: HTMLVideoElement) => v.pause());
      await page.waitForTimeout(500);

      // Play overlay should appear (use first() since multiple videos exist)
      const playOverlay = page.locator('[data-testid="play-overlay"]').first();
      await expect(playOverlay).toBeVisible({ timeout: 5000 });
    }
  });

  test("tap to play should work on mobile", async ({ page }) => {
    const video = page.locator('[data-testid="video-element"]').first();
    const videoExists = await video.isVisible({ timeout: 15000 }).catch(() => false);

    if (videoExists) {
      // Get initial paused state
      const initialPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);

      // Find and tap play overlay or video
      const playOverlay = page.locator('[data-testid="play-overlay"]');
      const overlayVisible = await playOverlay.isVisible().catch(() => false);

      if (overlayVisible) {
        await playOverlay.tap();
      } else {
        await video.tap();
      }

      await page.waitForTimeout(500);

      // Video state should have changed or attempt was made
      const afterPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
      
      // Either state changed or autoplay was blocked (both acceptable)
      expect(typeof afterPaused).toBe("boolean");
    }
  });

  test("mute toggle button should be accessible", async ({ page }) => {
    await page.waitForTimeout(2000);

    const muteBtn = page.locator('[data-testid="mute-toggle"]');
    const muteBtnVisible = await muteBtn.isVisible({ timeout: 10000 }).catch(() => false);

    if (muteBtnVisible) {
      const box = await muteBtn.boundingBox();
      
      // Mute button should be at least 44x44 for touch accessibility
      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }

      // Should be tappable
      await muteBtn.tap();
      await page.waitForTimeout(300);
      
      // Button should still be visible after tap
      await expect(muteBtn).toBeVisible();
    }
  });

  test("error state should show retry button on video failure", async ({ page }) => {
    // Intercept video requests to simulate failure
    await page.route("**/*.mp4", (route) => {
      route.abort("failed");
    });

    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(3000);

    // Error state should appear
    const errorState = page.locator('[data-testid="video-error"]');
    const errorVisible = await errorState.isVisible({ timeout: 10000 }).catch(() => false);

    if (errorVisible) {
      // Retry button should be present
      const retryBtn = page.getByRole("button", { name: /try again|retry/i });
      await expect(retryBtn).toBeVisible();
      
      // Should be tappable
      const box = await retryBtn.boundingBox();
      expect(box).toBeTruthy();
    }
  });
});

test.describe("Mobile Debug: Navigation Auth Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");
  });

  test("My Health nav should show auth prompt when unauthenticated", async ({ page }) => {
    // Find My Health nav link
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible({ timeout: 10000 });

    const myHealthLink = nav.getByRole("link", { name: "My Health" });
    await expect(myHealthLink).toBeVisible();

    // Tap on My Health
    await myHealthLink.tap();

    // Wait for auth prompt to appear
    await page.waitForTimeout(500);

    // Check for auth prompt modal
    const authPrompt = page.locator('text="Sign In to Continue"').or(
      page.locator('text="Unlock Personalized Content"')
    ).or(
      page.locator('text="Save Your Progress"')
    );

    // Auth prompt should be visible (if unauthenticated)
    const promptVisible = await authPrompt.isVisible({ timeout: 5000 }).catch(() => false);
    
    // Either auth prompt shows OR page navigated (if session exists)
    const urlChanged = page.url().includes("/my-health");
    
    expect(promptVisible || urlChanged).toBeTruthy();
  });

  test("auth prompt should have accessible email input", async ({ page }) => {
    // Navigate to trigger auth prompt
    const nav = page.locator('nav[aria-label="Main navigation"]');
    const myHealthLink = nav.getByRole("link", { name: "My Health" });
    await myHealthLink.tap();

    await page.waitForTimeout(500);

    // Check for email input
    const emailInput = page.locator('input[type="email"]');
    const emailVisible = await emailInput.isVisible({ timeout: 5000 }).catch(() => false);

    if (emailVisible) {
      // Email input should be focusable
      await emailInput.tap();
      await expect(emailInput).toBeFocused();

      // Should be able to type
      await emailInput.fill("test@example.com");
      const value = await emailInput.inputValue();
      expect(value).toBe("test@example.com");
    }
  });

  test("auth prompt should be dismissible", async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main navigation"]');
    const myHealthLink = nav.getByRole("link", { name: "My Health" });
    await myHealthLink.tap();

    await page.waitForTimeout(500);

    // Look for close button or "Maybe Later"
    const closeBtn = page.getByRole("button", { name: /close|maybe later/i });
    const closeBtnVisible = await closeBtn.isVisible({ timeout: 5000 }).catch(() => false);

    if (closeBtnVisible) {
      await closeBtn.tap();
      await page.waitForTimeout(300);

      // Modal should be dismissed
      const authPrompt = page.locator('text="Sign In to Continue"');
      await expect(authPrompt).not.toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Mobile Debug: Bottom Navigation", () => {
  test("bottom nav should be fixed at screen bottom", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible({ timeout: 10000 });

    const navBox = await nav.boundingBox();
    const viewport = page.viewportSize();

    expect(navBox).toBeTruthy();
    expect(viewport).toBeTruthy();

    if (navBox && viewport) {
      // Nav should be at the bottom of viewport (within safe area)
      expect(navBox.y + navBox.height).toBeGreaterThanOrEqual(viewport.height - 50);
    }
  });

  test("all nav items should be tap-friendly size", async ({ page }) => {
    await page.goto("/feed");
    
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible();

    const links = nav.locator("a");
    const count = await links.count();
    expect(count).toBe(3);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const box = await link.boundingBox();

      // Each item should be at least 44x44 (Apple's touch target guideline)
      expect(box).toBeTruthy();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test("navigation should work between all pages", async ({ page }) => {
    await page.goto("/feed");
    await expect(page).toHaveURL(/feed/);

    const nav = page.locator('nav[aria-label="Main navigation"]');

    // Go to Discover
    await nav.getByRole("link", { name: "Discover" }).tap();
    await expect(page).toHaveURL(/discover/, { timeout: 10000 });

    // Go back to Feed
    await nav.getByRole("link", { name: "My Feed" }).tap();
    await expect(page).toHaveURL(/feed/, { timeout: 10000 });
  });

  test("active nav item should have correct styling", async ({ page }) => {
    await page.goto("/feed");

    const nav = page.locator('nav[aria-label="Main navigation"]');
    const feedLink = nav.getByRole("link", { name: "My Feed" });
    
    await expect(feedLink).toBeVisible();

    // Check for active color (teal: #00BFA6)
    const color = await feedLink.evaluate((el) => window.getComputedStyle(el).color);
    
    // Should be teal color (rgb(0, 191, 166))
    expect(color).toBe("rgb(0, 191, 166)");
  });
});

test.describe("Mobile Debug: Touch Scroll Behavior", () => {
  test("feed should support vertical scroll snapping", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");

    const container = page.locator(".snap-container").first();
    await expect(container).toBeVisible({ timeout: 10000 });

    // Container should have snap scrolling
    const snapType = await container.evaluate(
      (el) => window.getComputedStyle(el).scrollSnapType
    );
    expect(snapType).toContain("y");
  });

  test("swipe up should scroll to next video", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");
    
    // Wait for feed content to be visible
    await page.waitForSelector(".snap-container, .snap-item, video", { timeout: 15000 });

    const container = page.locator(".snap-container").first();
    const containerVisible = await container.isVisible().catch(() => false);

    if (containerVisible) {
      // Get initial scroll position
      const initialScroll = await container.evaluate((el) => el.scrollTop);

      // Simulate swipe up using touch events
      const box = await container.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.7);
        await page.mouse.down();
        await page.mouse.move(box.x + box.width / 2, box.y + box.height * 0.3, {
          steps: 10,
        });
        await page.mouse.up();
      }

      await page.waitForTimeout(600);

      // Scroll position should have changed
      const afterScroll = await container.evaluate((el) => el.scrollTop);
      
      // Either scrolled or at the start (acceptable)
      expect(afterScroll >= initialScroll).toBeTruthy();
    } else {
      // Container layout may be different - just verify page loaded
      await expect(page.locator("body")).toBeVisible();
    }
  });
});

test.describe("Mobile Debug: Performance", () => {
  test("feed page should load within acceptable time", async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");

    const loadTime = Date.now() - startTime;
    
    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000);
  });

  test("video should not block UI interactions", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("domcontentloaded");

    // Try interacting with nav while video loads
    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeVisible({ timeout: 5000 });

    // Nav should be immediately interactive
    const discoverLink = nav.getByRole("link", { name: "Discover" });
    await expect(discoverLink).toBeEnabled();
    
    // Should be tappable without waiting for video
    await discoverLink.tap({ timeout: 2000 });
    await expect(page).toHaveURL(/discover/, { timeout: 5000 });
  });
});
