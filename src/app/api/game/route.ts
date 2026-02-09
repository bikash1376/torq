import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getToolGeneration, saveToolGeneration } from "@/app/actions/tool-generations";

export async function POST(req: NextRequest) {
    try {
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // Check cache first
        const cachedGame = await getToolGeneration("game", topic);
        if (cachedGame) {
            return NextResponse.json(cachedGame);
        }

        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        Create a single-player interactive game about "${topic}" using HTML, CSS, and JavaScript.
        The game should be rendered in a canvas or container.
        
        Requirements:
        1. Minimal but beautiful design.
        2. Educational value related to "${topic}".
        3. Interactive mechanics (clicks, drag-drop, typing, etc.).
        4. "Tambo" (the AI tutor) should not be mentioned in the game text, but the game is for a student learning the topic.
        5. DO NOT include markdown code blocks. Return PURE JSON with keys: html, css, javascript.
        6. The HTML should NOT contain the <html>, <head>, or <body> tags, just the content inside <body> (excluding script tags which go in javascript field).
        7. The CSS should be valid CSS content.
        8. The Javascript should be valid JS logic.
        
        Response format (JSON):
        {
          "html": "...",
          "css": "...",
          "javascript": "..."
        }
        `;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });

        const responseText = result.response.text();
        const generatedGame = JSON.parse(responseText);

        // Save to cache
        await saveToolGeneration("game", topic, generatedGame);

        return NextResponse.json(generatedGame);

    } catch (error: unknown) {
        console.error("Game generation error:", error);
        return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to generate game" }, { status: 500 });
    }
}
