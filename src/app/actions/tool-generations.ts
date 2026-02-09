"use server";

import { insforge } from "@/lib/insforge";

export type ToolGenerationType = "game" | "flashcards" | "quiz" | "fullquiz";

export async function saveToolGeneration(type: ToolGenerationType, topic: string, content: any) {
    if (!topic || !content) {
        console.log("[saveToolGeneration] Skipped - missing topic or content");
        return { success: false, error: "Missing topic or content" };
    }

    try {
        console.log(`[saveToolGeneration] Saving ${type} for topic: "${topic}"`);

        const payload = {
            type,
            topic,
            content,
            updated_at: new Date().toISOString()
        };

        const { data, error } = await insforge.database
            .from("tool_generations")
            .upsert(payload, {
                onConflict: "type,topic",
            })
            .select();

        if (error) {
            console.error("[saveToolGeneration] Error:", error);
            return { success: false, error };
        }

        console.log("[saveToolGeneration] Success:", data);
        return { success: true, data };
    } catch (err) {
        console.error("[saveToolGeneration] Exception:", err);
        return { success: false, error: err };
    }
}

export async function getToolGeneration(type: ToolGenerationType, topic: string) {
    if (!topic) {
        console.log("[getToolGeneration] Skipped - missing topic");
        return null;
    }

    try {
        console.log(`[getToolGeneration] Fetching ${type} for topic: "${topic}"`);

        const { data, error } = await insforge.database
            .from("tool_generations")
            .select("content")
            .eq("type", type)
            .eq("topic", topic)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // No rows found - this is expected for new content
                console.log("[getToolGeneration] Not found (expected for new content)");
            } else {
                console.error("[getToolGeneration] Error:", error);
            }
            return null;
        }

        console.log("[getToolGeneration] Found:", !!data);
        return data?.content || null;
    } catch (err) {
        console.error("[getToolGeneration] Exception:", err);
        return null;
    }
}
