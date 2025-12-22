'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, CheckCircle, XCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

export default function Practice() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      });
  }, []);

  const handleAnswerSelect = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswer === null) return;
    setShowAnswer(true);
    
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-2xl text-slate-600 dark:text-slate-300">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Practice Mode</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">Correct</div>
                <div className="text-xl font-bold text-green-600">{stats.correct}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600 dark:text-slate-400">Incorrect</div>
                <div className="text-xl font-bold text-red-600">{stats.incorrect}</div>
              </div>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">{currentQuestion.category}</div>
            <h2 className="text-2xl font-semibold mb-6">{currentQuestion.question}</h2>
          </div>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;
              
              let className = 'w-full text-left p-4 rounded-xl border-2 transition-all ';
              
              if (showAnswer) {
                if (isCorrectOption) {
                  className += 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected) {
                  className += 'border-red-500 bg-red-50 dark:bg-red-900/20';
                } else {
                  className += 'border-slate-200 dark:border-slate-600 opacity-50';
                }
              } else {
                className += isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-700';
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showAnswer}
                  className={className}
                >
                  <div className="flex items-center gap-3">
                    {showAnswer && isCorrectOption && <CheckCircle className="w-6 h-6 text-green-600" />}
                    {showAnswer && isSelected && !isCorrectOption && <XCircle className="w-6 h-6 text-red-600" />}
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-green-800 dark:text-green-200">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="font-semibold text-red-800 dark:text-red-200">Incorrect</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                The correct answer is: <strong>{currentQuestion.options[currentQuestion.correctAnswer]}</strong>
              </p>
            </div>
          )}

          {!showAnswer && selectedAnswer !== null && (
            <button
              onClick={handleCheckAnswer}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Check Answer
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 dark:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

