/**
 * HeyGen API Client
 * Handles video generation with AI avatars
 * API Docs: https://docs.heygen.com/docs/create-avatar-videos-v2
 */

// Types for HeyGen API
export interface HeyGenVideoInput {
  character: {
    type: "avatar";
    avatar_id: string;
    avatar_style?: "normal" | "circle" | "closeUp";
  };
  voice: {
    type: "text";
    input_text: string;
    voice_id: string;
    speed?: number; // 0.5 - 1.5
  };
  background?: {
    type: "color" | "image" | "video";
    value: string;
  };
}

export interface HeyGenGenerateRequest {
  video_inputs: HeyGenVideoInput[];
  dimension?: {
    width: number;
    height: number;
  };
  aspect_ratio?: "16:9" | "9:16" | "1:1";
  callback_id?: string;
}

export interface HeyGenGenerateResponse {
  error: null | string;
  data: {
    video_id: string;
  };
}

export interface HeyGenVideoStatusResponse {
  error: null | string;
  data: {
    video_id: string;
    status: "pending" | "processing" | "completed" | "failed";
    video_url?: string;
    thumbnail_url?: string;
    duration?: number;
    gif_url?: string;
    error?: string;
  };
}

export interface HeyGenAvatarListResponse {
  error: null | string;
  data: {
    avatars: Array<{
      avatar_id: string;
      avatar_name: string;
      gender: string;
      preview_image_url: string;
      preview_video_url: string;
    }>;
  };
}

export interface HeyGenVoiceListResponse {
  error: null | string;
  data: {
    voices: Array<{
      voice_id: string;
      name: string;
      language: string;
      gender: string;
      preview_audio: string;
    }>;
  };
}

// Configuration
const HEYGEN_API_BASE = "https://api.heygen.com";
const HEYGEN_API_VERSION = "v2";

/**
 * Get HeyGen API key from environment
 */
const getApiKey = (): string => {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) {
    throw new Error("HEYGEN_API_KEY environment variable is not set");
  }
  return apiKey;
};

/**
 * Make authenticated request to HeyGen API
 */
const heygenFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const apiKey = getApiKey();
  
  const response = await fetch(`${HEYGEN_API_BASE}/${HEYGEN_API_VERSION}${endpoint}`, {
    ...options,
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HeyGen API error (${response.status}): ${errorText}`);
  }

  return response.json();
};

/**
 * Generate a video using HeyGen API
 * @param avatarId - The doctor's trained avatar ID
 * @param voiceId - The voice ID to use
 * @param script - The text script for the avatar to speak
 * @param callbackId - Optional ID for webhook callback
 * @returns Video generation job ID
 */
export const generateVideo = async (
  avatarId: string,
  voiceId: string,
  script: string,
  callbackId?: string
): Promise<{ videoId: string }> => {
  const request: HeyGenGenerateRequest = {
    video_inputs: [
      {
        character: {
          type: "avatar",
          avatar_id: avatarId,
          avatar_style: "normal",
        },
        voice: {
          type: "text",
          input_text: script,
          voice_id: voiceId,
          speed: 1.0,
        },
      },
    ],
    dimension: {
      width: 1920,
      height: 1080,
    },
    ...(callbackId && { callback_id: callbackId }),
  };

  const response = await heygenFetch<HeyGenGenerateResponse>(
    "/video/generate",
    {
      method: "POST",
      body: JSON.stringify(request),
    }
  );

  if (response.error) {
    throw new Error(`HeyGen generation error: ${response.error}`);
  }

  return { videoId: response.data.video_id };
};

/**
 * Check the status of a video generation job
 * @param videoId - The video ID returned from generateVideo
 * @returns Video status and URL if completed
 */
export const getVideoStatus = async (
  videoId: string
): Promise<{
  status: "pending" | "processing" | "completed" | "failed";
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  error?: string;
}> => {
  const response = await heygenFetch<HeyGenVideoStatusResponse>(
    `/video_status.get?video_id=${videoId}`,
    { method: "GET" }
  );

  if (response.error) {
    throw new Error(`HeyGen status error: ${response.error}`);
  }

  return {
    status: response.data.status,
    videoUrl: response.data.video_url,
    thumbnailUrl: response.data.thumbnail_url,
    duration: response.data.duration,
    error: response.data.error,
  };
};

/**
 * List available avatars (including trained custom avatars)
 * @returns List of available avatars
 */
export const listAvatars = async (): Promise<HeyGenAvatarListResponse["data"]["avatars"]> => {
  const response = await heygenFetch<HeyGenAvatarListResponse>(
    "/avatars",
    { method: "GET" }
  );

  if (response.error) {
    throw new Error(`HeyGen avatars error: ${response.error}`);
  }

  return response.data.avatars;
};

/**
 * List available voices
 * @returns List of available voices
 */
export const listVoices = async (): Promise<HeyGenVoiceListResponse["data"]["voices"]> => {
  const response = await heygenFetch<HeyGenVoiceListResponse>(
    "/voices",
    { method: "GET" }
  );

  if (response.error) {
    throw new Error(`HeyGen voices error: ${response.error}`);
  }

  return response.data.voices;
};

/**
 * Validate webhook signature from HeyGen
 * @param payload - Raw request body
 * @param signature - X-Signature header value
 * @returns Whether the signature is valid
 */
export const validateWebhookSignature = (
  payload: string,
  signature: string
): boolean => {
  const webhookSecret = process.env.HEYGEN_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn("HEYGEN_WEBHOOK_SECRET not set, skipping signature validation");
    return true;
  }

  // HeyGen uses HMAC-SHA256 for webhook signatures
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(payload)
    .digest("hex");

  return signature === expectedSignature;
};

/**
 * Parse HeyGen webhook payload
 */
export interface HeyGenWebhookPayload {
  event_type: "video.completed" | "video.failed";
  video_id: string;
  callback_id?: string;
  status: "completed" | "failed";
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
  error?: string;
}

export const parseWebhookPayload = (body: unknown): HeyGenWebhookPayload => {
  const payload = body as HeyGenWebhookPayload;
  
  if (!payload.event_type || !payload.video_id) {
    throw new Error("Invalid webhook payload");
  }

  return payload;
};

