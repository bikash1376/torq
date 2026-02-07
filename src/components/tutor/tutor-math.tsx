"use client";
import React, { useMemo, useState, useEffect } from 'react';
import { z } from "zod";
import { Player, PlayerRef } from "@remotion/player";
import { AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Schema definition for the tool - SIMPLIFIED
export const tutorMathSchema = z.object({
    topic: z.string().describe("The math topic being taught"),
    slides: z.array(z.object({
        type: z.enum(["intro", "concept", "example"]).describe("Type of slide - intro uses big emojis, concept explains the idea, example shows how it works"),
        emoji: z.string().describe("A single relevant emoji for this slide (e.g. 📐, ✨, 🔢, 💡)"),
        title: z.string().describe("Short slide title (max 5 words)"),
        content: z.string().describe("Brief content - max 2 sentences. Keep it simple and visual."),
        narration: z.string().describe("What the AI tutor says for this slide - spoken aloud. Keep it natural and conversational, like a friendly teacher explaining to a student. 1-2 sentences max."),
    })).describe("3-5 slides max. Structure: 1. Intro with emoji + simple hook, 2. Concept in plain words, 3. One clear example. Keep each slide SIMPLE. Include narration for audio."),
    quiz: z.object({
        question: z.string().describe("A simple question testing the concept"),
        options: z.array(z.string()).describe("4 possible answers"),
        correctAnswerIndex: z.number().describe("Index (0-3) of the correct answer"),
        explanation: z.string().describe("Brief explanation of the answer"),
    }).optional().describe("Optional quiz to test understanding after the video - will be shown as interactive component"),
});

export type TutorMathProps = z.infer<typeof tutorMathSchema>;

// --- Slide Components with LARGE text ---

const SlideContainer = ({ children, type }: { children: React.ReactNode, type: string }) => {
    const frame = useCurrentFrame();

    // Vibrant background gradients based on type
    let bgStyle = "bg-gradient-to-br from-slate-50 to-slate-100";
    if (type === "intro") bgStyle = "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500";
    if (type === "concept") bgStyle = "bg-gradient-to-br from-blue-500 to-cyan-400";
    if (type === "example") bgStyle = "bg-gradient-to-br from-emerald-500 to-teal-400";

    const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <AbsoluteFill className={`${bgStyle} flex flex-col items-center justify-center p-8`}>
            <div style={{ opacity }} className="w-full h-full flex flex-col items-center justify-center">
                {children}
            </div>
        </AbsoluteFill>
    );
};

const IntroSlide = ({ emoji, title, content }: { emoji: string, title: string, content: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const emojiScale = spring({ frame, fps, config: { damping: 10, stiffness: 100 } });
    const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });

    return (
        <SlideContainer type="intro">
            {/* Giant emoji */}
            <div
                style={{ transform: `scale(${emojiScale})` }}
                className="text-[120px] mb-6"
            >
                {emoji}
            </div>

            {/* Big bold title */}
            <h1 className="text-5xl md:text-6xl font-black text-white text-center mb-4 drop-shadow-lg">
                {title}
            </h1>

            {/* Simple tagline */}
            <div
                style={{ opacity: textOpacity }}
                className="text-2xl md:text-3xl text-white/90 text-center max-w-xl font-medium prose prose-invert prose-2xl"
            >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
        </SlideContainer>
    );
};

