'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Home, ArrowRight, ArrowLeft, CheckCircle, XCircle, Flag, Star, RotateCcw, Eye, EyeOff, LayoutGrid } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import QuizSidebar from '@/components/quiz/QuizSidebar';
import QuizLevelComplete from '@/components/quiz/QuizLevelComplete';
import ExplanationBox from '@/components/ExplanationBox';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizProgress, saveQuizProgress, QuizProgress, getAllQuestions, Question } from '@/lib/firebase/services';
import { Timestamp } from 'firebase/firestore';

const QUESTIONS_PER_LEVEL = 20;

function QuizContent() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState<QuizProgress | null>(null);
    const [loading, setLoading] = useState(true);

    // Local state for immediate UI feedback
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);
    const [showScore, setShowScore] = useState(true);
    const [levelComplete, setLevelComplete] = useState(false);

    // Stats
    const [streak, setStreak] = useState(0);

    // Initial Load
    useEffect(() => {
        async function init() {
            if (!user) return;

            try {
                // Load questions
                const allQuestions = await getAllQuestions();
                if (allQuestions.length === 0) {
                    // Fallback to local JSON if firebase empty
                    const res = await fetch('/data/questions.json');
                    const data = await res.json();
                    setQuestions(data);
                } else {
                    setQuestions(allQuestions);
                }

                // Load progress
                const existingProgress = await getQuizProgress(user.uid);
                if (existingProgress) {
                    setProgress(existingProgress);
                    setCurrentIndex(existingProgress.currentQuestionIndex);
                    // Restore answer state if current question was answered
                    const savedAnswer = existingProgress.answers[allQuestions[existingProgress.currentQuestionIndex]?.id];
                    if (savedAnswer !== undefined) {
                        setSelectedAnswer(savedAnswer);
                        setShowAnswer(true);
                    }
                } else {
                    // Initialize new progress
                    const newProgress: QuizProgress = {
                        userId: user.uid,
                        currentQuestionIndex: 0,
                        answers: {},
                        flaggedQuestions: [],
                        importantQuestions: [],
                        stats: {
                            correct: 0,
                            incorrect: 0,
                            totalAnswered: 0
                        },
                        lastUpdated: Timestamp.now()
                    };
                    setProgress(newProgress);
                }
            } catch (error) {
                console.error('Error initializing quiz:', error);
            } finally {
                setLoading(false);
            }
        }

        init();
    }, [user]);

    // Save progress helper
    const updateProgress = async (newProgress: QuizProgress) => {
        setProgress(newProgress);
        if (user) {
            await saveQuizProgress(user.uid, newProgress);
        }
    };

    const handleAnswerSelect = (index: number) => {
        if (showAnswer) return;
        setSelectedAnswer(index);
    };

    const currentQuestion = questions[currentIndex];

    const handleCheckAnswer = async () => {
        if (selectedAnswer === null || !progress || !currentQuestion) return;

        setShowAnswer(true);

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const newStats = { ...progress.stats };

        if (isCorrect) {
            newStats.correct++;
            setStreak(s => s + 1);
        } else {
            newStats.incorrect++;
            setStreak(0);
        }
        newStats.totalAnswered++;

        const newProgress: QuizProgress = {
            ...progress,
            answers: {
                ...progress.answers,
                [currentQuestion.id]: selectedAnswer
            },
            stats: newStats,
            lastUpdated: Timestamp.now()
        };

        await updateProgress(newProgress);
    };

    const handleNext = async () => {
        // Check for level completion
        const nextIndex = currentIndex + 1;
        const currentLevel = Math.floor(currentIndex / QUESTIONS_PER_LEVEL) + 1;
        const nextLevel = Math.floor(nextIndex / QUESTIONS_PER_LEVEL) + 1;

        if (currentLevel !== nextLevel) {
            setLevelComplete(true);
            return;
        }

        if (nextIndex < questions.length) {
            setCurrentIndex(nextIndex);
            setSelectedAnswer(null);
            setShowAnswer(false);

            // Update index in progress
            if (progress) {
                await updateProgress({
                    ...progress,
                    currentQuestionIndex: nextIndex
                });
            }
        }
    };

    const handleContinueLevel = async () => {
        setLevelComplete(false);
        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
            setCurrentIndex(nextIndex);
            setSelectedAnswer(null);
            setShowAnswer(false);

            if (progress) {
                await updateProgress({
                    ...progress,
                    currentQuestionIndex: nextIndex
                });
            }
        }
    };

    const handleRestartLevel = () => {
        // Logic to restart current level (reset answers in this range?)
        // For now, just hide the modal and stay on current question (or go back to start of level)
        // Going back to start of level:
        const levelStart = Math.floor(currentIndex / QUESTIONS_PER_LEVEL) * QUESTIONS_PER_LEVEL;
        setCurrentIndex(levelStart);
        setLevelComplete(false);
        setSelectedAnswer(null);
        setShowAnswer(false);
    };

    const handleToggleImportant = async () => {
        if (!progress || !currentQuestion) return;

        const isImportant = progress.importantQuestions.includes(currentQuestion.id);
        let newImportant = [...progress.importantQuestions];

        if (isImportant) {
            newImportant = newImportant.filter(id => id !== currentQuestion.id);
        } else {
            newImportant.push(currentQuestion.id);
        }

        await updateProgress({
            ...progress,
            importantQuestions: newImportant
        });
    };

    const handleToggleFlag = async () => {
        if (!progress || !currentQuestion) return;

        const isFlagged = progress.flaggedQuestions.includes(currentQuestion.id);
        let newFlagged = [...progress.flaggedQuestions];

        if (isFlagged) {
            newFlagged = newFlagged.filter(id => id !== currentQuestion.id);
        } else {
            newFlagged.push(currentQuestion.id);
        }

        await updateProgress({
            ...progress,
            flaggedQuestions: newFlagged
        });
    };

    if (loading || !progress || !currentQuestion) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    const isImportant = progress.importantQuestions.includes(currentQuestion.id);
    const isFlagged = progress.flaggedQuestions.includes(currentQuestion.id);
    const currentLevel = Math.floor(currentIndex / QUESTIONS_PER_LEVEL) + 1;
    const totalLevels = Math.ceil(questions.length / QUESTIONS_PER_LEVEL);

    // Level Stats
    const levelStartIndex = (currentLevel - 1) * QUESTIONS_PER_LEVEL;
    const levelEndIndex = Math.min(levelStartIndex + QUESTIONS_PER_LEVEL, questions.length);
    const levelQuestions = questions.slice(levelStartIndex, levelEndIndex);
    const levelAnswers = levelQuestions.filter(q => progress.answers[q.id] !== undefined);
    const levelCorrect = levelAnswers.filter(q => progress.answers[q.id] === q.correctAnswer).length;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black flex">
            {/* Sidebar - Desktop */}
            <div className="w-80 border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden lg:block sticky top-0 h-screen overflow-y-auto">
                <div className="p-6 border-b border-slate-200 dark:border-zinc-800">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-black dark:text-white">
                        <LayoutGrid className="w-6 h-6" />
                        <span>ITIL Quiz</span>
                    </Link>
                </div>
                <QuizSidebar
                    currentLevel={currentLevel}
                    totalLevels={totalLevels}
                    totalQuestions={questions.length}
                    answeredCount={progress.stats.totalAnswered}
                    correctCount={progress.stats.correct}
                    flaggedCount={progress.flaggedQuestions.length}
                    importantCount={progress.importantQuestions.length}
                    currentStreak={streak}
                />
            </div>

            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800">
                            <ArrowLeft className="w-5 h-5 text-black dark:text-white" />
                        </Link>
                        <div>
                            <h1 className="text-lg font-bold text-black dark:text-white">Question {currentIndex + 1}</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Level {currentLevel} • {currentQuestion.category}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowScore(!showScore)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-400 transition-colors"
                            title={showScore ? "Hide Score" : "Show Score"}
                        >
                            {showScore ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                        <UserProfile />
                    </div>
                </header>

                {/* content */}
                <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto w-full flex flex-col justify-center">
                    {levelComplete ? (
                        <QuizLevelComplete
                            level={currentLevel}
                            score={levelCorrect}
                            total={levelQuestions.length}
                            onContinue={handleContinueLevel}
                            onRestartLevel={handleRestartLevel}
                        />
                    ) : (
                        <div className="animating-enter">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-200 dark:border-zinc-800 overflow-hidden mb-6">
                                {/* Question Header */}
                                <div className="p-8 border-b border-slate-200 dark:border-zinc-800">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wide">
                                            {currentQuestion.category}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleToggleFlag}
                                                className={`p-2 rounded-lg transition-colors ${isFlagged
                                                    ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-500'
                                                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400'}`}
                                            >
                                                <Flag className="w-5 h-5" fill={isFlagged ? "currentColor" : "none"} />
                                            </button>
                                            <button
                                                onClick={handleToggleImportant}
                                                className={`p-2 rounded-lg transition-colors ${isImportant
                                                    ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-500'
                                                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-400'}`}
                                            >
                                                <Star className="w-5 h-5" fill={isImportant ? "currentColor" : "none"} />
                                            </button>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-white leading-relaxed">
                                        {currentQuestion.question}
                                    </h2>
                                </div>

                                {/* Options */}
                                <div className="p-8 space-y-3 bg-slate-50/50 dark:bg-black/20">
                                    {currentQuestion.options.map((option, index) => {
                                        const isSelected = selectedAnswer === index;
                                        const isCorrectOption = index === currentQuestion.correctAnswer;

                                        let className = "w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 group ";

                                        if (showAnswer) {
                                            if (isCorrectOption) {
                                                className += "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-500/50";
                                            } else if (isSelected) {
                                                className += "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500/50";
                                            } else {
                                                className += "border-slate-200 dark:border-zinc-700 opacity-50";
                                            }
                                        } else {
                                            if (isSelected) {
                                                className += "border-black dark:border-white bg-white dark:bg-zinc-800 shadow-md transform scale-[1.01]";
                                            } else {
                                                className += "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800";
                                            }
                                        }

                                        return (
                                            <button
                                                key={index}
                                                onClick={() => handleAnswerSelect(index)}
                                                disabled={showAnswer}
                                                className={className}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0 transition-colors ${showAnswer && isCorrectOption ? 'bg-green-500 text-white' :
                                                        showAnswer && isSelected ? 'bg-red-500 text-white' :
                                                            isSelected ? 'bg-black dark:bg-white text-white dark:text-black' :
                                                                'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700'
                                                    }`}>
                                                    {String.fromCharCode(65 + index)}
                                                </div>
                                                <span className={`font-medium ${showAnswer && isCorrectOption ? 'text-green-700 dark:text-green-400' :
                                                        showAnswer && isSelected ? 'text-red-700 dark:text-red-400' :
                                                            'text-slate-700 dark:text-slate-200'
                                                    }`}>
                                                    {option}
                                                </span>

                                                {showAnswer && isCorrectOption && <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />}
                                                {showAnswer && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-500 ml-auto" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Explanation */}
                                {showAnswer && currentQuestion.explanation && (
                                    <div className="px-8 pb-8 bg-slate-50/50 dark:bg-black/20 animate-in fade-in slide-in-from-top-4">
                                        <ExplanationBox explanation={currentQuestion.explanation} />
                                    </div>
                                )}
                            </div>

                            {/* Action Bar */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                    disabled={currentIndex === 0}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-500 hover:text-black dark:text-slate-400 dark:hover:text-white disabled:opacity-30 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                {!showAnswer ? (
                                    <button
                                        onClick={handleCheckAnswer}
                                        disabled={selectedAnswer === null}
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Check Answer
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transform hover:-translate-y-0.5"
                                    >
                                        {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default function QuizPage() {
    return (
        <ProtectedRoute>
            <QuizContent />
        </ProtectedRoute>
    );
}
