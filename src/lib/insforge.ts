import { createClient } from "@insforge/sdk";
import { type InsForgeClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || "https://66tcnajv.ap-southeast.insforge.app";
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NjY4MzJ9.x8vJDM7rKv-tbwdH0rCM57UxHobm_XU0WEvmfXAadXg";

export const insforge: InsForgeClient = createClient({
    baseUrl,
    anonKey,
});
