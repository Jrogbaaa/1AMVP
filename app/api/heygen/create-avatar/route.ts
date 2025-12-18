import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/heygen/create-avatar
 * Upload a video and create an instant avatar via HeyGen API
 * 
 * Note: HeyGen's Instant Avatar API requires:
 * 1. Upload video to get a URL
 * 2. Call the instant avatar creation endpoint
 * 
 * API Docs: https://docs.heygen.com/reference/create-instant-avatar
 */

const HEYGEN_API_BASE = "https://api.heygen.com";

interface HeyGenUploadResponse {
  error: null | string;
  data: {
    url: string;
  };
}

interface HeyGenCreateAvatarResponse {
  error: null | string;
  data: {
    avatar_id: string;
    status: "pending" | "processing" | "completed" | "failed";
  };
}

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

    const apiKey = process.env.HEYGEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "HeyGen API key not configured" },
        { status: 500 }
      );
    }

    // Get the uploaded video from form data
    const formData = await request.formData();
    const videoFile = formData.get("video") as File | null;

    if (!videoFile) {
      return NextResponse.json(
        { error: "No video file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!videoFile.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a video file." },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024;
    if (videoFile.size > maxSize) {
      return NextResponse.json(
        { error: "Video file too large. Maximum size is 100MB." },
        { status: 400 }
      );
    }

    // Step 1: Upload video to HeyGen to get a URL
    // HeyGen requires the video to be accessible via URL
    // In production, you might upload to S3/Cloudinary first
    
    // For now, we'll use HeyGen's file upload endpoint
    const uploadFormData = new FormData();
    uploadFormData.append("file", videoFile);

    const uploadResponse = await fetch(`${HEYGEN_API_BASE}/v1/asset`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("HeyGen upload error:", errorText);
      throw new Error("Failed to upload video to HeyGen");
    }

    const uploadData: HeyGenUploadResponse = await uploadResponse.json();
    
    if (uploadData.error) {
      throw new Error(uploadData.error);
    }

    const videoUrl = uploadData.data.url;

    // Step 2: Create instant avatar from the uploaded video
    const createAvatarResponse = await fetch(`${HEYGEN_API_BASE}/v2/avatars/instant`, {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        video_url: videoUrl,
        avatar_name: `Dr. ${session.user.name || session.user.email?.split("@")[0] || "User"} Avatar`,
      }),
    });

    if (!createAvatarResponse.ok) {
      const errorText = await createAvatarResponse.text();
      console.error("HeyGen create avatar error:", errorText);
      
      // Check for specific error types
      if (createAvatarResponse.status === 400) {
        return NextResponse.json(
          { error: "Invalid video format or quality. Please ensure good lighting and clear audio." },
          { status: 400 }
        );
      }
      
      throw new Error("Failed to create avatar");
    }

    const avatarData: HeyGenCreateAvatarResponse = await createAvatarResponse.json();

    if (avatarData.error) {
      throw new Error(avatarData.error);
    }

    // Return success with avatar ID
    // The avatar will be in "pending" or "processing" state initially
    return NextResponse.json({
      success: true,
      data: {
        avatarId: avatarData.data.avatar_id,
        status: avatarData.data.status,
        message: "Avatar creation started. This may take a few minutes.",
      },
    });
  } catch (error) {
    console.error("Error creating avatar:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    
    return NextResponse.json(
      { error: `Failed to create avatar: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/heygen/create-avatar?avatarId=xxx
 * Check the status of an avatar creation job
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const apiKey = process.env.HEYGEN_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "HeyGen API key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const avatarId = searchParams.get("avatarId");

    if (!avatarId) {
      return NextResponse.json(
        { error: "Avatar ID is required" },
        { status: 400 }
      );
    }

    // Check avatar status
    const response = await fetch(`${HEYGEN_API_BASE}/v2/avatars/${avatarId}`, {
      method: "GET",
      headers: {
        "X-Api-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to get avatar status");
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        avatarId: data.data.avatar_id,
        status: data.data.status,
        previewUrl: data.data.preview_image_url,
        previewVideoUrl: data.data.preview_video_url,
      },
    });
  } catch (error) {
    console.error("Error getting avatar status:", error);
    
    return NextResponse.json(
      { error: "Failed to get avatar status" },
      { status: 500 }
    );
  }
}

