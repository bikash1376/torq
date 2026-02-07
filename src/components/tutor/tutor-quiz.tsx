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
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                    ?
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Quick Quiz
                </h3>
            </div>

            <div className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-6 prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown>
            </div>

            <div className="space-y-3 mb-6">
                {options?.map((option, idx) => {
                    let stateStyle = "border-zinc-200 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50";

                    if (hasSubmitted) {
                        if (idx === correctAnswerIndex) {
                            stateStyle = "border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-500";
                        } else if (idx === selected && idx !== correctAnswerIndex) {
                            stateStyle = "border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-500";
                        } else {
                            stateStyle = "opacity-50 border-zinc-200 dark:border-zinc-800";
                        }
                    } else if (selected === idx) {
                        stateStyle = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={hasSubmitted}
                            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${stateStyle}`}
                        >
                            <span className="text-zinc-700 dark:text-zinc-300">{option}</span>
                            {hasSubmitted && idx === correctAnswerIndex && (
                                <Check className="w-5 h-5 text-green-600" />
                            )}
                            {hasSubmitted && idx === selected && idx !== correctAnswerIndex && (
                                <X className="w-5 h-5 text-red-600" />
                            )}
                        </button>
                    );
                })}
            </div>

            {!hasSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                    Check Answer
                </button>
            ) : (
                <div className={`p-4 rounded-lg text-sm ${isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-200'}`}>
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
