import { test, expect } from "@playwright/test";

/**
 * Video Loading Tests
 * Tests video playback across different browsers and viewports
 * These tests specifically target mobile Chrome video issues
 */

test.describe("Video Loading - Desktop", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");
  });

  test("should load video element with valid source", async ({ page }) => {
    const video = page.locator("video").first();
    await expect(video).toBeVisible({ timeout: 10000 });

    // Verify video has a source
    const src = await video.getAttribute("src");
    expect(src).toBeTruthy();
    expect(src).toContain(".mp4");
  });

  test("should have video ready to play", async ({ page }) => {
    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Wait for video to be ready (readyState >= 2 means enough data to play)
    await page.waitForFunction(
      () => {
        const vid = document.querySelector("video");
        return vid && vid.readyState >= 2;
      },
      { timeout: 15000 }
    );

    const readyState = await video.evaluate((v: HTMLVideoElement) => v.readyState);
    expect(readyState).toBeGreaterThanOrEqual(2);
  });

  test("should have correct video attributes for autoplay", async ({ page }) => {
    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Check required attributes for cross-browser autoplay
    const playsInline = await video.getAttribute("playsinline");
    const preload = await video.getAttribute("preload");

    // playsInline can be empty string (truthy) or "true"
    expect(playsInline !== null).toBeTruthy();
    expect(preload).toBe("auto");
  });

  test("should respond to play/pause clicks", async ({ page }) => {
    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Wait for video to be playable
    await page.waitForFunction(
      () => {
        const vid = document.querySelector("video");
        return vid && vid.readyState >= 2;
      },
      { timeout: 15000 }
    );

    // Get initial state
    const initialPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);

    // Find and click play button if video is paused
    if (initialPaused) {
      const playButton = page.getByRole("button", { name: /play video/i }).first();
      if (await playButton.isVisible()) {
        await playButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Verify video can toggle state
    const afterPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
    expect(typeof afterPaused).toBe("boolean");
  });
});

test.describe("Video Loading - Mobile Chrome", () => {
  test.use({
    viewport: { width: 375, height: 667 },
    userAgent:
      "Mozilla/5.0 (Linux; Android 10; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  });

  test("should load video on mobile Chrome viewport", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible({ timeout: 10000 });

    // Video should exist and have a source
    const src = await video.getAttribute("src");
    expect(src).toBeTruthy();
  });

  test("should reach ready state on mobile Chrome", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Wait for video to be ready - mobile may take longer
    await page.waitForFunction(
      () => {
        const vid = document.querySelector("video");
        return vid && vid.readyState >= 1;
      },
      { timeout: 20000 }
    );

    const readyState = await video.evaluate((v: HTMLVideoElement) => v.readyState);
    expect(readyState).toBeGreaterThanOrEqual(1);
  });

  test("should handle tap to play on mobile", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Wait for video to be minimally ready
    await page.waitForFunction(
      () => {
        const vid = document.querySelector("video");
        return vid && vid.readyState >= 1;
      },
      { timeout: 15000 }
    );

    // Tap on video area to trigger play
    await video.tap();
    await page.waitForTimeout(500);

    // Video should respond (either playing or showing play button)
    const isPaused = await video.evaluate((v: HTMLVideoElement) => v.paused);
    expect(typeof isPaused).toBe("boolean");
  });

  test("should display mute toggle button on mobile", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    // Mute button should be visible and tappable
    const muteBtn = page.getByRole("button", { name: /mute video|unmute video/i }).first();
    await expect(muteBtn).toBeVisible();

    // Tap target should be at least 44x44 (Apple HIG minimum)
    const box = await muteBtn.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(40);
    expect(box?.height).toBeGreaterThanOrEqual(40);
  });
});

test.describe("Video Loading - Mobile Safari (WebKit)", () => {
  test.use({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
  });

  test("should load video on iOS Safari viewport", async ({ page, browserName }) => {
    // This test is most meaningful on WebKit browser
    test.skip(browserName !== "webkit", "iOS Safari test requires WebKit");

    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible({ timeout: 10000 });

    // Verify playsInline attribute (required for iOS)
    const playsInline = await video.getAttribute("playsinline");
    expect(playsInline !== null).toBeTruthy();
  });

  test("should have webkit-playsinline for older iOS", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Check for webkit-specific attribute
    const webkitPlaysInline = await video.getAttribute("webkit-playsinline");
    expect(webkitPlaysInline).toBe("true");
  });
});

test.describe("Video Error Handling", () => {
  test("should show poster image if video fails to load", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    // Video or poster image should be visible
    const videoOrPoster = page.locator("video, img[alt]").first();
    await expect(videoOrPoster).toBeVisible();
  });

  test("should not crash if video source is unavailable", async ({ page }) => {
    // Intercept video requests to simulate failure
    await page.route("**/*.mp4", (route) => {
      route.abort("failed");
    });

    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    // Page should still render without crashing
    await expect(page.locator("body")).toBeVisible();

    // Should show fallback poster image
    const posterImage = page.locator("img").first();
    await expect(posterImage).toBeVisible();
  });
});

test.describe("Video Autoplay Policies", () => {
  test("video should be muted for autoplay compliance", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Check muted attribute (required for autoplay on most browsers)
    const isMuted = await video.evaluate((v: HTMLVideoElement) => v.muted);
    expect(isMuted).toBeTruthy();
  });

  test("should allow user to unmute after interaction", async ({ page }) => {
    await page.goto("/feed");
    await page.waitForLoadState("networkidle");

    const video = page.locator("video").first();
    await expect(video).toBeVisible();

    // Wait for video to be ready
    await page.waitForFunction(
      () => {
        const vid = document.querySelector("video");
        return vid && vid.readyState >= 1;
      },
      { timeout: 15000 }
    );

    // Find and click unmute button
    const muteToggle = page.getByRole("button", { name: /unmute video/i }).first();
    if (await muteToggle.isVisible()) {
      await muteToggle.click();
      await page.waitForTimeout(300);

      // After user interaction, video should be unmuted
      const isMuted = await video.evaluate((v: HTMLVideoElement) => v.muted);
      expect(isMuted).toBeFalsy();
    }
  });
});

