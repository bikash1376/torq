"use client";
// import { useUser, UserButton } from "@insforge/nextjs";
import { insforge } from "@/lib/insforge";
import { useEffect, useState } from "react";
import { useMcpServers } from "@/components/tambo/mcp-config-modal";
import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import ComponentsCanvas from "@/components/ui/components-canvas";
import { InteractableCanvasDetails } from "@/components/ui/interactable-canvas-details";
import { InteractableTabs } from "@/components/ui/interactable-tabs";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";
import { TamboMcpProvider } from "@tambo-ai/react/mcp";
import { ErrorBoundary } from "@/components/error-boundary";
import { User } from "lucide-react";

export default function ChatPage() {
  const mcpServers = useMcpServers();

  // MOCK USER FOR DEMO
  const user = {
    id: "demo-user-id",
    email: "demo@example.com",
    profile: { name: "Demo User" }
  };
  const credits = 999;

  // Use user ID as the stable context key for this user's session
  const userContextKey = user.id;

  console.log("Tambo Config:", {
    apiKey: process.env.NEXT_PUBLIC_TAMBO_API_KEY ? "Present" : "Missing",
    url: process.env.NEXT_PUBLIC_TAMBO_URL || "https://api.tambo.ai/v1"
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <ErrorBoundary>
        <TamboProvider
          apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
          components={components}
          tools={tools}
          mcpServers={mcpServers}
          contextKey={userContextKey}
        >
          <TamboMcpProvider>
            <div className="flex h-full overflow-hidden">
              <div className="flex-1 overflow-hidden">
                <ErrorBoundary>
                  <MessageThreadFull
                    userButton={
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    }
                    userDetails={{
                      name: "Demo User",
                      credits: credits,
                    }}
                  />
                </ErrorBoundary>
              </div>
              <div className="hidden md:block w-[60%] overflow-auto">
                {/* Tabs interactable manages tabs state only */}
                <InteractableTabs interactableId="Tabs" />

                {/* Canvas details for active tab charts */}
                <InteractableCanvasDetails interactableId="CanvasDetails" />

                {/* Visual canvas renderer for the active tab */}
                <ComponentsCanvas className="h-full" />
              </div>
            </div>
          </TamboMcpProvider>
        </TamboProvider>
      </ErrorBoundary>
    </div>
  );
}