const ConceptSlide = ({ emoji, title, content }: { emoji: string, title: string, content: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const slideIn = spring({ frame, fps, config: { damping: 15 } });

    return (
        <SlideContainer type="concept">
            <div
                style={{ transform: `translateY(${interpolate(slideIn, [0, 1], [60, 0])}px)` }}
                className="flex flex-col items-center"
            >
                {/* Emoji badge */}
                <div className="text-7xl mb-6 bg-white/20 rounded-full p-6 backdrop-blur-sm">
                    {emoji}
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 drop-shadow-md">
                    {title}
                </h2>

                {/* Content - kept simple */}
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-lg prose prose-invert prose-2xl">
                    <div className="text-2xl md:text-3xl text-white text-center font-medium leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </SlideContainer>
    );
};

const ExampleSlide = ({ emoji, title, content }: { emoji: string, title: string, content: string }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const pop = spring({ frame, fps, config: { damping: 12 } });

    return (
        <SlideContainer type="example">
            <div
                style={{ transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})` }}
                className="flex flex-col items-center"
            >
                {/* Example label */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-6xl">{emoji}</span>
                    <span className="text-2xl font-bold text-white/80 uppercase tracking-wider">Example</span>
                </div>

                {/* Title */}
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-6 drop-shadow-md">
                    {title}
                </h2>

                {/* Content in a nice card */}
                <div className="bg-white rounded-2xl p-8 max-w-lg shadow-2xl prose prose-2xl">
                    <div className="text-2xl md:text-3xl text-slate-800 text-center font-semibold leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                    </div>
                </div>
            </div>
        </SlideContainer>
    );
};

// --- Helper to calculate slide duration based on text ---
// Average speaking rate: ~150 words per minute = 2.5 words per second
// Add buffer for animations and reading time
const calculateSlideDuration = (slide: { title: string; content: string; narration?: string }) => {
    const text = slide.narration || `${slide.title}. ${slide.content}`;
    const wordCount = text.split(/\s+/).length;
    const speakingTimeSeconds = wordCount / 2.5; // 2.5 words per second
    const bufferSeconds = 2; // Extra time for animations and comprehension
    const totalSeconds = Math.max(5, speakingTimeSeconds + bufferSeconds); // Minimum 5 seconds
    return Math.ceil(totalSeconds * 30); // Convert to frames at 30fps
};

// --- Composition ---

const MathComposition = ({ slides, slideDurations }: { slides: TutorMathProps['slides'], slideDurations: number[] }) => {
    const safeSlides = Array.isArray(slides) ? slides : [];
    let currentFrame = 0;

    return (
        <AbsoluteFill className="bg-slate-900">
            {safeSlides.map((slide, i) => {
                const from = currentFrame;
                const duration = slideDurations[i] || 180; // Fallback to 6 seconds
                currentFrame += duration;

                return (
                    <Sequence key={i} from={from} durationInFrames={duration}>
                        {slide.type === "intro" ? (
                            <IntroSlide emoji={slide.emoji} title={slide.title} content={slide.content} />
                        ) : slide.type === "concept" ? (
                            <ConceptSlide emoji={slide.emoji} title={slide.title} content={slide.content} />
                        ) : (
                            <ExampleSlide emoji={slide.emoji} title={slide.title} content={slide.content} />
                        )}
                    </Sequence>
                );
            })}
        </AbsoluteFill>
    );
};

// --- Interactive Quiz Component (shown after video) ---

interface QuizProps {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

const InteractiveQuiz = ({ question, options, correctAnswerIndex, explanation }: QuizProps) => {
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
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 bg-gradient-to-b from-purple-50 to-white dark:from-purple-900/20 dark:to-zinc-900">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <h4 className="text-lg font-bold text-purple-700 dark:text-purple-300">Quick Check!</h4>
            </div>

            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 mb-4">{question}</p>

            <div className="space-y-2 mb-4">
                {options.map((option, idx) => {
                    let stateStyle = "border-zinc-200 dark:border-zinc-700 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20";

                    if (hasSubmitted) {
                        if (idx === correctAnswerIndex) {
                            stateStyle = "border-green-500 bg-green-50 dark:bg-green-900/30 ring-2 ring-green-500";
                        } else if (idx === selected && idx !== correctAnswerIndex) {
                            stateStyle = "border-red-500 bg-red-50 dark:bg-red-900/30 ring-2 ring-red-500";
                        } else {
                            stateStyle = "opacity-40 border-zinc-200 dark:border-zinc-700";
                        }
                    } else if (selected === idx) {
                        stateStyle = "border-purple-500 bg-purple-50 dark:bg-purple-900/30 ring-2 ring-purple-500";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={hasSubmitted}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${stateStyle}`}
                        >
                            <span className="font-medium text-zinc-700 dark:text-zinc-300">{option}</span>
                        </button>
                    );
                })}
            </div>

            {!hasSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-bold transition-colors"
                >
                    Check My Answer ✨
                </button>
            ) : (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 dark:bg-green-900/40' : 'bg-amber-100 dark:bg-amber-900/40'}`}>
                    <p className="font-bold text-lg mb-2">
                        {isCorrect ? "🎉 Correct!" : "💡 Not quite!"}
                    </p>
                    <p className="text-zinc-700 dark:text-zinc-300">{explanation}</p>
                </div>
            )}
        </div>
    );
};

// --- Main Component ---

