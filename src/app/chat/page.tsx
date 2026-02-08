"use client";
import { useUser } from "@insforge/nextjs";
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
import { useSyncExternalStore } from "react";

export default function ChatPage() {
  const mcpServers = useMcpServers();
  const { user, isLoaded } = useUser();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await insforge.database
          .from("profiles")
          .select("credits")
          .eq("id", user.id)
          .single();
        if (data) {
          setCredits(data.credits);
        }
      };
      fetchProfile();
    }
  }, [user]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null; // Start redirecting via middleware or let provider handle it
  }

  // Use user ID as the stable context key for this user's session
  const userContextKey = user.id;

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <TamboProvider
        apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY!}
        tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL!}
        components={components}
        tools={tools}
        mcpServers={mcpServers}
        contextKey={userContextKey}
      >
        <TamboMcpProvider>
          <div className="flex h-full overflow-hidden">
            {/* Sidebar Profile Info */}
            <div className="absolute top-4 left-4 z-50 bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-border shadow-sm max-w-[200px]">
              <div className="text-sm font-semibold truncate">{user.profile?.name || user.email}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Credits: {credits !== null ? credits : "Loading..."}
              </div>
            </div>

            <div className="flex-1 overflow-hidden pt-16 md:pt-0"> {/* Add padding top for mobile to avoid overlap with profile */}
              <MessageThreadFull />
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
    </div>
  );
}
