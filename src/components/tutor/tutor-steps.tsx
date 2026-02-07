"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";

export const tutorStepByStepSchema = z.object({
    title: z.string().describe("Title of the process/problem"),
    steps: z.array(
        z.object({
            instruction: z.string().describe("What to do"),
            detail: z.string().optional().describe("More context or explanation"),
        })
    ).describe("Ordered list of steps"),
});

export type TutorStepByStepProps = z.infer<typeof tutorStepByStepSchema>;

export function TutorStepByStep({ title, steps }: TutorStepByStepProps) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
                {title}
            </h3>

            <div className="space-y-6">
                {steps?.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-zinc-900 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold text-sm shadow-sm z-10 relative">
                                {idx + 1}
                            </span>
                            {idx !== steps.length - 1 && (
                                <div className="w-0.5 bg-zinc-200 dark:bg-zinc-800 h-full -mb-6 mt-1" />
                            )}
                        </div>
                        <div className="pt-0.5 pb-2">
                            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 text-lg mb-2">
                                {step.instruction}
                            </h4>
                            {step.detail && (
                                <div className="text-zinc-600 dark:text-zinc-400 text-sm prose dark:prose-invert max-w-none bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{step.detail || ""}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
