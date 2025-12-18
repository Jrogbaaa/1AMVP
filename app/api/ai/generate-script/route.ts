import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GenerateScriptRequest {
  topic: string;
  healthCondition?: string;
  tone?: "professional" | "friendly" | "empathetic" | "educational";
  duration?: "short" | "medium" | "long"; // 30s, 1min, 2min
  additionalContext?: string;
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

/**
 * POST /api/ai/generate-script
 * Generate a medical script using OpenAI
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

    const body: GenerateScriptRequest = await request.json();
    const { topic, healthCondition, tone = "friendly", duration = "medium", additionalContext } = body;

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Calculate target word count based on duration (avg speaking rate: 150 words/min)
    const wordCountMap = {
      short: 75,   // ~30 seconds
      medium: 150, // ~1 minute
      long: 300,   // ~2 minutes
    };
    const targetWords = wordCountMap[duration];

    // Build the system prompt
    const systemPrompt = `You are a medical content writer helping doctors create patient education videos. 
Your scripts should be:
- Medically accurate but easy to understand
- Written in a ${tone} tone
- Approximately ${targetWords} words (about ${duration === "short" ? "30 seconds" : duration === "medium" ? "1 minute" : "2 minutes"})
- Structured with a clear beginning, middle, and end
- Written in first person as if the doctor is speaking directly to the patient
- Free of complex medical jargon (or explain terms when necessary)
- Empowering and actionable for patients

Format the script as natural speech - no stage directions, no headers, just the words the doctor will say.`;

    // Build the user prompt
    let userPrompt = `Write a patient education video script about: ${topic}`;
    
    if (healthCondition) {
      userPrompt += `\n\nThis is specifically for patients with: ${healthCondition}`;
    }
    
    if (additionalContext) {
      userPrompt += `\n\nAdditional context from the doctor: ${additionalContext}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const script = completion.choices[0]?.message?.content;

    if (!script) {
      throw new Error("Failed to generate script");
    }

    // Calculate approximate duration
    const wordCount = script.split(/\s+/).length;
    const estimatedDuration = Math.round(wordCount / 2.5); // seconds at 150 wpm

    return NextResponse.json({
      success: true,
      data: {
        script,
        wordCount,
        estimatedDuration,
        topic,
        tone,
      },
    });
  } catch (error) {
    console.error("Error generating script:", error);
    
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "OpenAI API not configured. Please add OPENAI_API_KEY to environment variables." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate script. Please try again." },
      { status: 500 }
    );
  }
}

