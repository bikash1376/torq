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
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-6 text-card-foreground">
                {title}
            </h3>

            <div className="space-y-6">
                {steps?.map((step, idx) => (
                    <div key={idx} className="flex gap-4 group">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-card border-2 border-primary text-primary font-bold text-sm shadow-sm z-10 relative">
                                {idx + 1}
                            </span>
                            {idx !== steps.length - 1 && (
                                <div className="w-0.5 bg-border h-full -mb-6 mt-1" />
                            )}
                        </div>
                        <div className="pt-0.5 pb-2">
                            <h4 className="font-semibold text-foreground text-lg mb-2">
                                {step.instruction}
                            </h4>
                            {step.detail && (
                                <div className="text-muted-foreground text-sm prose dark:prose-invert max-w-none bg-muted/50 p-3 rounded-lg border border-border/50">
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

