'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Home, CheckCircle, XCircle, AlertCircle, Flag, Shuffle, Filter, List, Eye, EyeOff, ChevronLeft, ChevronRight, SkipForward, BookOpen, FileText, ClipboardList } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

type FilterType = 'all' | 'flagged' | 'answered' | 'unanswered';
type TabType = 'tips' | 'rules' | 'review';

export default function MockExam() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('tips');

  useEffect(() => {
    // Load questions
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => {
        // Randomly select 40 questions for the mock exam
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        const examQuestions = shuffled.slice(0, 40);
        setQuestions(examQuestions);
        setSelectedAnswers(new Array(40).fill(null));
      });
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

  const handleSubmit = () => {
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-2xl text-black">Loading exam...</div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-4 text-black">
              Mock Exam
            </h1>
            <p className="text-lg text-slate-600">
              ITIL 4 Foundation Practice Test
            </p>
          </div>

          <div className="bg-white border-2 border-black p-10 mb-8">
            <h2 className="text-2xl font-bold mb-8 text-black">Exam Information</h2>
            <div className="space-y-6 text-slate-700">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0 mt-1">
                  <span className="text-sm font-bold">40</span>
                </div>
                <div>
                  <div className="font-semibold text-black mb-1">Questions</div>
                  <div className="text-sm">Randomly selected from 487 total questions</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 shrink-0 mt-1 text-black" />
                <div>
                  <div className="font-semibold text-black mb-1">60 Minutes</div>
                  <div className="text-sm">Time limit for completion</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 border-2 border-black flex items-center justify-center shrink-0 mt-1">
                  <span className="text-sm font-bold">65%</span>
                </div>
                <div>
                  <div className="font-semibold text-black mb-1">Passing Score</div>
                  <div className="text-sm">26 out of 40 questions correct</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 shrink-0 mt-1 text-black" />
                <div>
                  <div className="font-semibold text-black mb-1">Detailed Results</div>
                  <div className="text-sm">Review all questions with correct answers at the end</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setExamStarted(true)}
              className="flex-1 bg-black text-white px-8 py-5 font-bold text-lg hover:bg-slate-800 transition-colors"
            >
              Start Exam
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-8 py-5 border-2 border-black font-semibold hover:bg-slate-50 transition-colors text-black"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
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
      <div className="min-h-screen bg-white p-6">
        <div className="container mx-auto max-w-5xl py-12">
          {/* Results Header */}
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-8 text-black">Exam Results</h1>

            <div className="bg-white border-2 border-black p-12">
              <div className="grid grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-sm text-slate-600 uppercase tracking-wider mb-2">Score</div>
                  <div className={`text-6xl font-bold ${passed ? 'text-black' : 'text-slate-400'}`}>
                    {percentage}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 uppercase tracking-wider mb-2">Correct</div>
                  <div className="text-6xl font-bold text-black">
                    {score}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600 uppercase tracking-wider mb-2">Total</div>
                  <div className="text-6xl font-bold text-black">
                    {questions.length}
                  </div>
                </div>
              </div>

              <div className="text-center pt-8 border-t-2 border-black">
                {passed ? (
                  <div className="text-2xl font-bold text-black">
                    ✓ PASSED — Congratulations!
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-slate-400">
                    ✗ NOT PASSED — Keep Studying (Need 65%)
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                href="/mock-exam"
                className="flex-1 bg-black text-white px-8 py-4 font-bold text-center hover:bg-slate-800 transition-colors"
              >
                Retake Exam
              </Link>
              <Link
                href="/practice"
                className="flex-1 border-2 border-black px-8 py-4 font-bold text-center hover:bg-slate-100 transition-colors text-black"
              >
                Practice Mode
              </Link>
              <Link
                href="/"
                className="flex-1 border-2 border-black px-8 py-4 font-bold text-center hover:bg-slate-100 transition-colors text-black"
              >
                Home
              </Link>
            </div>
          </div>

          {/* Review Section */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-black">Review Answers</h2>
            <div className="space-y-6">
              {questions.map((q, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                const optionLetter = userAnswer !== null ? String.fromCharCode(65 + userAnswer) : '—';
                const correctLetter = String.fromCharCode(65 + q.correctAnswer);

                return (
                  <div key={q.id} className="bg-white border-2 border-black p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className={`w-14 h-14 border-2 flex items-center justify-center font-bold text-xl ${
                        isCorrect
                          ? 'border-black bg-black text-white'
                          : 'border-slate-300 text-slate-400'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-slate-600 uppercase tracking-wider mb-3">
                          {q.category}
                        </div>
                        <div className="text-lg font-semibold mb-6 text-black">{q.question}</div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                            <div className="text-xs text-slate-600 mb-1">Your Answer</div>
                            <div className={`text-xl font-bold ${isCorrect ? 'text-black' : 'text-slate-400'}`}>
                              {optionLetter}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-600 mb-1">Correct Answer</div>
                            <div className="text-xl font-bold text-black">
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
                                className={`p-3 border-2 ${
                                  isCorrectAnswer
                                    ? 'border-black bg-slate-50'
                                    : isUserAnswer
                                    ? 'border-slate-300 bg-slate-50'
                                    : 'border-slate-200'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-7 h-7 border-2 flex items-center justify-center font-bold text-xs ${
                                    isCorrectAnswer
                                      ? 'border-black bg-black text-white'
                                      : 'border-slate-300 text-slate-400'
                                  }`}>
                                    {letter}
                                  </div>
                                  <span className="text-black text-sm">{option}</span>
                                  {isCorrectAnswer && <span className="ml-auto text-xs font-semibold text-black">✓ CORRECT</span>}
                                  {isUserAnswer && !isCorrectAnswer && <span className="ml-auto text-xs font-semibold text-slate-400">✗ WRONG</span>}
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

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'w-72' : 'w-0'} border-r-2 border-black transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="w-72 h-screen overflow-y-auto bg-slate-50">
          {/* Sidebar Header */}
          <div className="p-5 border-b-2 border-black bg-white">
            <h2 className="text-lg font-bold text-black mb-4">Questions</h2>

            {/* Filter Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2 py-2 text-xs font-semibold border-2 transition-colors ${
                  filterType === 'all'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-slate-100'
                }`}
              >
                All ({questions.length})
              </button>
              <button
                onClick={() => setFilterType('flagged')}
                className={`px-2 py-2 text-xs font-semibold border-2 transition-colors ${
                  filterType === 'flagged'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-slate-100'
                }`}
              >
                <Flag className="w-3 h-3 inline mr-1" />
                {flaggedQuestions.size}
              </button>
              <button
                onClick={() => setFilterType('answered')}
                className={`px-2 py-2 text-xs font-semibold border-2 transition-colors ${
                  filterType === 'answered'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-slate-100'
                }`}
              >
                Done ({answeredCount})
              </button>
              <button
                onClick={() => setFilterType('unanswered')}
                className={`px-2 py-2 text-xs font-semibold border-2 transition-colors ${
                  filterType === 'unanswered'
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-slate-100'
                }`}
              >
                Todo ({questions.length - answeredCount})
              </button>
            </div>

            {/* Quick Navigation */}
            <div className="space-y-2">
              <button
                onClick={goToFirstUnanswered}
                disabled={unansweredQuestions.length === 0}
                className="w-full px-3 py-2 text-xs font-semibold border-2 border-black text-black hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SkipForward className="w-3 h-3 inline mr-2" />
                First Unanswered
              </button>
              <button
                onClick={goToFirstFlagged}
                disabled={flaggedQuestionsArray.length === 0}
                className="w-full px-3 py-2 text-xs font-semibold border-2 border-black text-black hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Flag className="w-3 h-3 inline mr-2" />
                First Flagged
              </button>
              <button
                onClick={handleRandomize}
                className="w-full px-3 py-2 text-xs font-semibold border-2 border-black text-black hover:bg-slate-100 transition-colors"
              >
                <Shuffle className="w-3 h-3 inline mr-2" />
                Randomize
              </button>
            </div>
          </div>

          {/* Question Grid */}
          <div className="p-4 bg-white">
            <div className="grid grid-cols-5 gap-1.5">
              {(filterType === 'all' ? questions : filteredIndices.map(i => questions[i])).map((_, idx) => {
                const actualIndex = filterType === 'all' ? idx : filteredIndices[idx];
                const isAnswered = selectedAnswers[actualIndex] !== null;
                const isFlagged = flaggedQuestions.has(actualIndex);
                const isCurrent = actualIndex === currentQuestionIndex;

                return (
                  <button
                    key={actualIndex}
                    onClick={() => setCurrentQuestionIndex(actualIndex)}
                    className={`relative aspect-square border-2 font-bold text-xs transition-all ${
                      isCurrent
                        ? 'bg-black text-white border-black'
                        : isAnswered
                        ? 'border-black bg-slate-100 text-black'
                        : 'border-slate-300 text-slate-400 hover:border-black'
                    }`}
                  >
                    {actualIndex + 1}
                    {isFlagged && (
                      <Flag className="w-2.5 h-2.5 absolute top-0.5 right-0.5 fill-current" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="border-b-2 border-black bg-white sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-2 border-2 border-black hover:bg-slate-100 transition-colors"
                  title={showSidebar ? "Hide sidebar" : "Show sidebar"}
                >
                  {showSidebar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <div>
                  <div className="text-xs text-slate-600 uppercase tracking-wider">Question</div>
                  <div className="text-2xl font-bold text-black">
                    {currentQuestionIndex + 1} <span className="text-slate-400">/ {questions.length}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Progress</div>
                  <div className="text-lg font-bold text-black">
                    {answeredCount}/{questions.length}
                  </div>
                </div>
                <div className={`text-center ${timeLeft < 300 ? 'text-red-600' : 'text-black'}`}>
                  <div className="text-xs text-slate-600 uppercase tracking-wider mb-1">Time</div>
                  <div className="text-lg font-bold flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <Link
                  href="/"
                  className="p-2 border-2 border-black hover:bg-slate-100 transition-colors"
                  title="Exit to home"
                >
                  <Home className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Split into Question and Tabs */}
        <div className="flex-1 flex overflow-hidden">
          {/* Question Section - Left Side */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl">
              {/* Category Badge */}
              <div className="inline-block px-3 py-1 border-2 border-black text-xs font-semibold mb-6 text-black uppercase tracking-wider">
                {currentQuestion.category}
              </div>

              {/* Question */}
              <h2 className="text-xl font-bold mb-4 text-black leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Flag Button */}
              <button
                onClick={() => toggleFlag(currentQuestionIndex)}
                className={`mb-8 px-4 py-2 border-2 text-xs font-semibold transition-colors flex items-center gap-2 ${
                  flaggedQuestions.has(currentQuestionIndex)
                    ? 'bg-black text-white border-black'
                    : 'border-black text-black hover:bg-slate-100'
                }`}
              >
                <Flag className="w-3 h-3" />
                {flaggedQuestions.has(currentQuestionIndex) ? 'Flagged for Review' : 'Flag Question'}
              </button>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 border-2 transition-all ${
                        isSelected
                          ? 'border-black bg-slate-50'
                          : 'border-slate-300 hover:border-black'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 border-2 flex items-center justify-center font-bold text-sm shrink-0 ${
                          isSelected
                            ? 'border-black bg-black text-white'
                            : 'border-slate-300 text-slate-400'
                        }`}>
                          {optionLetter}
                        </div>
                        <span className="text-sm pt-1 text-black">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs Section - Right Side */}
          <div className="w-80 border-l-2 border-black overflow-y-auto bg-slate-50">
            {/* Tab Headers */}
            <div className="flex border-b-2 border-black bg-white">
              <button
                onClick={() => setActiveTab('tips')}
                className={`flex-1 px-4 py-3 text-xs font-semibold border-r-2 border-black transition-colors ${
                  activeTab === 'tips' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 mx-auto mb-1" />
                Tips
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`flex-1 px-4 py-3 text-xs font-semibold border-r-2 border-black transition-colors ${
                  activeTab === 'rules' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 mx-auto mb-1" />
                Rules
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
                  activeTab === 'review' ? 'bg-black text-white' : 'text-black hover:bg-slate-100'
                }`}
              >
                <ClipboardList className="w-4 h-4 mx-auto mb-1" />
                Review
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5">
              {activeTab === 'tips' && (
                <div className="space-y-4 text-sm">
                  <h3 className="font-bold text-black mb-3">Exam Tips</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">Read Carefully</div>
                      <div className="text-xs text-slate-600">Pay attention to keywords like "NOT", "EXCEPT", "BEST", "MOST"</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">Flag & Move On</div>
                      <div className="text-xs text-slate-600">Don't spend too much time on one question. Flag it and come back later</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">Eliminate Wrong Answers</div>
                      <div className="text-xs text-slate-600">Cross out obviously wrong options to narrow down choices</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">Time Management</div>
                      <div className="text-xs text-slate-600">You have ~1.5 minutes per question. Keep an eye on the timer</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">Review Flagged</div>
                      <div className="text-xs text-slate-600">Save 10-15 minutes at the end to review flagged questions</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-4 text-sm">
                  <h3 className="font-bold text-black mb-3">Exam Rules</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">40 Questions</div>
                      <div className="text-xs text-slate-600">Multiple choice format with 4 options each</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">60 Minutes</div>
                      <div className="text-xs text-slate-600">Total time limit for the exam</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">65% to Pass</div>
                      <div className="text-xs text-slate-600">You need 26 correct answers out of 40</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">No Negative Marking</div>
                      <div className="text-xs text-slate-600">Wrong answers don't deduct points. Always answer every question</div>
                    </div>
                    <div className="p-3 bg-white border-2 border-slate-200">
                      <div className="font-semibold text-black mb-1">One Answer Only</div>
                      <div className="text-xs text-slate-600">Select only one option per question</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'review' && (
                <div className="space-y-4 text-sm">
                  <h3 className="font-bold text-black mb-3">Review List</h3>

                  {/* Unanswered Questions */}
                  <div>
                    <div className="font-semibold text-black mb-2 flex items-center justify-between">
                      <span>Unanswered ({unansweredQuestions.length})</span>
                      {unansweredQuestions.length > 0 && (
                        <button
                          onClick={goToFirstUnanswered}
                          className="text-xs px-2 py-1 border border-black hover:bg-slate-100"
                        >
                          Go
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {unansweredQuestions.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">All questions answered!</div>
                      ) : (
                        unansweredQuestions.map(index => (
                          <button
                            key={index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className="w-8 h-8 border-2 border-slate-300 text-xs font-semibold hover:border-black transition-colors"
                          >
                            {index + 1}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Flagged Questions */}
                  <div>
                    <div className="font-semibold text-black mb-2 flex items-center justify-between">
                      <span>Flagged ({flaggedQuestionsArray.length})</span>
                      {flaggedQuestionsArray.length > 0 && (
                        <button
                          onClick={goToFirstFlagged}
                          className="text-xs px-2 py-1 border border-black hover:bg-slate-100"
                        >
                          Go
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {flaggedQuestionsArray.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No flagged questions</div>
                      ) : (
                        flaggedQuestionsArray.map(index => (
                          <button
                            key={index}
                            onClick={() => setCurrentQuestionIndex(index)}
                            className="w-8 h-8 border-2 border-black bg-slate-100 text-xs font-semibold hover:bg-slate-200 transition-colors relative"
                          >
                            {index + 1}
                            <Flag className="w-2 h-2 absolute top-0.5 right-0.5 fill-current" />
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t-2 border-black bg-white">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 border-2 border-black font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors text-black flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-3 bg-black text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Submit Exam
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 border-2 border-black font-semibold hover:bg-slate-100 transition-colors text-black flex items-center gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
