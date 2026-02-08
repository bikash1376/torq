"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { z } from "zod";
import { Check, X } from "lucide-react";

export const tutorQuizSchema = z.object({
    question: z.string().describe("The question to ask the student"),
    options: z.array(z.string()).describe("List of possible answers"),
    correctAnswerIndex: z.number().describe("The index of the correct answer (0-based)"),
    explanation: z.string().describe("Explanation shown after answering"),
});

export type TutorQuizProps = z.infer<typeof tutorQuizSchema>;

export function TutorQuiz({ question, options, correctAnswerIndex, explanation }: TutorQuizProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const isCorrect = selected === correctAnswerIndex;

    const handleSelect = (index: number) => {
        if (hasSubmitted) return;
        setSelected(index);
    };

    const handleSubmit = () => {
        if (selected === null) return;
        setHasSubmitted(true);
    };

    return (
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    ?
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">
                    Quick Quiz
                </h3>
            </div>

            <div className="text-lg font-medium text-foreground mb-6 prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown>
            </div>

            <div className="space-y-3 mb-6">
                {options?.map((option, idx) => {
                    let stateStyle = "border-border hover:border-primary/50 hover:bg-muted/50";

                    if (hasSubmitted) {
                        if (idx === correctAnswerIndex) {
                            stateStyle = "border-success bg-success/10 ring-1 ring-success";
                        } else if (idx === selected && idx !== correctAnswerIndex) {
                            stateStyle = "border-destructive bg-destructive/10 ring-1 ring-destructive";
                        } else {
                            stateStyle = "opacity-50 border-border";
                        }
                    } else if (selected === idx) {
                        stateStyle = "border-primary bg-primary/10 ring-1 ring-primary";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={hasSubmitted}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${stateStyle}`}
                        >
                            <span className="text-muted-foreground">{option}</span>
                            {hasSubmitted && idx === correctAnswerIndex && (
                                <Check className="w-5 h-5 text-success" />
                            )}
                            {hasSubmitted && idx === selected && idx !== correctAnswerIndex && (
                                <X className="w-5 h-5 text-destructive" />
                            )}
                        </button>
                    );
                })}
            </div>

            {!hasSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-medium transition-colors shadow-sm"
                >
                    Check Answer
                </button>
            ) : (
                <div className={`p-4 rounded-lg text-sm ${isCorrect ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                    <p className="font-semibold mb-1">
                        {isCorrect ? "Correct! 🎉" : "Not quite right"}
                    </p>
                    <div className="prose dark:prose-invert text-sm max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}

