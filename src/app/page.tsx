import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Zap, Brain, Shield, ChevronDown } from "lucide-react";
import { SignedIn, SignedOut } from "@insforge/nextjs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="relative h-20 w-20 overflow-hidden rounded-full">
              <Image
                src="/torq.png"
                alt="Torq Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight">Torq</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href="/chat"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium mb-4">
              Not backed by Tambo
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter">
              Master any subject with <span className="text-primary">Torq</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42rem] mx-auto leading-relaxed">
              Your personal AI tutor that adapts to your learning style. Interactive visualizations, instant feedback, and personalized roadmaps.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-sm sm:max-w-md">
            <Link
              href="/chat"
              className="bg-primary text-primary-foreground h-12 px-8 rounded-md font-medium text-lg flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="border border-input bg-background h-12 px-8 rounded-md font-medium text-lg flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Explore Features
            </Link>
          </div>

          {/* Demo Video */}
          <div className="mt-16 w-full max-w-5xl p-4 md:p-8 bg-zinc-900/50 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black/40  border border-white/5">
              <video
                src="/torq-tutor-demo.mp4"
                
                className="w-full h-full object-cover"
                preload="metadata"
                autoPlay
                muted
                loop
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* What is Torq */}
        <section id="about" className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Not just another chatbot. <br />A complete learning engine.</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Most AI tools give you text. Torq gives you understanding. Using advanced synthesis engines, Torq breaks down complex topics into interactive visual components, clear roadmaps, and verifiable facts.
                </p>
                <div className="space-y-2 pt-4">
                  {[
                    "Personalized learning paths",
                    "Real-time knowledge synthesis",
                    "Interactive visual aids"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-lg space-y-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Deep Understanding</h3>
                    <p className="text-sm text-muted-foreground">Torq builds a mental model of what you know and adapts explanations accordingly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Instant Feedback</h3>
                    <p className="text-sm text-muted-foreground">Get corrected immediately when you misunderstand a concept, with clear reasons why.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Fact-Checked Sources</h3>
                    <p className="text-sm text-muted-foreground">All educational content is cross-referenced for accuracy and reliability.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20">
          <div className="container px-4 md:px-6 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to excel</h2>
              <p className="text-muted-foreground text-lg">
                Powerful tools designed to accelerate your learning journey from novice to expert.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: "Smart Chat", desc: "Context-aware conversations that remember your progress." },
                { title: "Visual Explanations", desc: "Dynamic charts and diagrams generated on the fly." },
                { title: "Flashcards", desc: "Auto-generated review decks for spaced repetition." },
                { title: "Progress Tracking", desc: "Visual dashboards to see your mastery over time." },
                { title: "Topic Deep Dives", desc: "Drill down into specific sub-topics instantly." },
                { title: "Export & Share", desc: "Save your learning summaries and share with peers." },
              ].map((feature, i) => (
                <div key={i} className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                  <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 bg-muted/30">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {[
                { q: "Is Torq free to use?", a: "Yes, Torq offers a generous free tier for all students. Premium features are available for power users." },
                { q: "Can I use Torq for any subject?", a: "Absolutely. Torq is trained on a vast array of subjects from STEM to Humanities." },
                { q: "How accurate is the information?", a: "We prioritize accuracy by cross-referencing high-quality educational datasets, but always encourage critical thinking." },
              ].map((faq, i) => (
                <div key={i} className="rounded-lg border border-border bg-card px-6 py-4">
                  <details className="group">
                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                      {faq.q}
                      < ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="text-muted-foreground mt-4 pt-4 border-t border-border/50">
                      {faq.a}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src="/torq.png"
                  alt="Torq Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-2xl font-bold">Torq</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Empowering learners worldwide effectively and efficiently with AI.
            </p>
          </div>
          {/* <div className="grid grid-cols-2 gap-12 sm:gap-24">
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-primary">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="/chat" className="hover:text-primary">Login</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div> */}
          <div>
            <Link
              href="/chat"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Tambo X WeMakeDevs Hackathon
            </Link>
            
          </div>
          
        </div>
        <div className="container px-4 md:px-6 mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Torq AI. All rights reserved.
          Created by <Link href="https://x.com/bikash1376" className="underline text-primary">@bikash1376</Link> and Antigravity
        </div>
      </footer>
    </div>
  );
}
