"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Search, ExternalLink, Globe, Loader2 } from "lucide-react";

// Schema for Web Search props
export const webSearchSchema = z.object({
    query: z.string().describe("The search query to look up"),
    results: z.array(z.object({
        title: z.string(),
        url: z.string(),
        content: z.string(),
    })).optional().describe("Search results returned from the API"),
    isSearching: z.boolean().optional().describe("Whether the search is in progress"),
});

export type WebSearchProps = z.infer<typeof webSearchSchema>;

export function WebSearch({ query, results = [], isSearching = false }: WebSearchProps) {
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white">
                    <Globe className="w-5 h-5" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        Web Search
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                        <Search className="w-3 h-3" />
                        {query}
                    </p>
                </div>
                {isSearching && (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                )}
            </div>

            {/* Results */}
            <div className="p-4 space-y-3">
                {isSearching ? (
                    <div className="flex items-center justify-center py-8 text-zinc-500">
                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                        <span>Searching the web...</span>
                    </div>
                ) : results.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                        No results found for &quot;{query}&quot;
                    </div>
                ) : (
                    results.map((result, index) => (
                        <div
                            key={index}
                            className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                            onClick={() => setExpanded(expanded === index ? null : index)}
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                        {result.title}
                                    </h4>
                                    <a
                                        href={result.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {result.url.replace(/^https?:\/\//, '').split('/')[0]}
                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                    </a>
                                    <p className={`text-sm text-zinc-600 dark:text-zinc-400 mt-2 ${expanded === index ? '' : 'line-clamp-2'}`}>
                                        {result.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            {results.length > 0 && (
                <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                        Found {results.length} results • Powered by Tavily
                    </p>
                </div>
            )}
        </div>
    );
}
