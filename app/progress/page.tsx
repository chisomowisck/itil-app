import Link from 'next/link';
import { Home, TrendingUp, Award, Target } from 'lucide-react';

export default function Progress() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Progress Tracking</h1>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h2 className="text-3xl font-bold mb-4">Progress Tracking Coming Soon!</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            We're working on adding comprehensive progress tracking features including:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <Award className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <h3 className="font-bold mb-2">Score History</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Track your scores over time
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <Target className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <h3 className="font-bold mb-2">Weak Areas</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Identify topics needing more study
              </p>
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-700 rounded-xl">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 text-blue-500" />
              <h3 className="font-bold mb-2">Performance Trends</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                See your improvement over time
              </p>
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            For now, use the Practice Mode and Mock Exams to test your knowledge!
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/practice"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Practice Mode
            </Link>
            <Link
              href="/mock-exam"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Mock Exam
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

