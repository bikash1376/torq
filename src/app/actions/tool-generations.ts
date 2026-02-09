"use server";

import { insforge } from "@/lib/insforge";

export type ToolGenerationType = "game" | "flashcards" | "quiz" | "fullquiz";

export async function saveToolGeneration(type: ToolGenerationType, topic: string, content: any) {
    if (!topic || !content) return;

    try {
        const { error } = await (insforge as any)
            .from("tool_generations")
            .upsert({
                type,
                topic,
                content,
                updated_at: new Date().toISOString()
            }, { onConflict: "type, topic" });

        if (error) {
            console.error("Error saving tool generation:", error);
        }
    } catch (err) {
        console.error("Exception saving tool generation:", err);
    }
}

export async function getToolGeneration(type: ToolGenerationType, topic: string) {
    if (!topic) return null;

    try {
        const { data, error } = await (insforge as any)
            .from("tool_generations")
            .select("content")
            .eq("type", type)
            .eq("topic", topic)
            .single();

        if (error) {
            // It's normal not to find it if it hasn't been generated yet
            return null;
        }

        return data?.content || null;
    } catch (err) {
        console.error("Exception getting tool generation:", err);
        return null;
    }
}
