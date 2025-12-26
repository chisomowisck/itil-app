'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Calendar, Clock, Flag, Star, CheckCircle, XCircle, AlertCircle, Filter, PieChart } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import Navigation from '@/components/Navigation';
import UserProfile from '@/components/auth/UserProfile';
import { getExamScoreById, ExamScore } from '@/lib/firebase/services';
import { useAuth } from '@/contexts/AuthContext';


function ExamDetailContent({ id }: { id: string }) {
    const router = useRouter();
    const { user } = useAuth();
    const [score, setScore] = useState<ExamScore | null>(null);
    const [loading, setLoading] = useState(true);
    const [questionFilter, setQuestionFilter] = useState<'all' | 'correct' | 'incorrect' | 'flagged' | 'important'>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    useEffect(() => {
        const loadScore = async () => {
            if (!id) return;

            try {
                const examData = await getExamScoreById(id);
                if (examData) {
                    // If the exam doesn't belong to the user (and we had multi-user logic properly enforced), we'd redirect.
                    // For now, assuming user can see it if they have the ID, or rules block it.
                    setScore(examData);
                } else {
                    // Fallback to local storage if not found in Firebase (legacy support)
                    const localScores = localStorage.getItem('examScores');
                    if (localScores) {
                        const scores = JSON.parse(localScores);
                        const found = scores.find((s: ExamScore) => s.id === id);
                        if (found) setScore(found);
                    }
                }
            } catch (error) {
                console.error('Error loading exam score:', error);
            } finally {
                setLoading(false);
            }
        };

        loadScore();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    if (!score) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col items-center justify-center p-6">
                <h1 className="text-2xl font-bold text-black dark:text-white mb-4">Exam result not found</h1>
                <Link href="/progress" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                    Back to Progress
                </Link>
            </div>
        );
    }

    // Calculate Category Stats
    const categoryStats: Record<string, { total: number; correct: number }> = {};
    score.questionResults?.forEach(q => {
        if (!categoryStats[q.category]) {
            categoryStats[q.category] = { total: 0, correct: 0 };
        }
        categoryStats[q.category].total++;
        if (q.isCorrect) {
            categoryStats[q.category].correct++;
        }
    });

    const categories = Object.keys(categoryStats).sort();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-20">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/progress" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors">
                                <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-black dark:text-white flex items-center gap-3">
                                    Exam Result
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${score.passed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                                        {score.passed ? 'PASSED' : 'FAILED'}
                                    </span>
                                </h1>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">{formatDate(score.date)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <div className="text-2xl font-bold text-black dark:text-white">{score.percentage}%</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{score.correct}/{score.total} Correct</div>
                            </div>
                            <Navigation />
                            <UserProfile />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 max-w-5xl">

                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                            <Clock className="w-4 h-4" />
                            Time Spent
                        </div>
                        <div className="text-2xl font-bold text-black dark:text-white">{formatTime(score.timeSpent)}</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                            Correct
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{score.correct}</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                            <Flag className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                            Flagged
                        </div>
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{score.flaggedCount}</div>
                    </div>
                    <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-sm font-semibold">
                            <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
                            Incorrect
                        </div>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{score.total - score.correct}</div>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-6 mb-8">
                    <h3 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Performance by Category
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categories.map(cat => {
                            const stats = categoryStats[cat];
                            const percent = Math.round((stats.correct / stats.total) * 100);
                            return (
                                <div key={cat} className="p-4 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300 line-clamp-1" title={cat}>{cat}</span>
                                        <span className={`text-sm font-bold ${percent >= 65 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                                            {percent}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-1">
                                        <div className={`h-full ${percent >= 65 ? 'bg-green-500 dark:bg-green-400' : 'bg-orange-500 dark:bg-orange-400'}`} style={{ width: `${percent}%` }}></div>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
                                        {stats.correct}/{stats.total} correct
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-4 mb-6 sticky top-24 z-10">
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        {/* Status Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                            <button
                                onClick={() => setQuestionFilter('all')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${questionFilter === 'all' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-700'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setQuestionFilter('incorrect')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${questionFilter === 'incorrect' ? 'bg-red-600 dark:bg-red-700 text-white' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30'
                                    }`}
                            >
                                <XCircle className="w-4 h-4" /> Incorrect
                            </button>
                            <button
                                onClick={() => setQuestionFilter('correct')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${questionFilter === 'correct' ? 'bg-green-600 dark:bg-green-700 text-white' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                                    }`}
                            >
                                <CheckCircle className="w-4 h-4" /> Correct
                            </button>
                            <button
                                onClick={() => setQuestionFilter('flagged')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${questionFilter === 'flagged' ? 'bg-orange-600 dark:bg-orange-700 text-white' : 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
                                    }`}
                            >
                                <Flag className="w-4 h-4" /> Flagged
                            </button>
                            <button
                                onClick={() => setQuestionFilter('important')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-1.5 ${questionFilter === 'important' ? 'bg-yellow-600 dark:bg-yellow-700 text-white' : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                                    }`}
                            >
                                <Star className="w-4 h-4" /> Important
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="w-full md:w-64">
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="w-full p-2 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-black dark:text-white text-sm font-medium focus:ring-2 focus:ring-black dark:focus:ring-white focus:outline-none"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat} ({categoryStats[cat].total})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Question List */}
                <div className="space-y-4">
                    {score.questionResults
                        ?.map((result, index) => ({ result, originalIndex: index }))
                        .filter(({ result }) => {
                            const matchesStatus =
                                questionFilter === 'all' ? true :
                                    questionFilter === 'correct' ? result.isCorrect :
                                        questionFilter === 'incorrect' ? !result.isCorrect && result.selectedAnswer !== null :
                                            questionFilter === 'flagged' ? result.isFlagged :
                                                questionFilter === 'important' ? result.isImportant : true;

                            const matchesCategory = categoryFilter === 'all' ? true : result.category === categoryFilter;

                            return matchesStatus && matchesCategory;
                        })
                        .map(({ result, originalIndex }) => (
                            <div
                                key={originalIndex}
                                className={`bg-white dark:bg-zinc-900 p-6 rounded-xl border-2 shadow-sm transition-all ${result.isCorrect ? 'border-green-100 dark:border-green-900/30' :
                                    result.selectedAnswer === null ? 'border-slate-100 dark:border-zinc-800' : 'border-red-100 dark:border-red-900/30'
                                    }`}
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-base shrink-0 ${result.isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                        Q{originalIndex + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400">
                                                {result.category}
                                            </span>
                                            {result.isFlagged && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                                                    <Flag className="w-3 h-3" /> Flagged
                                                </span>
                                            )}
                                            {result.isImportant && (
                                                <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
                                                    <Star className="w-3 h-3" /> Important
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-6 leading-relaxed">
                                            {result.question}
                                        </h3>

                                        <div className="space-y-3 mb-6">
                                            {result.options?.map((option, optIdx) => {
                                                const isSelected = result.selectedAnswer === optIdx;
                                                const isCorrect = result.correctAnswer === optIdx;
                                                const letter = String.fromCharCode(65 + optIdx);

                                                let statusClass = "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-400";
                                                if (isCorrect) statusClass = "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 font-medium ring-1 ring-green-300 dark:ring-green-700";
                                                else if (isSelected) statusClass = "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 font-medium ring-1 ring-red-300 dark:ring-red-700";

                                                return (
                                                    <div key={optIdx} className={`p-4 rounded-lg border flex items-start gap-3 text-sm transition-colors ${statusClass}`}>
                                                        <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isCorrect ? 'bg-green-600 text-white' :
                                                            isSelected ? 'bg-red-600 text-white' :
                                                                'bg-slate-200 dark:bg-zinc-700 text-slate-400 dark:text-slate-500'
                                                            }`}>
                                                            {letter}
                                                        </div>
                                                        <div className="flex-1">{option}</div>
                                                        {isCorrect && <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />}
                                                        {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {result.explanation && (
                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-5">
                                                <h4 className="flex items-center gap-2 text-sm font-bold text-blue-800 dark:text-blue-400 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                                                    Explanation
                                                </h4>
                                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                    {result.explanation}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Footer Stats for search results */}
                <div className="mt-8 text-center text-slate-500 text-sm pb-8">
                    Showing {
                        score.questionResults
                            ?.filter((result) => {
                                const matchesStatus =
                                    questionFilter === 'all' ? true :
                                        questionFilter === 'correct' ? result.isCorrect :
                                            questionFilter === 'incorrect' ? !result.isCorrect && result.selectedAnswer !== null :
                                                questionFilter === 'flagged' ? result.isFlagged :
                                                    questionFilter === 'important' ? result.isImportant : true;

                                const matchesCategory = categoryFilter === 'all' ? true : result.category === categoryFilter;

                                return matchesStatus && matchesCategory;
                            }).length
                    } questions
                </div>

            </main>
        </div>
    );
}

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return (
        <ProtectedRoute>
            <ExamDetailContent id={resolvedParams.id} />
        </ProtectedRoute>
    );
}
