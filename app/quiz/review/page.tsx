'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Flag, Star, Filter, AlertCircle, Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizProgress, QuizProgress, getAllQuestions, Question } from '@/lib/firebase/services';

type FilterType = 'all' | 'correct' | 'incorrect' | 'flagged' | 'important';

function QuizReviewContent() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [progress, setProgress] = useState<QuizProgress | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortType, setSortType] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    useEffect(() => {
        async function loadData() {
            if (!user) return;
            try {
                const [allQuestions, userProgress] = await Promise.all([
                    getAllQuestions(),
                    getQuizProgress(user.uid)
                ]);
                setQuestions(allQuestions.length > 0 ? allQuestions : []);
                // Fallback to local questions if firebase one fails is handled in page.tsx usually, 
                // but here let's assume services returns empty array if fails or empty.
                // Ideally we should import the local fallback logic here too if needed.

                if (allQuestions.length === 0) {
                    const res = await fetch('/data/questions.json');
                    const data = await res.json();
                    setQuestions(data);
                }

                setProgress(userProgress);
            } catch (error) {
                console.error('Error loading review data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [user]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filter, searchTerm, sortType]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    if (!progress || Object.keys(progress.answers).length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black p-6 flex flex-col items-center justify-center">
                <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
                <h2 className="text-xl font-bold text-black dark:text-white mb-2">No Answers Yet</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">Start the quiz to see your reviewed answers here.</p>
                <Link href="/quiz" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                    Go to Quiz
                </Link>
            </div>
        );
    }

    // Filter questions
    const answeredQuestionIds = Object.keys(progress.answers).map(Number);

    const filteredQuestions = answeredQuestionIds.map(id => {
        const q = questions.find(question => question.id === id);
        if (!q) return null;

        const selectedAnswer = progress.answers[id];
        const isCorrect = selectedAnswer === q.correctAnswer;
        const isFlagged = progress.flaggedQuestions.includes(id);
        const isImportant = progress.importantQuestions.includes(id);

        // Apply filter
        if (filter === 'correct' && !isCorrect) return null;
        if (filter === 'incorrect' && isCorrect) return null;
        if (filter === 'flagged' && !isFlagged) return null;
        if (filter === 'important' && !isImportant) return null;

        return {
            ...q,
            selectedAnswer,
            isCorrect,
            isFlagged,
            isImportant
        };
        return {
            ...q,
            selectedAnswer,
            isCorrect,
            isFlagged,
            isImportant
        };
    })
        .filter((q): q is NonNullable<typeof q> => q !== null)
        .filter(q => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (q.question && q.question.toLowerCase().includes(search)) ||
                   (q.category && q.category.toLowerCase().includes(search));
        });

    // Sorting
    filteredQuestions.sort((a, b) => {
        if (sortType === 'incorrect') {
            if (a.isCorrect === b.isCorrect) return (a.id ?? 0) - (b.id ?? 0);
            return a.isCorrect ? 1 : -1; // Put incorrect first
        }
        if (sortType === 'flagged') {
            if (a.isFlagged === b.isFlagged) return (a.id ?? 0) - (b.id ?? 0);
            return a.isFlagged ? -1 : 1; // Put flagged first
        }
        if (sortType === 'important') {
            if (a.isImportant === b.isImportant) return (a.id ?? 0) - (b.id ?? 0);
            return a.isImportant ? -1 : 1; // Put important first
        }
        // Default: ID order
        return (a.id ?? 0) - (b.id ?? 0);
    });

    // Pagination
    const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
    const paginatedQuestions = filteredQuestions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/progress" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-xl font-bold text-black dark:text-white">Review Answers</h1>
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {filteredQuestions.length} Questions
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search questions or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        />
                    </div>

                    {/* Sort */}
                    <div className="relative min-w-[180px]">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            value={sortType}
                            onChange={(e) => setSortType(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value="default">Original Order</option>
                            <option value="incorrect">Incorrect First</option>
                            <option value="flagged">Flagged First</option>
                            <option value="important">Important First</option>
                        </select>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filter === 'all' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('correct')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${filter === 'correct' ? 'bg-green-600 text-white' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-green-500/50 text-green-600 dark:text-green-500'}`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Correct
                    </button>
                    <button
                        onClick={() => setFilter('incorrect')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${filter === 'incorrect' ? 'bg-red-600 text-white' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-red-500/50 text-red-600 dark:text-red-500'}`}
                    >
                        <XCircle className="w-4 h-4" />
                        Incorrect
                    </button>
                    <button
                        onClick={() => setFilter('flagged')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${filter === 'flagged' ? 'bg-orange-500 text-white' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-orange-500/50 text-orange-500'}`}
                    >
                        <Flag className="w-4 h-4" />
                        Flagged
                    </button>
                    <button
                        onClick={() => setFilter('important')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${filter === 'important' ? 'bg-yellow-500 text-white' : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-yellow-500/50 text-yellow-500'}`}
                    >
                        <Star className="w-4 h-4" />
                        Important
                    </button>
                </div>

                {/* Questions List */}
                <div className="space-y-6">
                    {paginatedQuestions.map((q) => (
                        <div key={q.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${q.isCorrect ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                                        {String.fromCharCode(65 + (q.selectedAnswer || 0))}
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{q.category}</span>
                                        <h3 className="font-semibold text-slate-900 dark:text-white mt-1">{q.question}</h3>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {q.isFlagged && <Flag className="w-4 h-4 text-orange-500" fill="currentColor" />}
                                    {q.isImportant && <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />}
                                </div>
                            </div>

                            <div className="space-y-2 pl-11">
                                {q.options && q.options.map((option, idx) => {
                                    const isSelected = q.selectedAnswer === idx;
                                    const isCorrect = q.correctAnswer === idx;

                                    let style = "p-3 rounded-lg text-sm border ";
                                    if (isCorrect) style += "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-300";
                                    else if (isSelected) style += "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300";
                                    else style += "bg-slate-50 dark:bg-zinc-800/50 border-transparent text-slate-600 dark:text-slate-400";

                                    return (
                                        <div key={idx} className={style}>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold w-4">{String.fromCharCode(65 + idx)}</span>
                                                <span>{option}</span>
                                                {isCorrect && <CheckCircle className="w-4 h-4 ml-auto text-green-600 dark:text-green-400" />}
                                                {isSelected && !isCorrect && <XCircle className="w-4 h-4 ml-auto text-red-600 dark:text-red-400" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-4 pl-11 pt-4 border-t border-slate-100 dark:border-zinc-800">
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    <span className="font-semibold text-slate-900 dark:text-white">Explanation:</span> {q.explanation}
                                </p>
                            </div>
                        </div>
                    ))}

                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500 dark:text-slate-400">No questions match your filter.</p>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {filteredQuestions.length > 0 && (
                        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-zinc-800">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Page {currentPage} of {totalPages}
                            </span>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function QuizReviewPage() {
    return (
        <ProtectedRoute>
            <QuizReviewContent />
        </ProtectedRoute>
    );
}
