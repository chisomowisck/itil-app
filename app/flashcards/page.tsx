'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import Navigation from '@/components/Navigation';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

function FlashcardsContent() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    fetch('/data/questions.json')
      .then(res => res.json())
      .then(data => {
        const shuffled = [...data].sort(() => Math.random() - 0.5);
        setQuestions(shuffled);
      });
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-2xl text-slate-700">Loading flashcards...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black">Flashcards</h1>
              <p className="text-sm text-slate-600">
                Card {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Navigation />
              <UserProfile />
              <button
                onClick={handleShuffle}
                className="flex items-center gap-2 px-4 py-2 border-2 border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                Shuffle
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <div className="text-center text-sm text-slate-500 mb-4">
            {currentQuestion.category}
          </div>
          
          <div
            onClick={handleFlip}
            className="relative cursor-pointer"
            style={{ perspective: '1000px' }}
          >
            <div
              className={`relative w-full h-96 transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div
                className={`absolute inset-0 bg-white rounded-2xl shadow-2xl border border-slate-200 p-8 flex items-center justify-center backface-hidden ${
                  isFlipped ? 'invisible' : 'visible'
                }`}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="text-center">
                  <div className="text-sm text-slate-500 mb-4">Question</div>
                  <h2 className="text-2xl font-semibold text-black">{currentQuestion.question}</h2>
                  <p className="text-sm text-slate-500 mt-8">Click to reveal answer</p>
                </div>
              </div>

              {/* Back of card */}
              <div
                className={`absolute inset-0 bg-black text-white rounded-2xl shadow-2xl p-8 flex items-center justify-center backface-hidden ${
                  isFlipped ? 'visible' : 'invisible'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)'
                }}
              >
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-4">Answer</div>
                  <h2 className="text-2xl font-bold mb-6">
                    {currentQuestion.options[currentQuestion.correctAnswer]}
                  </h2>
                  <p className="text-sm opacity-90">Click to see question</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border-2 border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-center">
            <div className="text-sm text-slate-500">
              Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </div>
            <div className="w-64 h-2 bg-slate-200 rounded-full mt-2">
              <div
                className="h-full bg-black rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 hover:shadow-md transition-all"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}

export default function Flashcards() {
  return (
    <ProtectedRoute>
      <FlashcardsContent />
    </ProtectedRoute>
  );
}
