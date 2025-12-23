import Link from "next/link";
import { BookOpen, Brain, GraduationCap, LayoutGrid, Trophy, Zap, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Mock Exams",
      description: "Take full-length practice exams with 40 questions. Get your score at the end and see which areas need improvement.",
      href: "/mock-exam",
      stats: "40 Questions"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Practice Tests",
      description: "Practice with immediate feedback. See correct answers and explanations right away to learn as you go.",
      href: "/practice",
      stats: "Instant Feedback"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Flashcards",
      description: "Quick learning mode with flashcards. Perfect for memorizing key concepts and definitions.",
      href: "/flashcards",
      stats: "487 Cards"
    },
    {
      icon: <LayoutGrid className="w-8 h-8" />,
      title: "Categories",
      description: "Study by topic: Incident Management, Change Control, Service Desk, and more. Focus on your weak areas.",
      href: "/categories",
      stats: "15+ Topics"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Track your performance over time. See your scores, identify weak areas, and monitor improvement.",
      href: "/progress",
      stats: "Coming Soon"
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Study Guide",
      description: "Quick reference guide covering all ITIL 4 Foundation concepts, practices, and principles.",
      href: "/study-guide",
      stats: "Quick Reference"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">
                ITIL 4 Foundation
              </h1>
              <p className="text-slate-600 mt-1">
                Exam Preparation Platform
              </p>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">487</div>
                <div className="text-xs text-slate-600">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">65%</div>
                <div className="text-xs text-slate-600">Pass Rate</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-12">
          <div className="max-w-3xl">
            <h2 className="text-5xl font-bold mb-6 text-black leading-tight">
              Master Your ITIL 4 Foundation Exam
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              A comprehensive study platform with 487 carefully curated questions covering all ITIL 4 Foundation topics.
              Practice with realistic mock exams, interactive flashcards, and focused category learning.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/mock-exam"
                className="bg-black text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2"
              >
                Start Mock Exam
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/practice"
                className="border-2 border-black text-black px-8 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Practice Mode
              </Link>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-black hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-lg text-black group-hover:bg-black group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {feature.stats}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                {feature.description}
              </p>
              <div className="flex items-center text-sm font-semibold text-black">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Why Choose Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-8 mb-12">
          <h3 className="text-2xl font-bold mb-6 text-black">Why Choose This Platform?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-100 rounded-lg shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-black mb-1">Comprehensive Coverage</div>
                <div className="text-sm text-slate-600">All 487 questions from official ITIL 4 Foundation syllabus</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold text-black mb-1">Realistic Exam Simulation</div>
                <div className="text-sm text-slate-600">60-minute timer, 40 questions, just like the real exam</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="font-semibold text-black mb-1">Instant Feedback</div>
                <div className="text-sm text-slate-600">Learn as you practice with immediate answer explanations</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                <CheckCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="font-semibold text-black mb-1">Flexible Learning</div>
                <div className="text-sm text-slate-600">Multiple study modes: exams, practice, flashcards, categories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:border-black transition-colors">
            <div className="text-4xl font-bold text-black mb-2">487</div>
            <div className="text-slate-600 text-sm">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:border-black transition-colors">
            <div className="text-4xl font-bold text-black mb-2">15+</div>
            <div className="text-slate-600 text-sm">Categories</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:border-black transition-colors">
            <div className="text-4xl font-bold text-black mb-2">100%</div>
            <div className="text-slate-600 text-sm">Coverage</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center hover:border-black transition-colors">
            <div className="text-4xl font-bold text-black mb-2">65%</div>
            <div className="text-slate-600 text-sm">Pass Rate</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="container mx-auto px-6 text-center text-slate-600">
          <p className="text-sm">Questions sourced from <a href="https://github.com/Ditectrev/ITIL-4-Foundation-IT-Service-Management-Practice-Tests-Exams-Questions-Answers" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-semibold">Ditectrev ITIL 4 Foundation Repository</a></p>
          <p className="mt-2 text-sm">© 2025 ITIL 4 Foundation Exam Prep. For educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
