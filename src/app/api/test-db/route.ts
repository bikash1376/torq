import { NextRequest, NextResponse } from "next/server";
import { saveToolGeneration, getToolGeneration } from "@/app/actions/tool-generations";

export async function POST(req: NextRequest) {
    try {
        const { action } = await req.json();

        if (action === "save") {
            const testData = {
                cards: [
                    { front: "What is 2+2?", back: "4" },
                    { front: "What is the capital of France?", back: "Paris" },
                    { front: "What color is the sky?", back: "Blue" },
                    { front: "Who wrote Romeo and Juliet?", back: "Shakespeare" },
                    { front: "What is H2O?", back: "Water" }
                ]
            };

            console.log("[test-db] Attempting to save test flashcards...");
            const result = await saveToolGeneration("flashcards", "database-test", testData);
            console.log("[test-db] Save result:", result);

            return NextResponse.json({
                success: true,
                action: "save",
                result
            });
        } else if (action === "fetch") {
            console.log("[test-db] Attempting to fetch test flashcards...");
            const result = await getToolGeneration("flashcards", "database-test");
            console.log("[test-db] Fetch result:", result);

            return NextResponse.json({
                success: true,
                action: "fetch",
                result
            });
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
    } catch (error: unknown) {
        console.error("[test-db] Error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        }, { status: 500 });
    }
}
