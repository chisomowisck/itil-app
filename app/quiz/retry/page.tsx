'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Flag, Star, Home, RotateCcw } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import ExplanationBox from '@/components/ExplanationBox';
import { useAuth } from '@/contexts/AuthContext';
import { getAllQuestions, Question, saveExamScore } from '@/lib/firebase/services';

interface RetrySession {
    type: 'failed' | 'flagged' | 'important';
    questionIds: number[];
    startTime: number;
}

function RetryQuizContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const retryType = searchParams.get('type') as 'failed' | 'flagged' | 'important' | null;

    const [session, setSession] = useState<RetrySession | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
    const [checkedAnswers, setCheckedAnswers] = useState<boolean[]>([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [stats, setStats] = useState({ correct: 0, incorrect: 0 });
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRetrySession() {
            if (!user || !retryType) {
                router.push('/quiz/review');
                return;
            }

            try {
                // Load session from localStorage
                const sessionData = localStorage.getItem('retrySession');
                if (!sessionData) {
                    router.push('/quiz/review');
                    return;
                }

                const parsedSession: RetrySession = JSON.parse(sessionData);
                if (parsedSession.type !== retryType) {
                    router.push('/quiz/review');
                    return;
                }

                setSession(parsedSession);

                // Load all questions
                const allQuestions = await getAllQuestions();
                if (allQuestions.length === 0) {
                    const res = await fetch('/data/questions.json');
                    const data = await res.json();
                    setQuestions(data.filter((q: Question) => parsedSession.questionIds.includes(q.id)));
                } else {
                    setQuestions(allQuestions.filter(q => parsedSession.questionIds.includes(q.id)));
                }

                setSelectedAnswers(new Array(parsedSession.questionIds.length).fill(null));
                setCheckedAnswers(new Array(parsedSession.questionIds.length).fill(false));
            } catch (error) {
                console.error('Error loading retry session:', error);
                router.push('/quiz/review');
            } finally {
                setLoading(false);
            }
        }

        loadRetrySession();
    }, [user, retryType, router]);

    // Sync showAnswer state when navigating between questions
    useEffect(() => {
        if (questions.length > 0 && currentIndex < checkedAnswers.length) {
            setShowAnswer(checkedAnswers[currentIndex]);
        }
    }, [currentIndex, checkedAnswers, questions.length]);

    const handleAnswerSelect = (answerIndex: number) => {
        if (showResults || checkedAnswers[currentIndex]) return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentIndex] = answerIndex;
        setSelectedAnswers(newAnswers);
        setShowAnswer(false);
    };

    const handleCheckAnswer = () => {
        if (selectedAnswers[currentIndex] === null || checkedAnswers[currentIndex]) return;
        
        const isCorrect = selectedAnswers[currentIndex] === questions[currentIndex].correctAnswer;
        setShowAnswer(true);
        
        const newChecked = [...checkedAnswers];
        newChecked[currentIndex] = true;
        setCheckedAnswers(newChecked);

        if (isCorrect) {
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (!user || !session) return;

        const timeSpent = Math.floor((Date.now() - session.startTime) / 1000);
        const results = questions.map((q, idx) => ({
            questionId: q.id,
            question: q.question,
            category: q.category,
            selectedAnswer: selectedAnswers[idx],
            correctAnswer: q.correctAnswer,
            isCorrect: selectedAnswers[idx] === q.correctAnswer,
            isFlagged: false,
            isImportant: false,
            options: q.options,
            explanation: q.explanation
        }));

        const correct = results.filter(r => r.isCorrect).length;
        const percentage = Math.round((correct / questions.length) * 100);

        const examScore = {
            userId: user.uid,
            date: new Date().toISOString(),
            score: correct,
            percentage,
            correct,
            total: questions.length,
            passed: percentage >= 65,
            timeSpent,
            flaggedCount: 0,
            importantCount: 0,
            questionResults: results,
            retryType: session.type // Add retry type to track it
        };

        try {
            await saveExamScore(examScore as any);
            setShowResults(true);
            localStorage.removeItem('retrySession');
        } catch (error) {
            console.error('Error saving retry score:', error);
            setShowResults(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    if (!session || questions.length === 0) {
        return null;
    }

    const currentQuestion = questions[currentIndex];
    const answeredCount = selectedAnswers.filter(a => a !== null).length;
    const progress = ((currentIndex + 1) / questions.length) * 100;

    // Get retry type info
    const retryInfo = {
        failed: { 
            title: 'Retry Failed Questions', 
            icon: XCircle, 
            color: 'red', 
            bgColor: 'bg-red-500',
            borderColor: 'border-red-500',
            bgLight: 'bg-red-50',
            bgDark: 'dark:bg-red-900/20',
            textColor: 'text-red-600',
            hoverBg: 'hover:bg-red-600'
        },
        flagged: { 
            title: 'Retry Flagged Questions', 
            icon: Flag, 
            color: 'orange', 
            bgColor: 'bg-orange-500',
            borderColor: 'border-orange-500',
            bgLight: 'bg-orange-50',
            bgDark: 'dark:bg-orange-900/20',
            textColor: 'text-orange-600',
            hoverBg: 'hover:bg-orange-600'
        },
        important: { 
            title: 'Retry Important Questions', 
            icon: Star, 
            color: 'yellow', 
            bgColor: 'bg-yellow-500',
            borderColor: 'border-yellow-500',
            bgLight: 'bg-yellow-50',
            bgDark: 'dark:bg-yellow-900/20',
            textColor: 'text-yellow-600',
            hoverBg: 'hover:bg-yellow-600'
        }
    }[session.type];

    const Icon = retryInfo.icon;

    if (showResults) {
        const correct = selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
        const percentage = Math.round((correct / questions.length) * 100);
        const passed = percentage >= 65;

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black">
                <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Icon className={`w-6 h-6 ${retryInfo.textColor}`} />
                            <h1 className="text-xl font-bold text-black dark:text-white">{retryInfo.title}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <UserProfile />
                            <Link href="/" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
                                <Home className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-12">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8 text-center">
                        <div className={`w-20 h-20 ${retryInfo.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                            {passed ? (
                                <CheckCircle className="w-10 h-10 text-white" />
                            ) : (
                                <RotateCcw className="w-10 h-10 text-white" />
                            )}
                        </div>
                        <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
                            {passed ? 'Great Progress!' : 'Keep Practicing!'}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            You scored {correct} out of {questions.length} ({percentage}%)
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <p className="text-sm text-green-600 dark:text-green-400 mb-1">Correct</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{correct}</p>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                <p className="text-sm text-red-600 dark:text-red-400 mb-1">Incorrect</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{questions.length - correct}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/quiz/review"
                                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                            >
                                Back to Review
                            </Link>
                            <button
                                onClick={() => {
                                    setShowResults(false);
                                    setCurrentIndex(0);
                                    setSelectedAnswers(new Array(questions.length).fill(null));
                                    setCheckedAnswers(new Array(questions.length).fill(false));
                                    setShowAnswer(false);
                                    setStats({ correct: 0, incorrect: 0 });
                                    setSession({ ...session, startTime: Date.now() });
                                }}
                                className={`px-6 py-3 ${retryInfo.bgColor} text-white rounded-lg font-semibold ${retryInfo.hoverBg} transition-colors flex items-center justify-center gap-2`}
                            >
                                <RotateCcw className="w-5 h-5" />
                                Try Again
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/quiz/review" className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <Icon className={`w-6 h-6 ${retryInfo.textColor}`} />
                        <h1 className="text-xl font-bold text-black dark:text-white">{retryInfo.title}</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-xs text-slate-600 dark:text-slate-400">Correct</div>
                                <div className="text-lg font-bold text-green-600 dark:text-green-500">{stats.correct}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs text-slate-600 dark:text-slate-400">Incorrect</div>
                                <div className="text-lg font-bold text-red-600 dark:text-red-500">{stats.incorrect}</div>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            {answeredCount}/{questions.length} Answered
                        </span>
                        <UserProfile />
                        <Link href="/" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
                            <Home className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <div className="h-2 bg-slate-200 dark:bg-zinc-800">
                    <div
                        className={`h-full ${retryInfo.bgColor} transition-all duration-300`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Question Card */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-8 mb-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    {currentQuestion.category}
                                </span>
                                <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                                    Question {currentIndex + 1} of {questions.length}
                                </h2>
                            </div>
                        </div>

                        <h3 className="text-lg font-normal text-black dark:text-white mb-8 leading-relaxed">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option, idx) => {
                                const isSelected = selectedAnswers[currentIndex] === idx;
                                const isCorrectOption = idx === currentQuestion.correctAnswer;

                                let className = 'w-full text-left p-4 rounded-lg border-2 transition-all ';
                                
                                if (showAnswer) {
                                    if (isCorrectOption) {
                                        className += 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30';
                                    } else if (isSelected) {
                                        className += 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-900/30';
                                    } else {
                                        className += 'border-slate-200 dark:border-zinc-700 opacity-50 text-slate-500 dark:text-slate-400';
                                    }
                                } else {
                                    className += isSelected
                                        ? `${retryInfo.borderColor} ${retryInfo.bgLight} ${retryInfo.bgDark}`
                                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700';
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(idx)}
                                        disabled={showAnswer}
                                        className={className}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div
                                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                                    showAnswer
                                                        ? isCorrectOption
                                                            ? 'border-green-600 dark:border-green-500'
                                                            : isSelected
                                                                ? 'border-red-500 dark:border-red-500'
                                                                : 'border-slate-300 dark:border-zinc-700'
                                                        : isSelected
                                                            ? retryInfo.borderColor
                                                            : 'border-slate-300 dark:border-zinc-700'
                                                }`}
                                            >
                                                {showAnswer && isCorrectOption && (
                                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-500" />
                                                )}
                                                {showAnswer && isSelected && !isCorrectOption && (
                                                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
                                                )}
                                                {!showAnswer && isSelected && (
                                                    <div className={`w-3 h-3 rounded-full ${retryInfo.bgColor}`}></div>
                                                )}
                                            </div>
                                            <span className={`text-sm leading-relaxed ${
                                                showAnswer
                                                    ? isCorrectOption
                                                        ? 'text-green-900 dark:text-green-300'
                                                        : isSelected
                                                            ? 'text-red-900 dark:text-red-300'
                                                            : 'text-slate-500 dark:text-slate-400'
                                                    : 'text-slate-900 dark:text-white'
                                            }`}>
                                                {option}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {showAnswer && (
                            <div className="space-y-4 mt-6">
                                <div className={`p-4 rounded-xl ${selectedAnswers[currentIndex] === currentQuestion.correctAnswer ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {selectedAnswers[currentIndex] === currentQuestion.correctAnswer ? (
                                            <>
                                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-500" />
                                                <span className="font-semibold text-green-800 dark:text-green-400">Correct!</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-500" />
                                                <span className="font-semibold text-red-800 dark:text-red-400">Incorrect</span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300">
                                        The correct answer is: <strong className="text-black dark:text-white">{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
                                    </p>
                                </div>

                                {currentQuestion.explanation && (
                                    <ExplanationBox explanation={currentQuestion.explanation} />
                                )}
                            </div>
                        )}

                        {!showAnswer && selectedAnswers[currentIndex] !== null && (
                            <button
                                onClick={handleCheckAnswer}
                                className="w-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 hover:shadow-md transition-all mt-6"
                            >
                                Check Answer
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className="px-6 py-3 rounded-lg border border-slate-200 dark:border-zinc-800 font-semibold hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>

                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            {currentIndex + 1} / {questions.length}
                        </span>

                        {currentIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedAnswers.filter(a => a !== null).length < questions.length}
                                className={`px-6 py-3 ${retryInfo.bgColor} text-white rounded-lg font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function RetryQuizPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white"></div>
                </div>
            }>
                <RetryQuizContent />
            </Suspense>
        </ProtectedRoute>
    );
}

