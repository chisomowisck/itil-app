'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Home, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

export default function MockExam() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes in seconds
  const [examStarted, setExamStarted] = useState(false);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-2xl text-slate-600 dark:text-slate-300">Loading exam...</div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ITIL 4 Foundation Mock Exam
          </h1>
          <div className="space-y-4 mb-8 text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              40 questions randomly selected from 487 total questions
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              60 minutes time limit
            </p>
            <p className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              65% passing score (26 out of 40 questions)
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-500" />
              Results shown at the end with detailed feedback
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setExamStarted(true)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
            >
              Start Exam
            </button>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="container mx-auto max-w-4xl py-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 mb-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Exam Results</h1>
              <div className={`text-6xl font-bold mb-4 ${passed ? 'text-green-500' : 'text-red-500'}`}>
                {percentage}%
              </div>
              <div className="text-2xl mb-2">
                {score} out of {questions.length} correct
              </div>
              {passed ? (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-xl font-semibold">
                  <CheckCircle className="w-8 h-8" />
                  Congratulations! You Passed!
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 text-xl font-semibold">
                  <XCircle className="w-8 h-8" />
                  Keep Studying! You Need 65% to Pass
                </div>
              )}
            </div>

            <div className="flex gap-4 justify-center mb-8">
              <Link
                href="/mock-exam"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Retake Exam
              </Link>
              <Link
                href="/practice"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Practice Mode
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Home
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Review Your Answers</h2>
            {questions.map((q, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === q.correctAnswer;

              return (
                <div key={q.id} className={`bg-white dark:bg-slate-800 rounded-xl p-6 border-2 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                  <div className="flex items-start gap-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        Question {index + 1} • {q.category}
                      </div>
                      <div className="text-lg font-semibold mb-4">{q.question}</div>

                      <div className="space-y-2">
                        {q.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex;
                          const isCorrectAnswer = q.correctAnswer === optIndex;

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg ${
                                isCorrectAnswer
                                  ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                                  : isUserAnswer
                                  ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                                  : 'bg-slate-50 dark:bg-slate-700/50'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-red-600" />}
                                <span>{option}</span>
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
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = selectedAnswers.filter(a => a !== null).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Mock Exam</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">Answered</div>
                <div className="text-xl font-bold">{answeredCount}/{questions.length}</div>
              </div>
              <div className={`text-center ${timeLeft < 300 ? 'text-red-500' : ''}`}>
                <div className="text-sm text-slate-600 dark:text-slate-400">Time Left</div>
                <div className="text-xl font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{currentQuestion.category}</div>
            <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
          </div>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestionIndex] === index
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-slate-300 dark:border-slate-600'
                  }`}>
                    {selectedAnswers[currentQuestionIndex] === index && (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            Previous
          </button>

          <div className="flex gap-2 overflow-x-auto max-w-md">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-semibold flex-shrink-0 ${
                  index === currentQuestionIndex
                    ? 'bg-blue-500 text-white'
                    : selectedAnswers[index] !== null
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg transition-all"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
