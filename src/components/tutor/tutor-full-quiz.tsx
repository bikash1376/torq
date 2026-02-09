"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Check, X, ChevronRight, RefreshCw, Trophy, Loader2 } from "lucide-react";
import { getToolGeneration, saveToolGeneration } from "@/app/actions/tool-generations";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const tutorFullQuizSchema = z.object({
    title: z.string().describe("Title of the quiz"),
    questions: z.array(z.object({
        question: z.string().describe("The question text"),
        options: z.array(z.string()).describe("Array of 4 possible answers"),
        correctAnswerIndex: z.number().describe("Index of the correct answer (0-3)"),
        explanation: z.string().describe("Explanation for the correct answer"),
    })).min(10).max(10).describe("List of exactly 10 questions"),
});

export type TutorFullQuizProps = z.infer<typeof tutorFullQuizSchema>;

export function TutorFullQuiz({ title, questions: initialQuestions }: TutorFullQuizProps) {
    const [questions, setQuestions] = useState(initialQuestions || []);
    const [isLoading, setIsLoading] = useState(!initialQuestions || initialQuestions.length === 0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const loadOrSave = async () => {
            if (initialQuestions && initialQuestions.length > 0) {
                await saveToolGeneration("fullquiz", title, { questions: initialQuestions });
                setQuestions(initialQuestions);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                const data = await getToolGeneration("fullquiz", title);
                if (data?.questions) {
                    setQuestions(data.questions);
                }
                setIsLoading(false);
            }
        };
        loadOrSave();
    }, [title, initialQuestions]);

    if (isLoading) {
        return (
            <div className="p-8 text-center bg-card border border-border rounded-xl">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading quiz...</p>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="p-4 text-center text-muted-foreground bg-muted/20 rounded-lg">
                <p>No questions available for this quiz.</p>
            </div>
        );
    }

    const currentQuestion = questions[currentIndex];

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === currentQuestion.correctAnswerIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResults(true);
        }
    };

    const handleRestart = () => {
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        return (
            <div className="bg-card w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-border p-8 text-center">
                <div className="flex justify-center mb-6">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                        <Trophy className="h-12 w-12 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                <p className="text-muted-foreground mb-6">You scored</p>
                <div className="text-5xl font-black text-primary mb-8">
                    {score} / {questions.length}
                </div>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={handleRestart}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card w-full max-w-2xl mx-auto rounded-xl shadow-lg border border-border overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-sm text-muted-foreground">Question {currentIndex + 1} of {questions.length}</p>
                </div>
                <div className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                    Score: {score}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose dark:prose-invert max-w-none mb-8">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {currentQuestion.question}
                    </ReactMarkdown>
                </div>

                <div className="grid gap-3">
                    {currentQuestion.options.map((option, idx) => {
                        let buttonStyle = "border-border hover:bg-muted/50 hover:border-primary/50";

                        if (isAnswered) {
                            if (idx === currentQuestion.correctAnswerIndex) {
                                buttonStyle = "border-success bg-success/10 ring-1 ring-success";
                            } else if (idx === selectedOption) {
                                buttonStyle = "border-destructive bg-destructive/10 ring-1 ring-destructive";
                            } else {
                                buttonStyle = "opacity-50 border-border";
                            }
                        } else if (selectedOption === idx) {
                            buttonStyle = "border-primary bg-primary/10 ring-1 ring-primary";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={isAnswered}
                                className={`text-left p-4 rounded-lg border transition-all duration-200 flex justify-between items-center ${buttonStyle}`}
                            >
                                <span className="font-medium">{option}</span>
                                {isAnswered && idx === currentQuestion.correctAnswerIndex && (
                                    <Check className="h-5 w-5 text-success" />
                                )}
                                {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                                    <X className="h-5 w-5 text-destructive" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-bottom-2">
                        <p className="font-semibold mb-1 text-sm">Explanation:</p>
                        <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border bg-muted/30 flex justify-end">
                <button
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
