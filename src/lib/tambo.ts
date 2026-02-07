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
// import { showConcept, showConceptSchema, showMath, showMathSchema, showQuiz, showQuizSchema, showSteps, showStepsSchema } from "@/lib/tutor-tools"; // Import the specific tools and schemas
// Adjusted imports to exclude concept tool
import { showMath, showMathSchema, showQuiz, showQuizSchema, showSteps, showStepsSchema } from "@/lib/tutor-tools";
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
    description: "Use this tool to display a Tutor Quiz component on the visual learning board (right side). Use this to test understanding. Note: The showMath tool also supports embedded quizzes in videos, so check if that is more appropriate. Do not render quizzes in chat, always use this tool.",
    tool: showQuiz,
    toolSchema: showQuizSchema,
  },
  {
    name: "showSteps",
    description: "Use this tool to display a Tutor Step-by-Step component on the visual learning board (right side). Use this for guides. Do not render steps in chat, always use this tool.",
    tool: showSteps,
    toolSchema: showStepsSchema,
  },
  {
    name: "showMath",
    description: `Use this tool to display a fun, visual Math Video Lesson WITH AUDIO narration.
    
IMPORTANT RULES:
1. Keep slides SIMPLE - max 2 sentences per slide
2. Use a relevant emoji for EVERY slide (📐 ✨ 🔢 💡 🎯 etc)
3. Only 3-5 slides total
4. Slide types: intro (hook), concept (explain), example (show how)
5. NO quiz slides in video - add quiz data separately for interactive quiz below video
6. Titles should be 5 words or less
7. Content should be catchy and easy to understand
8. INCLUDE NARRATION for each slide - this is what the AI tutor will SAY out loud. Make it conversational and friendly, like a teacher explaining to a student.

The video has big text, animations, and AUDIO narration that speaks while each slide plays. The quiz appears BELOW as an interactive component.`,
    tool: showMath,
    toolSchema: showMathSchema,
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
    name: "SelectForm",
    description:
      "ALWAYS use this component instead of listing options as bullet points in text. Whenever you need to ask the user a question and would normally follow up with bullet points or numbered options, use this component instead. For yes/no or single-choice questions, use mode='single'. For questions where the user can select multiple options, use mode='multi' (default). Each group has a label (the question) and options (the choices). Examples: 'Would you like to continue?' with Yes/No options, or 'Which regions interest you?' with multiple region options.",
    component: SelectForm,
    propsSchema: selectFormSchema,
  },
];

