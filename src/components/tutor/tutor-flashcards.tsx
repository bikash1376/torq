"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, RefreshCw, Undo2, Layers } from "lucide-react";

export const tutorFlashcardsSchema = z.object({
    topic: z.string().describe("Topic of the flashcards"),
    cards: z.array(z.object({
        front: z.string().describe("Front content (term/question)"),
        back: z.string().describe("Back content (definition/answer)"),
    })).min(1).describe("List of 5 flashcards"),
});

export type TutorFlashcardsProps = z.infer<typeof tutorFlashcardsSchema>;

export function TutorFlashcards({ topic, cards }: TutorFlashcardsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [direction, setDirection] = useState(0); // -1 for left, 1 for right

    const handleFlip = () => setIsFlipped(!isFlipped);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex < cards.length - 1) {
            setDirection(1);
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleRestart = (e: React.MouseEvent) => {
        e.stopPropagation();
        setDirection(-1);
        setCurrentIndex(0);
        setIsFlipped(false);
    };

    const currentCard = cards[currentIndex];

    // Variants for card animation
    const variants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 100 : -100,
                opacity: 0,
                scale: 0.8
            };
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 100 : -100,
                opacity: 0,
                scale: 0.8,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 30
                }
            };
        }
    };

    return (
        <div className="w-full max-w-md mx-auto aspect-[4/3] min-h-[400px] flex flex-col perspective-1000 group cursor-pointer" onClick={handleFlip}>
            <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-lg">{topic}</h3>
                </div>
                <div className="text-sm font-medium bg-muted px-2 py-1 rounded-md">
                    {currentIndex + 1} / {cards.length}
                </div>
            </div>

            <div className="relative flex-1 w-full h-full perspective-1000">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute w-full h-full"
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            className="w-full h-full relative preserve-3d transition-transform duration-500 rounded-xl shadow-lg border border-border bg-card"
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        >
                            {/* Front */}
                            <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-primary/5 to-transparent rounded-xl">
                                <span className="absolute top-4 left-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">Question</span>
                                <h4 className="text-2xl font-bold text-foreground break-words">{currentCard.front}</h4>
                                <p className="absolute bottom-4 text-xs text-muted-foreground">Click to flip</p>
                            </div>

                            {/* Back */}
                            <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-900 rounded-xl ring-1 ring-primary/20 rotate-y-180">
                                <span className="absolute top-4 left-4 text-xs font-bold text-primary uppercase tracking-wider">Answer</span>
                                <p className="text-xl text-foreground/90 break-words">{currentCard.back}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex justify-between items-center mt-6 px-4" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="p-2 rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                    onClick={handleRestart}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <RefreshCw className="h-3 w-3" /> Reset
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="p-2 rounded-full hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}
