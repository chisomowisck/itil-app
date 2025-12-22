import Link from "next/link";
import { BookOpen, Brain, GraduationCap, LayoutGrid, Trophy, Zap } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <GraduationCap className="w-12 h-12" />,
      title: "Mock Exams",
      description: "Take full-length practice exams with 40 questions. Get your score at the end and see which areas need improvement.",
      href: "/mock-exam",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Brain className="w-12 h-12" />,
      title: "Practice Tests",
      description: "Practice with immediate feedback. See correct answers and explanations right away to learn as you go.",
      href: "/practice",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Flashcards",
      description: "Quick learning mode with flashcards. Perfect for memorizing key concepts and definitions.",
      href: "/flashcards",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <LayoutGrid className="w-12 h-12" />,
      title: "Categories",
      description: "Study by topic: Incident Management, Change Control, Service Desk, and more. Focus on your weak areas.",
      href: "/categories",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Trophy className="w-12 h-12" />,
      title: "Progress Tracking",
      description: "Track your performance over time. See your scores, identify weak areas, and monitor improvement.",
      href: "/progress",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <BookOpen className="w-12 h-12" />,
      title: "Study Guide",
      description: "Quick reference guide covering all ITIL 4 Foundation concepts, practices, and principles.",
      href: "/study-guide",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ITIL 4 Foundation Exam Prep
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Master all 487 questions • Pass with confidence
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Ace Your ITIL 4 Foundation Exam
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Comprehensive exam preparation with 487 unique questions covering all ITIL 4 Foundation topics.
            Practice with mock exams, flashcards, and category-based learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                Get Started
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">487</div>
            <div className="text-slate-600 dark:text-slate-300">Unique Questions</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">15+</div>
            <div className="text-slate-600 dark:text-slate-300">Categories</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">100%</div>
            <div className="text-slate-600 dark:text-slate-300">Coverage</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 text-center shadow-md">
            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">Free</div>
            <div className="text-slate-600 dark:text-slate-300">Forever</div>
          </div>
        </div>

        {/* Quick Start CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white shadow-xl">
          <h3 className="text-3xl font-bold mb-4">Ready to Start?</h3>
          <p className="text-lg mb-6 opacity-90">
            Begin with a mock exam to test your current knowledge level
          </p>
          <Link
            href="/mock-exam"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Mock Exam
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-700 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600 dark:text-slate-400">
          <p>Questions sourced from <a href="https://github.com/Ditectrev/ITIL-4-Foundation-IT-Service-Management-Practice-Tests-Exams-Questions-Answers" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Ditectrev ITIL 4 Foundation Repository</a></p>
          <p className="mt-2">Good luck with your ITIL 4 Foundation exam! 🎓</p>
        </div>
      </footer>
    </div>
  );
}
