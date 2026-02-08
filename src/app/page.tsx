import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-background text-foreground">
      <main className="max-w-2xl w-full space-y-8">
        <div className="flex flex-col items-center">
          <a href="https://tambo.co" target="_blank" rel="noopener noreferrer">
            <Image
              src="/torq.png"
              alt="Tambo AI Logo"
              width={80}
              height={80}
              className="mb-4"
            />
          </a>
          <h1 className="text-4xl text-center font-bold tracking-tight">Torq - AI Learning Tutor</h1>
        </div>

        <div className="w-full space-y-8">
          <div className="bg-card px-8 py-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Start Learning</h2>
            <ApiKeyCheck>
              <div className="flex gap-4 flex-wrap">
                <a
                  href="/chat"
                  className="px-6 py-3 rounded-md font-medium shadow-sm transition-colors text-lg mt-4 bg-primary hover:bg-primary/90 text-primary-foreground w-full text-center"
                >
                  Enter Classroom →
                </a>
              </div>
            </ApiKeyCheck>
          </div>

          <div className="bg-card px-8 py-6 rounded-lg border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">How it works:</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Experience a personalized learning session where concepts come alive.
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-2 text-muted-foreground">
                <span className="text-primary font-bold">•</span>
                Ask questions and get interactive explanations
              </li>
              <li className="flex gap-2 text-muted-foreground">
                <span className="text-primary font-bold">•</span>
                Take quizzes to test your knowledge
              </li>
              <li className="flex gap-2 text-muted-foreground">
                <span className="text-primary font-bold">•</span>
                Follow step-by-step guides for complex topics
              </li>
            </ul>

            <div className="flex gap-4 flex-wrap mt-4">
              <a
                href="https://tambo.co/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-md font-medium transition-colors text-lg mt-4 border border-border hover:bg-accent"
              >
                View Docs
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
