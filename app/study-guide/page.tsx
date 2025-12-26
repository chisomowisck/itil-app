'use client';

import Link from 'next/link';
import { Home, BookOpen } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import Navigation from '@/components/Navigation';

function StudyGuideContent() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black dark:text-white">ITIL 4 Study Guide</h1>
            <div className="flex items-center gap-4">
              <Navigation />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 p-8">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
          <h2 className="text-3xl font-bold mb-6 text-center text-black dark:text-white">Quick Reference Guide</h2>

          <div className="space-y-6">
            <section>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">ITIL 4 Guiding Principles</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Focus on Value</strong> - Everything should link to value for stakeholders</li>
                <li><strong>Start Where You Are</strong> - Don't start from scratch, use what you have</li>
                <li><strong>Progress Iteratively with Feedback</strong> - Work in small steps with feedback</li>
                <li><strong>Collaborate and Promote Visibility</strong> - Work together and share information</li>
                <li><strong>Think and Work Holistically</strong> - Consider the whole system</li>
                <li><strong>Keep It Simple and Practical</strong> - Use minimum steps to achieve objectives</li>
                <li><strong>Optimize and Automate</strong> - Maximize value of work and automate where possible</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Four Dimensions of Service Management</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Organizations and People</strong> - Roles, responsibilities, culture, staffing</li>
                <li><strong>Information and Technology</strong> - Information, knowledge, technologies</li>
                <li><strong>Partners and Suppliers</strong> - Relationships with other organizations</li>
                <li><strong>Value Streams and Processes</strong> - How work is organized and activities</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Service Value Chain Activities</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Plan</strong> - Shared understanding of vision and direction</li>
                <li><strong>Improve</strong> - Continual improvement of products and services</li>
                <li><strong>Engage</strong> - Understanding stakeholder needs</li>
                <li><strong>Design and Transition</strong> - Meeting expectations for quality and deployment</li>
                <li><strong>Obtain/Build</strong> - Ensuring service components are available</li>
                <li><strong>Deliver and Support</strong> - Delivering and supporting services</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Key Practices</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li><strong>Incident Management</strong> - Minimize negative impact of incidents</li>
                <li><strong>Problem Management</strong> - Reduce likelihood and impact of incidents</li>
                <li><strong>Change Enablement</strong> - Maximize successful service and product changes</li>
                <li><strong>Service Desk</strong> - Capture demand for incident resolution and service requests</li>
                <li><strong>Service Level Management</strong> - Set clear business-based targets</li>
                <li><strong>Continual Improvement</strong> - Align practices and services with changing needs</li>
              </ul>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">Exam Tips</h3>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300">
                <li>40 questions, 60 minutes</li>
                <li>65% passing score (26 out of 40)</li>
                <li>Multiple choice format</li>
                <li>Focus on understanding concepts, not memorization</li>
                <li>Read questions carefully - watch for "NOT" or "EXCEPT"</li>
                <li>Eliminate obviously wrong answers first</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 p-6 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
            <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Ready to Practice?</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Now that you've reviewed the key concepts, test your knowledge with our practice questions!
            </p>
            <div className="flex gap-4">
              <Link
                href="/practice"
                className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 hover:shadow-md transition-all"
              >
                Practice Mode
              </Link>
              <Link
                href="/mock-exam"
                className="border-2 border-black dark:border-white text-black dark:text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-zinc-700 transition-all"
              >
                Mock Exam
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StudyGuide() {
  return (
    <ProtectedRoute>
      <StudyGuideContent />
    </ProtectedRoute>
  );
}
