import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature, parseWebhookPayload } from "@/lib/heygen";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const getConvexClient = (): ConvexHttpClient | null => {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL not configured");
    return null;
  }
  return new ConvexHttpClient(url);
};

/**
 * POST /api/heygen/webhook
 * Handle HeyGen webhook callbacks when video generation completes
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature validation
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature") || "";

    // Validate webhook signature
    if (!validateWebhookSignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const payload = parseWebhookPayload(JSON.parse(rawBody));

    console.log("HeyGen webhook received:", {
      event_type: payload.event_type,
      video_id: payload.video_id,
      status: payload.status,
    });

    const convex = getConvexClient();
    if (!convex) {
      // Still acknowledge webhook to prevent retries
      return NextResponse.json({
        received: true,
        error: "Database not configured",
      });
    }

    // Look up the job by HeyGen video ID
    const job = await convex.query(api.videoGenerationJobs.getByHeygenJobId, {
      heygenJobId: payload.video_id,
    });

    if (!job) {
      console.error(`Job not found for video_id: ${payload.video_id}`);
      return NextResponse.json({ received: true, error: "Job not found" });
    }

    if (payload.status === "completed") {
      console.log(`Video generation completed: ${payload.video_id}`);
      console.log(`Video URL: ${payload.video_url}`);
      console.log(`Thumbnail: ${payload.thumbnail_url}`);

      // Update job status
      await convex.mutation(api.videoGenerationJobs.updateStatus, {
        heygenJobId: payload.video_id,
        status: "completed",
        progress: 100,
      });

      // Update generated video with URLs
      await convex.mutation(api.generatedVideos.updateAfterGeneration, {
        id: job.generatedVideoId,
        status: "completed",
        videoUrl: payload.video_url,
        thumbnailUrl: payload.thumbnail_url,
        duration: payload.duration,
      });
    } else if (payload.status === "failed") {
      console.error(`Video generation failed: ${payload.video_id}`, payload.error);

      // Update job status with error
      await convex.mutation(api.videoGenerationJobs.updateStatus, {
        heygenJobId: payload.video_id,
        status: "failed",
        errorMessage: payload.error || "Unknown error",
      });

      // Update generated video status
      await convex.mutation(api.generatedVideos.updateAfterGeneration, {
        id: job.generatedVideoId,
        status: "failed",
        errorMessage: payload.error || "Video generation failed",
      });
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);

    // Return 200 to prevent HeyGen from retrying indefinitely
    return NextResponse.json({
      received: true,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * GET /api/heygen/webhook
 * Health check endpoint for webhook verification
 */
export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "heygen-webhook" });
}

