import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    currentScript?: string;
    healthCondition?: string;
  };
}

/**
 * POST /api/ai/chat
 * Chat with AI to refine scripts or get suggestions
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

    const body: ChatRequest = await request.json();
    const { messages, context } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    // Build system prompt with context
    let systemPrompt = `You are a helpful AI assistant for doctors creating patient education videos.
Your role is to:
- Help refine and improve video scripts
- Suggest topics for patient education
- Ensure medical accuracy while keeping language accessible
- Help adapt content for specific patient conditions
- Provide constructive feedback on scripts

Always be concise but helpful. When editing scripts, explain your changes briefly.`;

    if (context?.currentScript) {
      systemPrompt += `\n\nThe doctor is currently working on this script:\n"${context.currentScript}"`;
    }

    if (context?.healthCondition) {
      systemPrompt += `\n\nThe target audience has: ${context.healthCondition}`;
    }

    const allMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...messages,
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("Failed to get response from AI");
    }

    return NextResponse.json({
      success: true,
      data: {
        message: response,
        role: "assistant",
      },
    });
  } catch (error) {
    console.error("Error in AI chat:", error);
    
    if (error instanceof Error && error.message.includes("API key")) {
      return NextResponse.json(
        { error: "OpenAI API not configured" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to process chat. Please try again." },
      { status: 500 }
    );
  }
}