export function TutorMath(props: TutorMathProps) {
    const playerRef = React.useRef<PlayerRef>(null);
    const [videoEnded, setVideoEnded] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(-1);
    const lastSpokenSlideRef = React.useRef(-1);

    // Safety check for slides
    const safeSlides = Array.isArray(props.slides) ? props.slides : [];

    // Calculate duration for each slide based on text length
    const slideDurations = useMemo(() => {
        return safeSlides.map(slide => calculateSlideDuration(slide));
    }, [safeSlides]);

    // Calculate total duration and cumulative frame positions
    const { durationInFrames, slideStartFrames } = useMemo(() => {
        let total = 0;
        const starts: number[] = [];
        slideDurations.forEach(d => {
            starts.push(total);
            total += d;
        });
        return { durationInFrames: Math.max(1, total), slideStartFrames: starts };
    }, [slideDurations]);

    // Audio element ref for playing TTS
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Speak narration using Neural TTS API
    const speakNarration = React.useCallback(async (text: string) => {
        console.log('[TutorMath] Speaking with Neural TTS:', text.substring(0, 50) + '...');

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    voice: 'en-US-EmmaNeural', // Natural female voice
                    rate: '+0%',
                    pitch: '+0Hz',
                }),
            });

            if (!response.ok) {
                console.error('[TutorMath] TTS API error:', response.status);
                return;
            }

            const data = await response.json();

            if (data.audio) {
                // Decode base64 audio and play
                const audioSrc = `data:audio/mp3;base64,${data.audio}`;

                if (!audioRef.current) {
                    audioRef.current = new Audio();
                }

                audioRef.current.src = audioSrc;
                audioRef.current.play().catch(e => {
                    console.error('[TutorMath] Audio play error:', e);
                });

                console.log('[TutorMath] Playing audio, word count:', data.wordCount);
            }
        } catch (error) {
            console.error('[TutorMath] TTS fetch error:', error);
        }
    }, []);

    // Get text to speak for a slide (use narration or fall back to content)
    const getSlideText = React.useCallback((slide: typeof safeSlides[0]) => {
        if (!slide) return '';
        // Use narration if available, otherwise use title + content
        return slide.narration || `${slide.title}. ${slide.content}`;
    }, []);

    // Track current slide based on player frame using polling
    useEffect(() => {
        const player = playerRef.current;
        if (!player || safeSlides.length === 0) return;

        let animationId: number | null = null;
        let isPlaying = false;

        const checkFrame = () => {
            if (!isPlaying) return;

            try {
                // Use getCurrentFrame if available
                const frame = (player as any).getCurrentFrame?.() || 0;

                // Find which slide we're on based on cumulative durations
                let slideIndex = 0;
                for (let i = 0; i < slideStartFrames.length; i++) {
                    if (frame >= slideStartFrames[i]) {
                        slideIndex = i;
                    } else {
                        break;
                    }
                }
                slideIndex = Math.min(slideIndex, safeSlides.length - 1);

                // Only speak when transitioning to a new slide
                if (slideIndex >= 0 && slideIndex !== lastSpokenSlideRef.current) {
                    console.log('[TutorMath] Slide changed to:', slideIndex);
                    lastSpokenSlideRef.current = slideIndex;
                    setCurrentSlideIndex(slideIndex);

                    const slide = safeSlides[slideIndex];
                    const textToSpeak = getSlideText(slide);
                    if (textToSpeak) {
                        speakNarration(textToSpeak);
                    }
                }
            } catch (e) {
                console.error('[TutorMath] Error getting frame:', e);
            }

            animationId = requestAnimationFrame(checkFrame);
        };

        const handlePlay = () => {
            console.log('[TutorMath] Video started playing');
            isPlaying = true;

            // Speak first slide immediately when play starts
            if (lastSpokenSlideRef.current === -1 && safeSlides[0]) {
                lastSpokenSlideRef.current = 0;
                setCurrentSlideIndex(0);
                const textToSpeak = getSlideText(safeSlides[0]);
                if (textToSpeak) {
                    // Small delay to ensure voices are loaded
                    setTimeout(() => speakNarration(textToSpeak), 100);
                }
            }

            animationId = requestAnimationFrame(checkFrame);
        };

        const handlePause = () => {
            console.log('[TutorMath] Video paused');
            isPlaying = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            // Stop audio playback
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };

        const handleEnded = () => {
            console.log('[TutorMath] Video ended');
            isPlaying = false;
            setVideoEnded(true);
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            // Stop audio playback
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };

        const handleSeeked = () => {
            // Reset spoken slide when user seeks
            if (player) {
                try {
                    const frame = (player as any).getCurrentFrame?.() || 0;
                    // Find which slide we're on
                    let slideIndex = 0;
                    for (let i = 0; i < slideStartFrames.length; i++) {
                        if (frame >= slideStartFrames[i]) {
                            slideIndex = i;
                        } else {
                            break;
                        }
                    }
                    slideIndex = Math.min(slideIndex, safeSlides.length - 1);
                    lastSpokenSlideRef.current = slideIndex - 1; // Will trigger re-speak
                } catch (e) {
                    // Ignore
                }
            }
        };

        player.addEventListener('play', handlePlay);
        player.addEventListener('pause', handlePause);
        player.addEventListener('ended', handleEnded);
        player.addEventListener('seeked', handleSeeked);

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            player.removeEventListener('play', handlePlay);
            player.removeEventListener('pause', handlePause);
            player.removeEventListener('ended', handleEnded);
            player.removeEventListener('seeked', handleSeeked);
            // Stop audio on cleanup
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, [safeSlides, speakNarration, getSlideText, slideStartFrames]);

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    📚
                </div>
                <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                        {props.topic}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {safeSlides.length} slides • {Math.round(durationInFrames / 30)}s
                    </p>
                </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-slate-900 relative">
                <Player
                    ref={playerRef}
                    component={MathComposition}
                    inputProps={{ slides: safeSlides, slideDurations }}
                    durationInFrames={durationInFrames}
                    compositionWidth={1280}
                    compositionHeight={720}
                    fps={30}
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    controls
                    autoPlay
                />
            </div>

            {/* Interactive Quiz - shown after video or always available */}
            {props.quiz && (
                <InteractiveQuiz
                    question={props.quiz.question}
                    options={props.quiz.options}
                    correctAnswerIndex={props.quiz.correctAnswerIndex}
                    explanation={props.quiz.explanation}
                />
            )}

            {/* Footer hint */}
            {!props.quiz && (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 text-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        🎬 Watch the video to learn!
                    </p>
                </div>
            )}
        </div>
    );
}
