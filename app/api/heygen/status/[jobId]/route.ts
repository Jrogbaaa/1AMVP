import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getVideoStatus } from "@/lib/heygen";

// Note: Convex integration requires running `npx convex dev` to regenerate types
// After regeneration, import and use:
// import { ConvexHttpClient } from "convex/browser";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";

/**
 * GET /api/heygen/status/[jobId]
 * Check the status of a video generation job
 * 
 * After running `npx convex dev`, uncomment the Convex integration code.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    // Authenticate the request
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { jobId } = await params;
    const doctorId = session.user.id;

    // TODO: After running `npx convex dev`, replace this mock with actual Convex query:
    // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    // const generatedVideo = await convex.query(api.generatedVideos.getById, {
    //   id: jobId as Id<"generatedVideos">,
    // });

    // For development, try to get status from HeyGen directly if jobId looks like a HeyGen ID
    // In production, this should fetch from Convex first
    
    // Check if this looks like a HeyGen video ID (they usually have a specific format)
    const isHeygenId = jobId.includes("video_") || jobId.length > 20;
    
    if (isHeygenId) {
      try {
        const heygenStatus = await getVideoStatus(jobId);
        
        return NextResponse.json({
          success: true,
          data: {
            status: heygenStatus.status,
            videoUrl: heygenStatus.videoUrl,
            thumbnailUrl: heygenStatus.thumbnailUrl,
            duration: heygenStatus.duration,
            errorMessage: heygenStatus.error,
          },
        });
      } catch (error) {
        console.error("Error fetching HeyGen status:", error);
        // Fall through to return processing status
      }
    }

    // Default response for jobs still processing or not found in HeyGen
    return NextResponse.json({
      success: true,
      data: {
        status: "processing",
        message: "Video is being generated. This typically takes 2-5 minutes.",
      },
    });
  } catch (error) {
    console.error("Error checking status:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { error: `Failed to check status: ${errorMessage}` },
      { status: 500 }
    );
  }
}

