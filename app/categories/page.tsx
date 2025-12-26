'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import Navigation from '@/components/Navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

function CategoriesContent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => {
        setQuestions(data);

        // Count questions per category
        const categoryCounts: { [key: string]: number } = {};
        data.forEach((q: Question) => {
          categoryCounts[q.category] = (categoryCounts[q.category] || 0) + 1;
        });
        setCategories(categoryCounts);
      });
  }, []);

  const categoryColors = [
    'from-blue-500 to-cyan-500',
    'from-purple-500 to-pink-500',
    'from-orange-500 to-red-500',
    'from-green-500 to-emerald-500',
    'from-yellow-500 to-amber-500',
    'from-indigo-500 to-blue-500',
    'from-pink-500 to-rose-500',
    'from-teal-500 to-cyan-500',
    'from-violet-500 to-purple-500',
    'from-lime-500 to-green-500',
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Study by Category</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Focus on specific ITIL 4 topics
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Navigation />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(categories)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count], index) => (
              <Link
                key={category}
                href={`/categories/${encodeURIComponent(category)}`}
                className="group relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-zinc-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-black dark:bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="inline-flex p-3 rounded-xl bg-black dark:bg-white text-white dark:text-black mb-4">
                  <BookOpen className="w-8 h-8" />
                </div>

                <h3 className="text-xl font-bold mb-2 text-black dark:text-white">
                  {category}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {count} question{count !== 1 ? 's' : ''}
                </p>

                <div className="flex items-center text-sm font-semibold text-black dark:text-white">
                  Start Practice
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
        </div>

        <div className="mt-12 bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-zinc-800">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">About Categories</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Questions are organized into the following ITIL 4 Foundation topics:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
            <li>• Incident Management</li>
            <li>• Problem Management</li>
            <li>• Change Control & Enablement</li>
            <li>• Service Desk</li>
            <li>• Service Level Management</li>
            <li>• Service Request Management</li>
            <li>• Continual Improvement</li>
            <li>• Release & Deployment Management</li>
            <li>• IT Asset Management</li>
            <li>• Event & Monitoring Management</li>
            <li>• Information Security</li>
            <li>• Relationship Management</li>
            <li>• Supplier Management</li>
            <li>• Guiding Principles</li>
            <li>• Service Value System</li>
            <li>• Four Dimensions of Service Management</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default function Categories() {
  return (
    <ProtectedRoute>
      <CategoriesContent />
    </ProtectedRoute>
  );
}
