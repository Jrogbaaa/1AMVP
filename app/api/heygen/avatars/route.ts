import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listAvatars, listVoices } from "@/lib/heygen";

/**
 * GET /api/heygen/avatars
 * Fetch available avatars and voices from HeyGen
 * This allows doctors to select their avatar from a dropdown
 */
export async function GET() {
  try {
    // Authenticate the request
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch avatars and voices in parallel
    const [avatars, voices] = await Promise.all([
      listAvatars(),
      listVoices(),
    ]);

    // Filter to only show custom/instant avatars (not stock avatars)
    // Custom avatars typically have specific naming patterns or metadata
    const customAvatars = avatars.filter(avatar => 
      // HeyGen instant avatars often have "instant" in the name or specific patterns
      // You may need to adjust this filter based on your HeyGen account structure
      avatar.avatar_name.toLowerCase().includes('instant') ||
      avatar.avatar_name.toLowerCase().includes('custom') ||
      !avatar.avatar_id.startsWith('stock_') // Stock avatars often have 'stock_' prefix
    );

    // Filter to show cloned/custom voices
    const customVoices = voices.filter(voice =>
      voice.voice_id.includes('_') || // Custom voices often have underscore patterns
      voice.name.toLowerCase().includes('clone') ||
      voice.name.toLowerCase().includes('instant')
    );

    return NextResponse.json({
      success: true,
      data: {
        avatars: customAvatars.length > 0 ? customAvatars : avatars,
        voices: customVoices.length > 0 ? customVoices : voices,
        // Include all for fallback if filtering is too aggressive
        allAvatars: avatars,
        allVoices: voices,
      },
    });
  } catch (error) {
    console.error("Error fetching HeyGen assets:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    // Check if it's an API key issue
    if (errorMessage.includes("HEYGEN_API_KEY")) {
      return NextResponse.json(
        { error: "HeyGen API not configured. Please contact support." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Failed to fetch avatars: ${errorMessage}` },
      { status: 500 }
    );
  }
}

