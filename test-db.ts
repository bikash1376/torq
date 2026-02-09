import { insforge } from "@/lib/insforge";

const testDatabaseOperations = async () => {
    console.log("\n==================== DATABASE TEST START ====================\n");

    // Test 1: Direct insert
    console.log("Test 1: Direct insert");
    try {
        const result = await insforge.database
            .from("tool_generations")
            .insert({
                type: "flashcards",
                topic: "test-direct-insert",
                content: { cards: [{ front: "Test", back: "Answer" }] }
            })
            .select();

        console.log("✅ Insert successful:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.log("❌ Insert failed:", error);
    }

    // Test 2: Upsert (insert or update)
    console.log("\nTest 2: Upsert operation");
    try {
        const result = await insforge.database
            .from("tool_generations")
            .upsert({
                type: "flashcards",
                topic: "test-upsert",
                content: { cards: [{ front: "Question", back: "Answer" }] },
                updated_at: new Date().toISOString()
            }, {
                onConflict: "type,topic"
            })
            .select();

        console.log("✅ Upsert successful:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.log("❌ Upsert failed:", error);
    }

    // Test 3: Select/Fetch
    console.log("\nTest 3: Fetch operation");
    try {
        const result = await insforge.database
            .from("tool_generations")
            .select("content")
            .eq("type", "flashcards")
            .eq("topic", "test-upsert")
            .single();

        console.log("✅ Fetch successful:", JSON.stringify(result, null, 2));
    } catch (error) {
        console.log("❌ Fetch failed:", error);
    }

    // Test 4: Check all records
    console.log("\nTest 4: List all records");
    try {
        const result = await insforge.database
            .from("tool_generations")
            .select("*");

        console.log("✅ List successful. Found", result.data?.length, "records");
        console.log(JSON.stringify(result.data, null, 2));
    } catch (error) {
        console.log("❌ List failed:", error);
    }

    console.log("\n==================== DATABASE TEST END ====================\n");
};

testDatabaseOperations();
