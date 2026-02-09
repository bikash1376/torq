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

    // Calculate frame positions for each slide
    const slidePositions = safeSlides.reduce<{ from: number; duration: number }[]>((acc, _, i) => {
        const previousEnd = i === 0 ? 0 : acc[i - 1].from + acc[i - 1].duration;
        const duration = slideDurations[i] || 180; // Fallback to 6 seconds
        acc.push({ from: previousEnd, duration });
        return acc;
    }, []);

    return (
        <AbsoluteFill className="bg-slate-900">
            {safeSlides.map((slide, i) => {
                const { from, duration } = slidePositions[i];

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
        <div className="p-4 border-t border-border bg-gradient-to-b from-primary/5 to-background">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🧠</span>
                <h4 className="text-lg font-bold text-primary">Quick Check!</h4>
            </div>

            <p className="text-lg font-medium text-foreground mb-4">{question}</p>

            <div className="space-y-2 mb-4">
                {options.map((option, idx) => {
                    let stateStyle = "border-border hover:border-primary/50 hover:bg-primary/5";

                    if (hasSubmitted) {
                        if (idx === correctAnswerIndex) {
                            stateStyle = "border-success bg-success/10 ring-2 ring-success";
                        } else if (idx === selected && idx !== correctAnswerIndex) {
                            stateStyle = "border-destructive bg-destructive/10 ring-2 ring-destructive";
                        } else {
                            stateStyle = "opacity-40 border-border";
                        }
                    } else if (selected === idx) {
                        stateStyle = "border-primary bg-primary/10 ring-2 ring-primary";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(idx)}
                            disabled={hasSubmitted}
                            className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${stateStyle}`}
                        >
                            <span className="font-medium text-muted-foreground">{option}</span>
                        </button>
                    );
                })}
            </div>

            {!hasSubmitted ? (
                <button
                    onClick={handleSubmit}
                    disabled={selected === null}
                    className="w-full py-3 px-4 bg-primary hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed text-primary-foreground rounded-lg font-bold transition-colors"
                >
                    Check My Answer
                </button>
            ) : (
                <div className={`p-4 rounded-lg ${isCorrect ? 'bg-success/10' : 'bg-warning/10'}`}>
                    <p className="font-bold text-lg mb-2">
                        {isCorrect ? "🎉 Correct!" : "💡 Not quite!"}
                    </p>
                    <p className="text-muted-foreground">{explanation}</p>
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

    // Pre-fetched audio data
    const [audioData, setAudioData] = useState<{ src: string; duration: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    // Safety check for slides
    const safeSlides = Array.isArray(props.slides) ? props.slides : [];

    // Get text to speak for a slide
    const getSlideText = React.useCallback((slide: typeof safeSlides[0]) => {
        if (!slide) return '';
        return slide.narration || `${slide.title}. ${slide.content}`;
    }, []);

    // Pre-fetch all audio on mount
    useEffect(() => {
        const fetchAllAudio = async () => {
            if (safeSlides.length === 0) {
                setIsLoading(false);
                return;
            }

            console.log('[TutorMath] Pre-fetching audio for', safeSlides.length, 'slides...');

            const audioPromises = safeSlides.map(async (slide, index) => {
                const text = getSlideText(slide);
                if (!text) return { src: '', duration: 5 }; // 5 second fallback

                try {
                    const response = await fetch('/api/tts', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            text,
                            voice: 'en-US-EmmaNeural',
                            rate: '+0%',
                            pitch: '+0Hz',
                        }),
                    });

                    if (!response.ok) {
                        console.error('[TutorMath] TTS error for slide', index);
                        return { src: '', duration: 5 };
                    }

                    const data = await response.json();
                    const audioSrc = `data:audio/mp3;base64,${data.audio}`;

                    // Get actual audio duration by loading it
                    const audioDuration = await new Promise<number>((resolve) => {
                        const audio = new Audio(audioSrc);
                        audio.addEventListener('loadedmetadata', () => {
                            console.log('[TutorMath] Slide', index, 'audio duration:', audio.duration, 's');
                            resolve(audio.duration);
                        });
                        audio.addEventListener('error', () => {
                            console.error('[TutorMath] Error loading audio for slide', index);
                            resolve(5); // Fallback
                        });
                    });

                    return { src: audioSrc, duration: audioDuration };
                } catch (error) {
                    console.error('[TutorMath] Error fetching audio for slide', index, error);
                    return { src: '', duration: 5 };
                }
            });

            const results = await Promise.all(audioPromises);
            console.log('[TutorMath] All audio loaded:', results.map(r => r.duration.toFixed(1) + 's'));
            setAudioData(results);
            setIsLoading(false);
        };

        fetchAllAudio();
    }, [safeSlides, getSlideText]);

    // Calculate slide durations based on actual audio duration
    const slideDurations = useMemo(() => {
        if (audioData.length === 0) {
            // Fallback while loading
            return safeSlides.map(slide => calculateSlideDuration(slide));
        }
        // Use actual audio duration + 1 second buffer, convert to frames
        return audioData.map(audio => Math.ceil((audio.duration + 1) * 30));
    }, [audioData, safeSlides]);

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

    // Play audio for a specific slide
    const playSlideAudio = React.useCallback((slideIndex: number) => {
        if (slideIndex < 0 || slideIndex >= audioData.length) return;

        const audio = audioData[slideIndex];
        if (!audio.src) return;

        // Stop any currently playing audio
        if (audioRef.current) {
            audioRef.current.pause();
        }

        if (!audioRef.current) {
            audioRef.current = new Audio();
        }

        audioRef.current.src = audio.src;
        audioRef.current.play().catch(e => {
            console.error('[TutorMath] Audio play error:', e);
        });

        console.log('[TutorMath] Playing slide', slideIndex, 'audio');
    }, [audioData]);

    // Auto-start first slide audio when loading completes
    useEffect(() => {
        if (!isLoading && audioData.length > 0 && lastSpokenSlideRef.current === -1) {
            // Reset the ref and wait a moment for player to be ready
            console.log('[TutorMath] Audio loaded, preparing to play first slide...');
            const timeout = setTimeout(() => {
                if (playerRef.current && lastSpokenSlideRef.current === -1) {
                    lastSpokenSlideRef.current = 0;
                    setCurrentSlideIndex(0);
                    playSlideAudio(0);
                }
            }, 500);
            return () => clearTimeout(timeout);
        }
    }, [isLoading, audioData, playSlideAudio]);

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
                const frame = (player as { getCurrentFrame?: () => number }).getCurrentFrame?.() || 0;

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

                // Only play audio when transitioning to a new slide
                if (slideIndex >= 0 && slideIndex !== lastSpokenSlideRef.current) {
                    console.log('[TutorMath] Slide changed to:', slideIndex);
                    lastSpokenSlideRef.current = slideIndex;
                    setCurrentSlideIndex(slideIndex);
                    playSlideAudio(slideIndex);
                }
            } catch (e) {
                console.error('[TutorMath] Error getting frame:', e);
            }

            animationId = requestAnimationFrame(checkFrame);
        };

        const handlePlay = () => {
            console.log('[TutorMath] Video started playing');
            isPlaying = true;

            // Play first slide audio immediately when play starts
            if (lastSpokenSlideRef.current === -1 && audioData.length > 0) {
                lastSpokenSlideRef.current = 0;
                setCurrentSlideIndex(0);
                // Small delay to ensure everything is ready
                setTimeout(() => playSlideAudio(0), 100);
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
                    const frame = (player as { getCurrentFrame?: () => number }).getCurrentFrame?.() || 0;
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
    }, [safeSlides, playSlideAudio, slideStartFrames, audioData]);

    return (
        <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden max-w-2xl w-full mx-auto">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3 bg-gradient-to-r from-primary/5 to-primary/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                    📚
                </div>
                <div>
                    <h3 className="font-bold text-lg text-card-foreground">
                        {props.topic}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {safeSlides.length} slides • {Math.round(durationInFrames / 30)}s
                    </p>
                </div>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-slate-900 relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-lg font-medium">Preparing audio narration...</p>
                        <p className="text-sm text-muted-foreground mt-1">Loading {safeSlides.length} slides</p>
                    </div>
                ) : (
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
                        autoPlay={!isLoading}
                    />
                )}
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
                <div className="p-3 bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground">
                        🎬 Watch the video to learn!
                    </p>
                </div>
            )}
        </div>
    );
}
