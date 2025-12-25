'use client';

import Link from "next/link";
import { BookOpen, Brain, GraduationCap, LayoutGrid, Trophy, Zap, ArrowRight, CheckCircle, LogIn, UserPlus, FileText, Dumbbell, CreditCard, Layers, TrendingUp, BookMarked } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import UserProfile from "@/components/auth/UserProfile";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect removed to allow access to dashboard


  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Dashboard for authenticated users
  if (user) {
    const tools = [
      {
        title: "Mock Exam",
        description: "Full-length practice exams with 40 questions and timer.",
        icon: <FileText className="w-8 h-8 text-blue-600" />,
        href: "/mock-exam",
        color: "bg-blue-50 border-blue-200 hover:border-blue-400"
      },
      {
        title: "Practice Mode",
        description: "Practice without time limits. focus on learning.",
        icon: <Dumbbell className="w-8 h-8 text-green-600" />,
        href: "/practice",
        color: "bg-green-50 border-green-200 hover:border-green-400"
      },
      {
        title: "Flashcards",
        description: "Quick revision with flashcards for key concepts.",
        icon: <CreditCard className="w-8 h-8 text-purple-600" />,
        href: "/flashcards",
        color: "bg-purple-50 border-purple-200 hover:border-purple-400"
      },
      {
        title: "Categories",
        description: "Study questions by specific ITIL 4 categories.",
        icon: <Layers className="w-8 h-8 text-orange-600" />,
        href: "/categories",
        color: "bg-orange-50 border-orange-200 hover:border-orange-400"
      },
      {
        title: "Progress",
        description: "Track your performance and see your improvement.",
        icon: <TrendingUp className="w-8 h-8 text-red-600" />,
        href: "/progress",
        color: "bg-red-50 border-red-200 hover:border-red-400"
      },
      {
        title: "Study Guide",
        description: "Comprehensive guide to ITIL 4 Foundation.",
        icon: <BookMarked className="w-8 h-8 text-indigo-600" />,
        href: "/study-guide",
        color: "bg-indigo-50 border-indigo-200 hover:border-indigo-400"
      }
    ];

    return (
      <div className="min-h-screen bg-slate-50">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-black text-white p-2 rounded-lg">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h1 className="text-xl font-bold text-black">ITIL 4 Prep</h1>
              </div>
              <UserProfile />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-black mb-2">Welcome back!</h2>
              <p className="text-slate-600">Select a tool to start practicing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Link
                  key={index}
                  href={tool.href}
                  className={`block p-6 rounded-xl border transition-all duration-200 hover:shadow-lg ${tool.color}`}
                >
                  <div className="mb-4 bg-white w-14 h-14 rounded-lg flex items-center justify-center shadow-sm">
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{tool.title}</h3>
                  <p className="text-slate-600 text-sm">{tool.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }
  // Landing page for non-authenticated users
  const features = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Mock Exams",
      description: "Take full-length practice exams with 40 questions. Get your score at the end and see which areas need improvement.",
      stats: "40 Questions"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Track your performance over time. See your scores, identify weak areas, and monitor improvement.",
      stats: "Personal Stats"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Smart Learning",
      description: "Focus on your weak areas with intelligent question selection and detailed explanations.",
      stats: "AI-Powered"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="flex items-center gap-2 px-6 py-2.5 border-2 border-black text-black rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12 border border-slate-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl font-bold mb-6 text-black leading-tight">
              Master Your ITIL 4 Foundation Exam
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              A comprehensive study platform with 487 carefully curated questions covering all ITIL 4 Foundation topics.
              Create an account to track your progress, save your scores, and monitor your improvement over time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/register"
                className="bg-black text-white px-10 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-2 text-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="border-2 border-black text-black px-10 py-4 rounded-lg font-semibold hover:bg-slate-50 transition-colors text-lg"
              >
                Login
              </Link>
            </div>
            <p className="text-sm text-slate-500 mt-6">
              No credit card required • Free forever • Start practicing immediately
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200 p-8 hover:border-black hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-lg text-black">
                  {feature.icon}
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {feature.stats}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-black">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
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
