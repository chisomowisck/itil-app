import Link from "next/link";
import { BookOpen, Brain, GraduationCap, LayoutGrid, Trophy, Zap, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <GraduationCap className="w-10 h-10" />,
      title: "Mock Exams",
      description: "Take full-length practice exams with 40 questions. Get your score at the end and see which areas need improvement.",
      href: "/mock-exam"
    },
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Practice Tests",
      description: "Practice with immediate feedback. See correct answers and explanations right away to learn as you go.",
      href: "/practice"
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Flashcards",
      description: "Quick learning mode with flashcards. Perfect for memorizing key concepts and definitions.",
      href: "/flashcards"
    },
    {
      icon: <LayoutGrid className="w-10 h-10" />,
      title: "Categories",
      description: "Study by topic: Incident Management, Change Control, Service Desk, and more. Focus on your weak areas.",
      href: "/categories"
    },
    {
      icon: <Trophy className="w-10 h-10" />,
      title: "Progress Tracking",
      description: "Track your performance over time. See your scores, identify weak areas, and monitor improvement.",
      href: "/progress"
    },
    {
      icon: <BookOpen className="w-10 h-10" />,
      title: "Study Guide",
      description: "Quick reference guide covering all ITIL 4 Foundation concepts, practices, and principles.",
      href: "/study-guide"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-black tracking-tight">
            ITIL 4 Foundation
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            Exam Preparation Platform
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mb-20">
          <h2 className="text-6xl font-bold mb-6 text-black leading-tight">
            Master Your ITIL 4<br />Foundation Exam
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            A comprehensive study platform with 487 carefully curated questions covering all ITIL 4 Foundation topics.
            Practice with realistic mock exams, interactive flashcards, and focused category learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group relative bg-white border-2 border-slate-200 p-8 hover:border-black transition-all duration-200"
            >
              <div className="mb-6 text-black">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-black">
                {feature.title}
              </h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-black">
                Start
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="bg-white border-2 border-slate-200 p-8 text-center">
            <div className="text-5xl font-bold text-black mb-2">487</div>
            <div className="text-slate-600 text-sm uppercase tracking-wider">Questions</div>
          </div>
          <div className="bg-white border-2 border-slate-200 p-8 text-center">
            <div className="text-5xl font-bold text-black mb-2">15+</div>
            <div className="text-slate-600 text-sm uppercase tracking-wider">Categories</div>
          </div>
          <div className="bg-white border-2 border-slate-200 p-8 text-center">
            <div className="text-5xl font-bold text-black mb-2">100%</div>
            <div className="text-slate-600 text-sm uppercase tracking-wider">Coverage</div>
          </div>
          <div className="bg-white border-2 border-slate-200 p-8 text-center">
            <div className="text-5xl font-bold text-black mb-2">65%</div>
            <div className="text-slate-600 text-sm uppercase tracking-wider">Pass Rate</div>
          </div>
        </div>

        {/* Quick Start CTA */}
        <div className="bg-black p-12 text-center">
          <h3 className="text-4xl font-bold mb-4 text-white">Ready to Begin?</h3>
          <p className="text-lg mb-8 text-slate-300 max-w-2xl mx-auto">
            Start with a full mock exam to assess your current knowledge level
          </p>
          <Link
            href="/mock-exam"
            className="inline-block bg-white text-black px-10 py-4 font-bold text-lg hover:bg-slate-100 transition-colors border-2 border-white"
          >
            Start Mock Exam
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-12 bg-white">
        <div className="container mx-auto px-6 text-center text-slate-600">
          <p className="text-sm">Questions sourced from <a href="https://github.com/Ditectrev/ITIL-4-Foundation-IT-Service-Management-Practice-Tests-Exams-Questions-Answers" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-semibold">Ditectrev ITIL 4 Foundation Repository</a></p>
          <p className="mt-4 text-sm">© 2025 ITIL 4 Foundation Exam Prep. For educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
