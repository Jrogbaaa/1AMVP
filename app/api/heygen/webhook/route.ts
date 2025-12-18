import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature, parseWebhookPayload } from "@/lib/heygen";

// Note: Convex integration requires running `npx convex dev` to regenerate types
// After regeneration, import and use:
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";

/**
 * POST /api/heygen/webhook
 * Handle HeyGen webhook callbacks when video generation completes
 * 
 * After running `npx convex dev`, uncomment the Convex integration code.
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

    // TODO: After running `npx convex dev`, uncomment:
    // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    // const job = await convex.query(api.videoGenerationJobs.getByHeygenJobId, {
    //   heygenJobId: payload.video_id,
    // });
    //
    // if (!job) {
    //   console.error(`Job not found for video_id: ${payload.video_id}`);
    //   return NextResponse.json({ received: true, error: "Job not found" });
    // }

    // For now, just log the webhook payload
    if (payload.status === "completed") {
      console.log(`Video generation completed: ${payload.video_id}`);
      console.log(`Video URL: ${payload.video_url}`);
      console.log(`Thumbnail: ${payload.thumbnail_url}`);
      
      // TODO: Update Convex records after type regeneration
      // await convex.mutation(api.videoGenerationJobs.updateStatus, { ... });
      // await convex.mutation(api.generatedVideos.updateAfterGeneration, { ... });
    } else if (payload.status === "failed") {
      console.error(`Video generation failed: ${payload.video_id}`, payload.error);
      
      // TODO: Update Convex records after type regeneration
      // await convex.mutation(api.videoGenerationJobs.updateStatus, { ... });
      // await convex.mutation(api.generatedVideos.updateAfterGeneration, { ... });
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

