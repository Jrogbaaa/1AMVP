import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateVideo } from "@/lib/heygen";

// Note: This implementation uses a direct fetch approach since Convex types
// need regeneration after schema changes. Run `npx convex dev` to update types.
// For now, we'll structure this as a mock implementation that can be wired up
// once Convex types are regenerated.

interface GenerateRequestBody {
  templateId?: string;
  title: string;
  script: string;
  description?: string;
}

// Mock doctor profile for development - replace with Convex query after running `npx convex dev`
interface DoctorProfile {
  doctorId: string;
  heygenAvatarId: string | null;
  heygenVoiceId: string | null;
  avatarStatus: "not_configured" | "pending" | "active" | "error";
}

// Temporary mock function - will be replaced with actual Convex queries
const getDoctorProfile = async (doctorId: string): Promise<DoctorProfile | null> => {
  // TODO: Replace with actual Convex query after running `npx convex dev`
  // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  // return await convex.query(api.doctorProfiles.getByDoctorId, { doctorId });
  
  // For development, return mock profile
  // In production, this should fetch from Convex
  return {
    doctorId,
    heygenAvatarId: process.env.HEYGEN_DEFAULT_AVATAR_ID || null,
    heygenVoiceId: process.env.HEYGEN_DEFAULT_VOICE_ID || null,
    avatarStatus: "active",
  };
};

/**
 * POST /api/heygen/generate
 * Submit a video generation request to HeyGen
 * 
 * After running `npx convex dev`, uncomment the Convex integration code
 * and remove the mock implementations.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const doctorId = session.user.id;

    // Parse request body
    const body: GenerateRequestBody = await request.json();
    const { templateId, title, script, description } = body;

    if (!title || !script) {
      return NextResponse.json(
        { error: "Title and script are required" },
        { status: 400 }
      );
    }

    // Get doctor profile with HeyGen credentials
    const doctorProfile = await getDoctorProfile(doctorId);

    if (!doctorProfile) {
      return NextResponse.json(
        { error: "Doctor profile not found. Please complete your profile setup." },
        { status: 404 }
      );
    }

    if (!doctorProfile.heygenAvatarId || !doctorProfile.heygenVoiceId) {
      return NextResponse.json(
        { error: "HeyGen avatar or voice not configured. Please add your HeyGen credentials in Settings." },
        { status: 400 }
      );
    }

    if (doctorProfile.avatarStatus !== "active") {
      return NextResponse.json(
        { error: "HeyGen avatar is not active. Please verify your avatar configuration in Settings." },
        { status: 400 }
      );
    }

    // Generate a temporary video ID for tracking (in production, this comes from Convex)
    const generatedVideoId = `gen_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate callback ID for webhook
    const callbackId = `${doctorId}_${generatedVideoId}`;

    // Call HeyGen API to generate video
    const { videoId: heygenVideoId } = await generateVideo(
      doctorProfile.heygenAvatarId,
      doctorProfile.heygenVoiceId,
      script,
      callbackId
    );

    // TODO: After running `npx convex dev`, uncomment and use:
    // const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    // const generatedVideo = await convex.mutation(api.generatedVideos.create, { ... });
    // await convex.mutation(api.videoGenerationJobs.create, { ... });
    // await convex.mutation(api.generatedVideos.updateHeygenId, { ... });

    return NextResponse.json({
      success: true,
      data: {
        generatedVideoId,
        heygenVideoId,
        status: "generating",
        message: "Video generation started. You will be notified when complete.",
      },
    });
  } catch (error) {
    console.error("Error generating video:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { error: `Failed to generate video: ${errorMessage}` },
      { status: 500 }
    );
  }
}

