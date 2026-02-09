![Torq Logo](public/torq.png)

# Torq - AI Tutor

Torq is an AI-powered learning platform designed to master any subject through interactive visualizations, personalized roadmaps, and instant feedback. Unlike standard chatbots, Torq synthesizes information into engaging visual components, quizzes, games, and video lessons.


## Features

### 1. **Interactive AI Chat**
   - Context-aware conversations that remember your learning progress.
   - Intelligent tools called on-demand to explain concepts visually.

### 2. **Dynamic Visual Tools**
   Torq doesn't just tell you answers; it shows them. The "Show, Don't Just Tell" philosophy is powered by a suite of custom components rendered on a dedicated learning canvas.

   - **Math Video Lessons**: 
     - Auto-generated video presentations with slides.
     - Real-time voice narration (TTS).
     - Explains concepts with simple terms, emojis, and real-life examples.
     - Includes an interactive "Quick Check" quiz at the end.

   - **Interactive Games**:
     - *Powered by Google Gemini*, Torq generates custom HTML5/CSS/JS games on the fly.
     - Play interactive simulations related to your study topic (e.g., "Fraction Pizza", "Physics Gravity Simulator").
     - Runs securely within a sandboxed environment.

   - **Comprehensive Quizzes**:
     - **Full Quiz**: A 10-question exam with scoring and detailed explanations.
     - **Quick Quiz**: Single-question checks to verify understanding.

   - **Flashcards**:
     - Sets of 5 interactive flashcards for spaced repetition and review.
     - Smooth flip animations and intuitive navigation.

   - **Web Search**:
     - Real-time information retrieval for current events, weather, and fast-changing data.

   - **Step-by-Step Guides**:
     - Broken down instructions for complex procedures.

## Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Video Generation**: [Remotion](https://www.remotion.dev/)
- **AI Integration**:
    - **Google Gemini API**: For generating interactive game code.
    - **Tambo SDK**: For tool definition and AI orchestration.
- **State Management**: Zustand
- **Icons**: Lucide React

## Capabilities

- **Game Generation**: The `/api/game` endpoint leverages Google's Gemini 1.5 Flash model to write functional game code based on a simple topic prompt.
- **Audio Synthesis**: The `/api/tts` endpoint generates natural-sounding voiceovers for video lessons.
- **Canvas Rendering**: A dynamic right-hand panel (`components-canvas`) that renders React components injected by the AI agent.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Create a `.env.local` file with:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
   # Add other required keys (Supabase, etc.)
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000)**

## How to Use

- **Ask for a lesson**: "Teach me about Photosynthesis." -> *Generates a Video Lesson.*
- **Ask for a game**: "Make a game about fractions." -> *Generates and renders a playable HTML5 game.*
- **Review**: "Give me flashcards for Spanish vocabulary." -> *Creates a Flashcard deck.*
- **Test yourself**: "Quiz me on Calculus." -> *Generates a 10-question graded quiz.*

---
Built with ❤️ for WeMakeDevs X Tambo Hackathon