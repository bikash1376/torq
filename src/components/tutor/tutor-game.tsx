"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Loader2, RefreshCw, Maximize2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

export const tutorGameSchema = z.object({
    topic: z.string().describe("Topic of the game"),
    html: z.string().describe("HTML content for the game"),
    css: z.string().describe("CSS content for the game"),
    javascript: z.string().describe("JavaScript logic for the game"),
});

export type TutorGameProps = z.infer<typeof tutorGameSchema>;

export function TutorGame({ topic, html, css, javascript }: TutorGameProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const renderGame = (doc: Document) => {
        doc.open();
        doc.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${topic}</title>
                <style>
                    body { margin: 0; overflow: hidden; font-family: system-ui, sans-serif; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script>
                    ${javascript}
                </script>
            </body>
            </html>
        `);
        doc.close();
    };

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                renderGame(doc);
                setIsLoading(false);
            }
        }
    }, [topic, html, css, javascript, isFullscreen]); // Re-render when fullscreen changes to ensure fresh state if needed

    const handleReset = () => {
        setIsLoading(true);
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            // doc?.location.reload(); // Might not work with doc.write
            if (doc) {
                renderGame(doc);
            }
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const GameFrame = () => (
        <div className="w-full h-full flex flex-col bg-white rounded-lg overflow-hidden">
            <div className="p-2 bg-gray-100 border-b flex justify-between items-center px-4">
                <h3 className="font-bold text-gray-800 truncate">{topic}</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                        title="Restart Game"
                    >
                        <RefreshCw className="h-4 w-4 text-gray-600" />
                    </button>
                    {!isFullscreen && (
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            title="Fullscreen"
                        >
                            <Maximize2 className="h-4 w-4 text-gray-600" />
                        </button>
                    )}
                    {isFullscreen && (
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
                            title="Close Fullscreen"
                        >
                            <X className="h-4 w-4 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    className="w-full h-full border-none block"
                    sandbox="allow-scripts allow-modals allow-popups allow-forms allow-same-origin"
                    title={`${topic} Game`}
                />
            </div>
        </div>
    );

    if (isFullscreen) {
        return (
            <Dialog.Root open={isFullscreen} onOpenChange={setIsFullscreen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
                    <Dialog.Content className="fixed inset-4 z-50 outline-none">
                        <GameFrame />
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        );
    }

    return (
        <div className="w-full h-[500px] border border-border rounded-xl shadow-lg relative bg-background">
            <GameFrame />
        </div>
    );
}

