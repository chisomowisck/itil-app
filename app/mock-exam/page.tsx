'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Home, CheckCircle, XCircle, AlertCircle, Flag, Shuffle, Filter, List, Eye, EyeOff, ChevronLeft, ChevronRight, SkipForward, BookOpen, FileText, ClipboardList, Star, TrendingUp, Award, ChevronDown, ChevronUp } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import { useAuth } from '@/contexts/AuthContext';
import { saveExamScore } from '@/lib/firebase/services';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

interface QuestionResult {
  questionId: number;
  question: string;
  category: string;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
  isFlagged: boolean;
  isImportant: boolean;
  options: string[];
  explanation?: string;
}

interface ExamScore {
  id: string;
  userId?: string;
  date: string;
  score: number;
  percentage: number;
  correct: number;
  total: number;
  passed: boolean;
  timeSpent: number;
  flaggedCount: number;
  importantCount: number;
  questionResults: QuestionResult[];
}

type FilterType = 'all' | 'flagged' | 'answered' | 'unanswered' | 'important';

function MockExamContent() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [importantQuestions, setImportantQuestions] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');

  const [showScore, setShowScore] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'tips' | 'rules' | 'review'>('tips');
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [seed, setSeed] = useState(42);

  useEffect(() => {
    // Load questions from Firebase first, fallback to local JSON
    const loadQuestions = async () => {
      try {
        // Try loading from Firebase
        const response = await fetch('/api/questions');
        const result = await response.json();

        let allQuestions: Question[] = [];

        if (result.success && result.data && result.data.length > 0) {
          // Successfully loaded from Firebase
          allQuestions = result.data;
        } else {
          // Fallback to local JSON
          const localResponse = await fetch('/data/questions.json');
          allQuestions = await localResponse.json();
        }

        // Randomly select 40 questions for the mock exam
        const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
        const examQuestions = shuffled.slice(0, 40);
        setQuestions(examQuestions);
        setSelectedAnswers(new Array(40).fill(null));
      } catch (error) {
        console.error('Error loading questions:', error);
        // Final fallback to local JSON
        try {
          const localResponse = await fetch('/data/questions.json');
          const allQuestions = await localResponse.json();
          const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
          const examQuestions = shuffled.slice(0, 40);
          setQuestions(examQuestions);
          setSelectedAnswers(new Array(40).fill(null));
        } catch (localError) {
          console.error('Error loading local questions:', localError);
        }
      }
    };

    loadQuestions();
  }, []);

  useEffect(() => {
    if (!examStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, showResults]);

  // Set start time when exam starts
  useEffect(() => {
    if (examStarted && startTime === 0) {
      setStartTime(Date.now());
    }
  }, [examStarted, startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const saveScore = async () => {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    // Create detailed question results
    const questionResults: QuestionResult[] = questions.map((q, index) => ({
      questionId: q.id,
      question: q.question,
      category: q.category,
      selectedAnswer: selectedAnswers[index],
      correctAnswer: q.correctAnswer,
      isCorrect: selectedAnswers[index] === q.correctAnswer,
      isFlagged: flaggedQuestions.has(index),
      isImportant: importantQuestions.has(index),
      options: q.options,
      explanation: q.explanation,
    }));

    const examScore = {
      userId: user?.uid,
      date: new Date().toISOString(),
      score,
      percentage,
      correct: score,
      total: questions.length,
      passed: percentage >= 65,
      timeSpent,
      flaggedCount: flaggedQuestions.size,
      importantCount: importantQuestions.size,
      questionResults,
    };

    setSaving(true);

    try {
      // Save directly to Firebase using client SDK
      // This ensures the authenticated user context is passed to Firestore rules
      await saveExamScore(examScore);
      console.log('Exam score saved successfully');
    } catch (error) {
      console.error('Error saving score:', error);
      // Fallback to localStorage if Firebase fails
      try {
        const existingScores = localStorage.getItem('examScores');
        const scores: ExamScore[] = existingScores ? JSON.parse(existingScores) : [];
        scores.unshift({ ...examScore, id: Date.now().toString() });
        localStorage.setItem('examScores', JSON.stringify(scores));
      } catch (localError) {
        console.error('Error saving to localStorage:', localError);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = () => {
    saveScore();
    setShowResults(true);
  };

  const toggleFlag = (index: number) => {
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(index)) {
      newFlagged.delete(index);
    } else {
      newFlagged.add(index);
    }
    setFlaggedQuestions(newFlagged);
  };

  const toggleImportant = (index: number) => {
    const newImportant = new Set(importantQuestions);
    if (newImportant.has(index)) {
      newImportant.delete(index);
    } else {
      newImportant.add(index);
    }
    setImportantQuestions(newImportant);
  };

  const handleRandomize = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setFlaggedQuestions(new Set());
  };

  const getFilteredQuestions = () => {
    return questions.map((_, index) => index).filter(index => {
      switch (filterType) {
        case 'flagged':
          return flaggedQuestions.has(index);
        case 'important':
          return importantQuestions.has(index);
        case 'answered':
          return selectedAnswers[index] !== null;
        case 'unanswered':
          return selectedAnswers[index] === null;
        default:
          return true;
      }
    });
  };

  const goToFirstUnanswered = () => {
    const firstUnanswered = questions.findIndex((_, index) => selectedAnswers[index] === null);
    if (firstUnanswered !== -1) {
      setCurrentQuestionIndex(firstUnanswered);
    }
  };

  const goToFirstFlagged = () => {
    const flaggedArray = Array.from(flaggedQuestions).sort((a, b) => a - b);
    if (flaggedArray.length > 0) {
      setCurrentQuestionIndex(flaggedArray[0]);
    }
  };

  const getUnansweredQuestions = () => {
    return questions.map((_, index) => index).filter(index => selectedAnswers[index] === null);
  };

  const getFlaggedQuestions = () => {
    return Array.from(flaggedQuestions).sort((a, b) => a - b);
  };

  const getImportantQuestions = () => {
    return Array.from(importantQuestions).sort((a, b) => a - b);
  };

  const getCurrentScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] !== null && selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / questions.length) * 100);
  };

  const isPassed = () => {
    return getScorePercentage() >= 65; // ITIL 4 Foundation passing score is 65%
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-2xl text-black">Loading exam...</div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-6">
            <UserProfile />
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-black">
                Mock Exam
              </h1>
              <p className="text-slate-600">
                ITIL 4 Foundation Practice Test
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-black">Exam Information</h2>
              <div className="space-y-4 text-slate-700">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shrink-0 font-bold">
                    40
                  </div>
                  <div>
                    <div className="font-semibold text-black mb-1">Questions</div>
                    <div className="text-sm text-slate-600">Randomly selected from 487 total questions</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-black mb-1">60 Minutes</div>
                    <div className="text-sm text-slate-600">Time limit for completion</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center shrink-0 font-bold">
                    65%
                  </div>
                  <div>
                    <div className="font-semibold text-black mb-1">Passing Score</div>
                    <div className="text-sm text-slate-600">26 out of 40 questions correct</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-black mb-1">Detailed Results</div>
                    <div className="text-sm text-slate-600">Review all questions with correct answers at the end</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setExamStarted(true)}
                className="flex-1 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg"
              >
                Start Exam
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-300 rounded-lg font-semibold hover:bg-white hover:border-black transition-colors text-black"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const passed = isPassed();

    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="flex justify-end mb-6 max-w-7xl mx-auto">
          <UserProfile />
        </div>
        <div className="container mx-auto max-w-5xl py-12">
          {/* Results Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-6 text-black">Exam Results</h1>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-10">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Score</div>
                  <div className={`text-5xl font-bold ${passed ? 'text-green-600' : 'text-red-500'}`}>
                    {percentage}%
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Correct</div>
                  <div className="text-5xl font-bold text-black">
                    {score}
                  </div>
                </div>
                <div className="text-center p-6 bg-slate-50 rounded-xl">
                  <div className="text-xs text-slate-600 uppercase tracking-wider mb-2">Total</div>
                  <div className="text-5xl font-bold text-black">
                    {questions.length}
                  </div>
                </div>
              </div>

              <div className={`text-center p-6 rounded-xl ${passed ? 'bg-green-50' : 'bg-red-50'}`}>
                {passed ? (
                  <div className="text-2xl font-bold text-green-600">
                    ✓ PASSED — Congratulations!
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-red-500">
                    ✗ NOT PASSED — Keep Studying (Need 65%)
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                href="/mock-exam"
                className="flex-1 bg-black text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-slate-800 transition-colors shadow-lg"
              >
                Retake Exam
              </Link>
              <Link
                href="/practice"
                className="flex-1 border-2 border-slate-300 px-8 py-4 rounded-lg font-bold text-center hover:bg-white hover:border-black transition-colors text-black"
              >
                Practice Mode
              </Link>
              <Link
                href="/"
                className="flex-1 border-2 border-slate-300 px-8 py-4 rounded-lg font-bold text-center hover:bg-white hover:border-black transition-colors text-black"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Review Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-black">Review Answers</h2>
            <div className="space-y-4">
              {questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                const optionLetter = userAnswer !== null ? String.fromCharCode(65 + userAnswer) : '—';
                const correctLetter = String.fromCharCode(65 + q.correctAnswer);

                return (
                  <div key={q.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shrink-0 ${isCorrect
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-500'
                        }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="inline-block px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                          {q.category}
                        </div>
                        <div className="text-base font-semibold mb-4 text-black">{q.question}</div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="text-xs text-slate-600 mb-1">Your Answer</div>
                            <div className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                              {optionLetter}
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="text-xs text-slate-600 mb-1">Correct Answer</div>
                            <div className="text-lg font-bold text-green-600">
                              {correctLetter}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = q.correctAnswer === optIndex;
                            const letter = String.fromCharCode(65 + optIndex);

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${isCorrectAnswer
                                  ? 'border-green-200 bg-green-50'
                                  : isUserAnswer
                                    ? 'border-red-200 bg-red-50'
                                    : 'border-slate-200 bg-white'
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${isCorrectAnswer
                                    ? 'bg-green-600 text-white'
                                    : isUserAnswer
                                      ? 'bg-red-500 text-white'
                                      : 'bg-slate-100 text-slate-400'
                                    }`}>
                                    {letter}
                                  </div>
                                  <span className="text-black text-sm flex-1">{option}</span>
                                  {isCorrectAnswer && <span className="text-xs font-semibold text-green-600">✓ CORRECT</span>}
                                  {isUserAnswer && !isCorrectAnswer && <span className="text-xs font-semibold text-red-500">✗ WRONG</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = selectedAnswers.filter(a => a !== null).length;
  const filteredIndices = getFilteredQuestions();
  const unansweredQuestions = getUnansweredQuestions();
  const flaggedQuestionsArray = getFlaggedQuestions();
  const importantQuestionsArray = getImportantQuestions();
  const currentScore = getCurrentScore();
  const currentPercentage = answeredCount > 0 ? Math.round((currentScore / answeredCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header - Minimal */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700" />
              <h1 className="text-sm font-bold text-black">ITIL 4 Foundation – Mock Exam</h1>
            </div>
            <div className="flex items-center gap-2">
              <UserProfile />
              <Link
                href="/"
                className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                title="Go to home"
              >
                <Home className="w-5 h-5 text-slate-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">Time left:</span>
                <span className={`text-lg font-bold font-mono ${timeLeft < 300 ? 'text-red-600' : 'text-black'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={randomizeQuestions}
                    onChange={(e) => setRandomizeQuestions(e.target.checked)}
                    className="rounded"
                  />
                  Randomize
                </label>
                <input
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border border-slate-300 rounded"
                  placeholder="Seed"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowScore(!showScore)}
                className="px-3 py-1.5 text-sm font-semibold rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {showScore ? <EyeOff className="w-4 h-4 inline mr-1" /> : <Eye className="w-4 h-4 inline mr-1" />}
                {showScore ? 'Hide' : 'Show'} Score
              </button>
              {showScore && (
                <div className="px-3 py-1.5 bg-slate-100 rounded-lg">
                  <span className="text-sm font-semibold">
                    Score: <span className={currentPercentage >= 65 ? 'text-green-600' : 'text-orange-600'}>
                      {currentScore}/{answeredCount} ({currentPercentage}%)
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-200 h-1">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden max-w-[1400px] mx-auto w-full">

        {/* Left Sidebar - Navigator */}
        <div className="w-80 bg-white border-r border-slate-200 flex-col shrink-0 overflow-y-auto hidden lg:flex">
          <div className="p-6">
            {/* Question Navigator Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <List className="w-5 h-5 text-slate-700" />
              <h3 className="text-base font-bold text-black">Question Navigator</h3>
            </div>

            {/* Stats */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Pass mark:</span>
                <span className="font-semibold text-black">65%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Answered:</span>
                <span className="font-semibold text-green-600">{answeredCount}/{questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Flagged:</span>
                <span className="font-semibold text-orange-600">{flaggedQuestions.size}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Important:</span>
                <span className="font-semibold text-yellow-600">{importantQuestions.size}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <div className="text-xs text-slate-500 mb-1">Progress</div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-8 gap-1.5 mb-6">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[idx] !== null;
                const isFlagged = flaggedQuestions.has(idx);
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`relative h-9 rounded font-semibold text-xs transition-all flex items-center justify-center ${isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : isAnswered
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-white border border-slate-300 text-slate-500 hover:border-slate-400'
                      }`}
                    title={`Question ${idx + 1}${isFlagged ? ' (Flagged)' : ''}`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <Flag className="absolute -top-1 -right-1 w-3 h-3 text-orange-500 fill-orange-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Review Section */}
            <div className="border-t border-slate-200 pt-4">
              <button
                onClick={goToFirstUnanswered}
                disabled={unansweredQuestions.length === 0}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-2"
              >
                Go to first unanswered ({unansweredQuestions.length})
              </button>
              <button
                onClick={goToFirstFlagged}
                disabled={flaggedQuestionsArray.length === 0}
                className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go to first flagged ({flaggedQuestions.size})
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - Question Area */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-8">
              {/* Category Badge and Question Number */}
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold mb-3 uppercase tracking-wide">
                  {currentQuestion.category}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-600">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleFlag(currentQuestionIndex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${flaggedQuestions.has(currentQuestionIndex)
                        ? 'bg-orange-50 text-orange-600 border border-orange-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      Flag
                    </button>
                    <button
                      onClick={() => toggleImportant(currentQuestionIndex)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors ${importantQuestions.has(currentQuestionIndex)
                        ? 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <Star className="w-3.5 h-3.5" />
                      Important
                    </button>
                  </div>
                </div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 mb-6">
                {/* Question */}
                <h2 className="text-base font-normal mb-8 text-slate-900 leading-relaxed">
                  {currentQuestion.question}
                </h2>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === index;

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${isSelected
                            ? 'border-blue-500'
                            : 'border-slate-300'
                            }`}>
                            {isSelected && (
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                          <span className="text-sm text-slate-900 leading-relaxed">{option}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between px-8 py-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="px-5 py-2.5 rounded-lg font-semibold text-sm text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                <div className="text-sm text-slate-600 font-medium">
                  {currentQuestionIndex + 1} / {questions.length}
                </div>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm text-white bg-black hover:bg-slate-800 transition-all"
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-lg font-bold text-sm text-white bg-black hover:bg-slate-800 transition-all"
                  >
                    Next
                  </button>
                )}
              </div>

              {/* Tabs Section */}
              <div className="border-t border-slate-200 bg-white">
                <div className="px-8 py-6">
                  <div className="flex gap-6 border-b border-slate-200 mb-6">
                    <button
                      onClick={() => setActiveTab('tips')}
                      className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'tips'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Exam tips
                    </button>
                    <button
                      onClick={() => setActiveTab('rules')}
                      className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'rules'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Rules
                    </button>
                    <button
                      onClick={() => setActiveTab('review')}
                      className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'review'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Review list
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === 'tips' && (
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold text-black mb-1.5">Utility vs Warranty:</h4>
                        <p className="text-slate-600">Utility = what it does (fit for purpose). Warranty = how well it performs (fit for use).</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1.5">Incident vs Problem:</h4>
                        <p className="text-slate-600">Incident restores service quickly. Problem finds root cause and prevents recurrence. Known error = analyzed problem.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1.5">Value stream vs Value chain:</h4>
                        <p className="text-slate-600">Value chain = activities. Value stream = specific path through those activities.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-black mb-1.5">Use Flag for uncertain questions.</h4>
                        <p className="text-slate-600">Answer everything before submitting.</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'rules' && (
                    <div className="space-y-3 text-sm text-slate-600">
                      <p>• 40 questions total</p>
                      <p>• 60 minutes time limit</p>
                      <p>• Single best answer for each question</p>
                      <p>• 65% passing score (26 out of 40 correct)</p>
                      <p>• Explanations shown after submission</p>
                      <p>• You can flag questions for review</p>
                      <p>• Navigate freely between questions</p>
                    </div>
                  )}

                  {activeTab === 'review' && (
                    <div className="space-y-2 text-sm">
                      {flaggedQuestionsArray.length > 0 ? (
                        <div>
                          <h4 className="font-semibold text-black mb-3">Flagged Questions ({flaggedQuestionsArray.length})</h4>
                          <div className="flex flex-wrap gap-2">
                            {flaggedQuestionsArray.map((idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded font-semibold hover:bg-orange-100 transition-colors"
                              >
                                Q{idx + 1}
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-500 italic">No flagged questions yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>



          </div>
        </div>


      </div>


    </div>
  );
}

export default function MockExam() {
  return (
    <ProtectedRoute>
      <MockExamContent />
    </ProtectedRoute>
  );
}
