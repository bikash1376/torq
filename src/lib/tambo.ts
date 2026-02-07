/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import { SelectForm, selectFormSchema } from "@/components/tambo/select-form";
// import { TutorConcept, tutorConceptSchema } from "@/components/tutor/tutor-concept";
import { TutorQuiz, tutorQuizSchema } from "@/components/tutor/tutor-quiz";
import { TutorMath, tutorMathSchema } from "@/components/tutor/tutor-math";
import { TutorStepByStep, tutorStepByStepSchema } from "@/components/tutor/tutor-steps";
import { WebSearch, webSearchSchema } from "@/components/tutor/web-search";
// import { showConcept, showConceptSchema, showMath, showMathSchema, showQuiz, showQuizSchema, showSteps, showStepsSchema } from "@/lib/tutor-tools"; // Import the specific tools and schemas
// Adjusted imports to exclude concept tool
import { showMath, showMathSchema, showQuiz, showQuizSchema, showSteps, showStepsSchema, webSearch, webSearchToolSchema } from "@/lib/tutor-tools";
import type { TamboComponent, TamboTool } from "@tambo-ai/react";

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  /*   {
      name: "showConcept",
      description: "Use this tool to display a Tutor Concept component on the visual learning board (right side). Use this to explain new topics. Do not render explanations in chat, always use this tool.",
      tool: showConcept,
      toolSchema: showConceptSchema,
    }, */
  {
    name: "showQuiz",
    description: `Use this tool ONLY when the user explicitly asks for a quiz or wants to test their knowledge.
    
Do NOT use this for teaching - use showMath instead. This is only for standalone quizzes when the user says "quiz me" or "test me".`,
    tool: showQuiz,
    toolSchema: showQuizSchema,
  },
  {
    name: "showSteps",
    description: `Use this tool ONLY when the user explicitly asks for "steps" or "step-by-step" instructions.
    
Examples of when to use: "show me the steps", "step-by-step guide", "what are the steps to..."

For general teaching, explaining, or "how does X work" questions, use showMath instead.`,
    tool: showSteps,
    toolSchema: showStepsSchema,
  },
  {
    name: "showMath",
    description: `🎬 PRIMARY TEACHING TOOL - Use this for ANY teaching, explaining, or educational content!

USE THIS TOOL WHEN:
- User asks to "teach", "explain", "learn", "understand" something
- User asks "how does X work?", "what is X?"
- User wants to learn a new topic or concept
- ANY educational request (not just math - works for all subjects!)

DO NOT USE showSteps unless user explicitly says "steps" or "step-by-step".

RULES FOR CREATING HIGH-QUALITY VIDEO LESSONS:
1. Each slide should go DEEPER into ONE concept - don't be vague or jump around
2. Include a REAL-LIFE EXAMPLE that students can relate to (e.g., "Like when you share 10 cookies equally among 5 friends")
3. Progress logically: Hook → What it is → Why it matters → How it works → Real example
4. Use a relevant emoji for EVERY slide (📐 ✨ 🔢 💡 🎯 🍕 🏀 💰 etc)
5. Only 4-5 slides total, but make each one count!
6. Slide structure:
   - Slide 1 (intro): Hook with relatable question or scenario
   - Slide 2 (concept): Clear definition in simple words
   - Slide 3 (why): Why this matters in real life
   - Slide 4 (example): Step-by-step real-world example
   - Slide 5 (example): Another example or key takeaway
7. Titles should be 5 words or less
8. Content should be specific, not vague - give actual numbers/details
9. NARRATION is spoken aloud - make it conversational like a friendly teacher
10. DO NOT put quiz in slides - the interactive quiz appears below the video automatically

EXAMPLE OF GOOD vs BAD:
❌ BAD: "Fractions are parts of a whole. They're useful in many situations."
✅ GOOD: "Imagine cutting a pizza into 8 slices 🍕. If you eat 3 slices, you've eaten 3/8 of the pizza!"

The video has big text, animations, and AUDIO narration synced to each slide.`,
    tool: showMath,
    toolSchema: showMathSchema,
  },
  {
    name: "webSearch",
    description: `Use this tool to search the web for REAL-TIME or CURRENT information.

USE THIS WHEN:
- User asks about weather, temperature, or forecasts
- User asks about current time, dates, or timezones
- User asks about current events, news, or recent happenings
- User asks about live data (stock prices, sports scores, etc.)
- User asks "what is happening", "what's the latest", "current status"
- Any question that requires up-to-date information

DO NOT USE FOR:
- General knowledge that doesn't change (e.g., "what is photosynthesis")
- Teaching concepts (use showMath instead)
- Historical facts

This tool searches the web and displays results on the learning board.`,
    tool: webSearch,
    toolSchema: webSearchToolSchema,
  },
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  /*   {
      name: "TutorConcept",
      description:
        "A component to explain concepts. Use the 'showConcept' tool to display this.",
      component: TutorConcept,
      propsSchema: tutorConceptSchema,
    }, */
  {
    name: "TutorQuiz",
    description:
      "A component for quizzes. Use the 'showQuiz' tool to display this.",
    component: TutorQuiz,
    propsSchema: tutorQuizSchema,
  },
  {
    name: "TutorStepByStep",
    description:
      "A component for step-by-step guides. Use the 'showSteps' tool to display this.",
    component: TutorStepByStep,
    propsSchema: tutorStepByStepSchema,
  },
  {
    name: "TutorMath",
    description: "A component for math video lessons. Use the 'showMath' tool to display this.",
    component: TutorMath,
    propsSchema: tutorMathSchema,
  },
  {
    name: "WebSearch",
    description: "A component for displaying web search results. Use the 'webSearch' tool to display this.",
    component: WebSearch,
    propsSchema: webSearchSchema,
  },
  {
    name: "SelectForm",
    description:
      "ALWAYS use this component instead of listing options as bullet points in text. Whenever you need to ask the user a question and would normally follow up with bullet points or numbered options, use this component instead. For yes/no or single-choice questions, use mode='single'. For questions where the user can select multiple options, use mode='multi' (default). Each group has a label (the question) and options (the choices). Examples: 'Would you like to continue?' with Yes/No options, or 'Which regions interest you?' with multiple region options.",
    component: SelectForm,
    propsSchema: selectFormSchema,
  },
];

