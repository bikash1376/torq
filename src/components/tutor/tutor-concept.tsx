// "use client";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { z } from "zod";

// export const tutorConceptSchema = z.object({
//     title: z.string().describe("The main concept title"),
//     content: z.string().describe("Explanation text for the concept"),
//     keyPoints: z.array(z.string()).describe("List of key takeaways"),
//     difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Beginner"),
// });

// export type TutorConceptProps = z.infer<typeof tutorConceptSchema>;

// export function TutorConcept({ title, content, keyPoints, difficulty }: TutorConceptProps) {
//     const difficultyColor = {
//         Beginner: "bg-green-100 text-green-800 border-green-200",
//         Intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
//         Advanced: "bg-red-100 text-red-800 border-red-200",
//     }[difficulty];

//     return (
//         <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full">
//             <div className="flex justify-between items-start mb-4">
//                 <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
//                     {title}
//                 </h3>
//                 <span className={`text-xs px-2 py-1 rounded-full border font-medium ${difficultyColor}`}>
//                     {difficulty}
//                 </span>
//             </div>

//             <div className="text-zinc-600 dark:text-zinc-300 mb-6 leading-relaxed prose dark:prose-invert max-w-none">
//                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
//             </div>

//             {keyPoints && keyPoints.length > 0 && (
//                 <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4">
//                     <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2 uppercase tracking-wider">
//                         Key Takeaways
//                     </h4>
//                     <ul className="space-y-2">
//                         {keyPoints.map((point, i) => (
//                             <li key={i} className="flex gap-2 text-sm text-zinc-600 dark:text-zinc-400">
//                                 <span className="text-blue-500">•</span>
//                                 {point}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// }
