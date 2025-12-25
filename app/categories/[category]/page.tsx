'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { Home, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

function CategoryPracticeContent({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = use(params);
  const category = decodeURIComponent(resolvedParams.category);
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  useEffect(() => {
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((q: Question) => q.category === category);
        setQuestions(filtered);
      });
  }, [category]);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-2xl text-slate-700">Loading questions...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">{category}</h1>
              <p className="text-sm text-slate-600">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-slate-600">Correct</div>
                <div className="text-xl font-bold text-green-600">{stats.correct}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-600">Incorrect</div>
                <div className="text-xl font-bold text-red-600">{stats.incorrect}</div>
              </div>
              <UserProfile />
              <Link
                href="/categories"
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-black">{currentQuestion.question}</h2>

          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === currentQuestion.correctAnswer;

              let className = 'w-full text-left p-4 rounded-xl border-2 transition-all ';

              if (showAnswer) {
                if (isCorrectOption) {
                  className += 'border-green-600 bg-green-50';
                } else if (isSelected) {
                  className += 'border-red-500 bg-red-50';
                } else {
                  className += 'border-slate-200 opacity-50';
                }
              } else {
                className += isSelected
                  ? 'border-black bg-slate-50'
                  : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50';
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
                    <span className="text-sm text-black">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {showAnswer && (
            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    <span className="font-semibold text-red-800">
                      Correct answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}

          {!showAnswer && selectedAnswer !== null && (
            <button
              onClick={handleCheckAnswer}
              className="w-full bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 hover:shadow-md transition-all"
            >
              Check Answer
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-3 rounded-xl font-semibold bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 hover:shadow-md transition-all"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}

export default function CategoryPractice({ params }: { params: Promise<{ category: string }> }) {
  return (
    <ProtectedRoute>
      <CategoryPracticeContent params={params} />
    </ProtectedRoute>
  );
}
