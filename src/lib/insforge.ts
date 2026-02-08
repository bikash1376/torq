
import { createClient } from "@insforge/sdk";
import { type InsForgeClient } from "@insforge/sdk";

export const insforge: InsForgeClient = createClient({
    baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
    anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});
