/**
 * @file tutor-tools.ts
 * @description Tools to allow the AI to control the tutor interface directly
 */

// import { tutorConceptSchema } from "@/components/tutor/tutor-concept";
import { tutorQuizSchema } from "@/components/tutor/tutor-quiz";
import { tutorStepByStepSchema } from "@/components/tutor/tutor-steps";
import { tutorMathSchema } from "@/components/tutor/tutor-math";
import { useCanvasStore } from "@/lib/canvas-storage";
import { z } from "zod";

// Helper internal function to add to canvas
function addToCanvas(componentType: string, props: any, canvasTitle: string = "Learning Session") {
    try {
        const store = useCanvasStore.getState();
        let activeCanvasId = store.activeCanvasId;

        if (!activeCanvasId) {
            // If no canvas is active, create one
            const newCanvas = store.createCanvas(canvasTitle);
            activeCanvasId = newCanvas.id;
        }

        // Generate a unique component ID
        const componentId = `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        store.addComponent(activeCanvasId, {
            componentId,
            _componentType: componentType,
            _inCanvas: true,
            canvasId: activeCanvasId,
            ...props,
        });

        return { success: true, message: `Added ${componentType} to the board.` };
    } catch (error: any) {
        console.error("Failed to add to canvas:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Tool to show a Concept explanation on the canvas
 */
/* export async function showConcept(props: z.infer<typeof tutorConceptSchema>) {
    return addToCanvas("TutorConcept", props);
} */

/**
 * Tool to show a Quiz on the canvas
 */
export async function showQuiz(props: z.infer<typeof tutorQuizSchema>) {
    return addToCanvas("TutorQuiz", props);
}

/**
 * Tool to show a Step-by-Step guide on the canvas
 */
export async function showSteps(props: z.infer<typeof tutorStepByStepSchema>) {
    return addToCanvas("TutorStepByStep", props);
}

/**
 * Tool to show a Math video lesson on the canvas
 */
export async function showMath(props: z.infer<typeof tutorMathSchema>) {
    return addToCanvas("TutorMath", props);
}

// Export the schemas for registration
// Export schemas wrapped in function arguments for tool registration
// export const showConceptSchema = z.function().args(tutorConceptSchema);
export const showQuizSchema = z.function().args(tutorQuizSchema);
export const showStepsSchema = z.function().args(tutorStepByStepSchema);
export const showMathSchema = z.function().args(tutorMathSchema);

// Also export the raw component schemas for component registration
export { tutorQuizSchema, tutorStepByStepSchema, tutorMathSchema };
// export { tutorConceptSchema, tutorQuizSchema, tutorStepByStepSchema, tutorMathSchema };
