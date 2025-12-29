'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, Flag, Star, Filter, AlertCircle, Search, ChevronLeft, ChevronRight, ArrowUpDown, RotateCcw, Target, Zap, TrendingUp } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ExplanationBox from '@/components/ExplanationBox';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizProgress, QuizProgress, getAllQuestions, Question } from '@/lib/firebase/services';

type FilterType = 'all' | 'correct' | 'incorrect' | 'flagged' | 'important';

function QuizReviewContent() {
    const { user } = useAuth();
    const router = useRouter();
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

    // Calculate retry stats
    const answeredQuestionIds = Object.keys(progress.answers).map(Number);
    const incorrectQuestions = answeredQuestionIds.filter(id => {
        const q = questions.find(question => question.id === id);
        if (!q) return false;
        return progress.answers[id] !== q.correctAnswer;
    });
    const flaggedQuestions = progress.flaggedQuestions;
    const importantQuestions = progress.importantQuestions;

    // Handle retry navigation
    const handleRetry = (type: 'failed' | 'flagged' | 'important') => {
        let questionIds: number[] = [];

        if (type === 'failed') {
            questionIds = incorrectQuestions;
        } else if (type === 'flagged') {
            questionIds = flaggedQuestions;
        } else if (type === 'important') {
            questionIds = importantQuestions;
        }

        if (questionIds.length === 0) return;

        // Store retry session in localStorage
        localStorage.setItem('retrySession', JSON.stringify({
            type,
            questionIds,
            startTime: Date.now()
        }));

        // Navigate to retry page
        router.push(`/quiz/retry?type=${type}`);
    };

    // Filter questions
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
                {/* Retry Mastery Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <h2 className="text-lg font-bold text-black dark:text-white">Master Your Weak Areas</h2>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Focus on specific question types to improve your performance. Each retry session is tracked separately.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Retry Failed Questions */}
                        <button
                            onClick={() => handleRetry('failed')}
                            disabled={incorrectQuestions.length === 0}
                            className="group relative overflow-hidden bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 text-left transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-red-500 dark:bg-red-600 rounded-lg flex items-center justify-center mb-4">
                                    <XCircle className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">Retry Failed</h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                                    Master the questions you got wrong
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {incorrectQuestions.length}
                                    </span>
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                                        Questions
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* Retry Flagged Questions */}
                        <button
                            onClick={() => handleRetry('flagged')}
                            disabled={flaggedQuestions.length === 0}
                            className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-6 text-left transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-orange-500 dark:bg-orange-600 rounded-lg flex items-center justify-center mb-4">
                                    <Flag className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-orange-900 dark:text-orange-100 mb-2">Retry Flagged</h3>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
                                    Review questions you marked for later
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        {flaggedQuestions.length}
                                    </span>
                                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">
                                        Questions
                                    </span>
                                </div>
                            </div>
                        </button>

                        {/* Retry Important Questions */}
                        <button
                            onClick={() => handleRetry('important')}
                            disabled={importantQuestions.length === 0}
                            className="group relative overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6 text-left transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                            <div className="relative">
                                <div className="w-12 h-12 bg-yellow-500 dark:bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                                    <Star className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-100 mb-2">Retry Important</h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-4">
                                    Practice questions you marked as key
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                        {importantQuestions.length}
                                    </span>
                                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400 uppercase tracking-wide">
                                        Questions
                                    </span>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-200 dark:border-zinc-800 my-8"></div>

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

                            {q.explanation && (
                                <div className="mt-4 pl-11">
                                    <ExplanationBox explanation={q.explanation} />
                                </div>
                            )}
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
