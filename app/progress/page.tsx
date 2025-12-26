'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, TrendingUp, Award, Clock, Flag, Star, CheckCircle, XCircle, Calendar, Trash2, Filter, BarChart3, Target, AlertCircle, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserProfile from '@/components/auth/UserProfile';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllExamScores, deleteExamScore, deleteAllExamScores } from '@/lib/firebase/services';

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
  id?: string;
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
  questionResults?: QuestionResult[];
}

type FilterType = 'all' | 'passed' | 'failed' | 'flagged' | 'important';

function ProgressContent() {
  const { user } = useAuth();
  const [scores, setScores] = useState<ExamScore[]>([]);
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    // Load scores from Firebase first, fallback to localStorage
    const loadScores = async () => {
      if (!user) return;

      try {
        // Load directly using client SDK to pass auth context
        const data = await getAllExamScores(user.uid);

        if (data.length > 0) {
          setScores(data);
        } else {
          // Fallback to localStorage logic is a bit weird here since we want cloud sync
          // But if cloud is empty, maybe check local? 
          // For now, let's prioritize cloud, and if empty there, check local just in case
          const savedScores = localStorage.getItem('examScores');
          if (savedScores) {
            const localScores = JSON.parse(savedScores);
            // In a real app we might merge, but here let's just show local if cloud is empty
            // or maybe better to migrate local to cloud?
            // Let's keep existing behavior: if cloud empty, show local
            setScores(localScores);
          }
        }
      } catch (error) {
        console.error('Error loading scores from Firebase:', error);
        // Fallback to localStorage
        const savedScores = localStorage.getItem('examScores');
        if (savedScores) {
          setScores(JSON.parse(savedScores));
        }
      }
    };

    loadScores();
  }, [user]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteScore = async (id: string) => {
    try {
      // Try deleting from Firebase using client SDK
      await deleteExamScore(id);

      // Update local state
      const updatedScores = scores.filter(s => s.id !== id);
      setScores(updatedScores);

      // Also update localStorage to keep in sync
      localStorage.setItem('examScores', JSON.stringify(updatedScores));
    } catch (error) {
      console.error('Error deleting score from Firebase:', error);
      // Fallback to localStorage
      const updatedScores = scores.filter(s => s.id !== id);
      setScores(updatedScores);
      localStorage.setItem('examScores', JSON.stringify(updatedScores));
    }
  };

  const clearAllScores = async () => {
    if (confirm('Are you sure you want to delete all exam scores?')) {
      if (!user) return;

      try {
        // Try deleting all from Firebase using client SDK
        await deleteAllExamScores(user.uid);

        // Update state
        setScores([]);
        localStorage.removeItem('examScores');
      } catch (error) {
        console.error('Error deleting all scores from Firebase:', error);
        // Fallback to localStorage
        setScores([]);
        localStorage.removeItem('examScores');
      }
    }
  };

  const filteredScores = scores.filter(score => {
    if (filterType === 'passed') return score.passed;
    if (filterType === 'failed') return !score.passed;
    if (filterType === 'flagged') return score.flaggedCount > 0;
    if (filterType === 'important') return score.importantCount > 0;
    return true;
  });

  const passedCount = scores.filter(s => s.passed).length;
  const failedCount = scores.filter(s => !s.passed).length;
  const flaggedExamsCount = scores.filter(s => s.flaggedCount > 0).length;
  const importantExamsCount = scores.filter(s => s.importantCount > 0).length;
  const averageScore = scores.length > 0
    ? Math.round(scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length)
    : 0;
  const bestScore = scores.length > 0
    ? Math.max(...scores.map(s => s.percentage))
    : 0;
  const worstScore = scores.length > 0
    ? Math.min(...scores.map(s => s.percentage))
    : 0;
  const improvementTrend = scores.length >= 2
    ? scores[0].percentage - scores[scores.length - 1].percentage
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 shadow-sm border-b border-slate-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Progress Tracking</h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">View your exam history and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <Navigation />
              <UserProfile />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Total Exams</div>
            </div>
            <div className="text-3xl font-bold text-black dark:text-white">{scores.length}</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Passed</div>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{passedCount}</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Failed</div>
            </div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{failedCount}</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Best Score</div>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{bestScore}%</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 dark:bg-zinc-800 rounded-lg">
                <Target className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Average</div>
            </div>
            <div className="text-3xl font-bold text-slate-700 dark:text-slate-300">{averageScore}%</div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-lg ${improvementTrend >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                <TrendingUp className={`w-5 h-5 ${improvementTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`} />
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Trend</div>
            </div>
            <div className={`text-3xl font-bold ${improvementTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
              {improvementTrend >= 0 ? '+' : ''}{improvementTrend}%
            </div>
          </div>
        </div>

        {/* Filter and Actions */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${filterType === 'all' ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-slate-100 dark:bg-zinc-800 text-black dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
              >
                All ({scores.length})
              </button>
              <button
                onClick={() => setFilterType('passed')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${filterType === 'passed' ? 'bg-green-600 text-white' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                Passed ({passedCount})
              </button>
              <button
                onClick={() => setFilterType('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${filterType === 'failed' ? 'bg-red-600 text-white' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50'
                  }`}
              >
                <XCircle className="w-4 h-4" />
                Failed ({failedCount})
              </button>
              <button
                onClick={() => setFilterType('flagged')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${filterType === 'flagged' ? 'bg-orange-600 text-white' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                  }`}
              >
                <Flag className="w-4 h-4" />
                Flagged ({flaggedExamsCount})
              </button>
              <button
                onClick={() => setFilterType('important')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1 ${filterType === 'important' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                  }`}
              >
                <Star className="w-4 h-4" />
                Important ({importantExamsCount})
              </button>
            </div>
            {scores.length > 0 && (
              <button
                onClick={clearAllScores}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Score History */}
        {filteredScores.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-12 text-center shadow-sm">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">
              {filterType === 'all' ? 'No Exam History Yet' : `No ${filterType} exams`}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {filterType === 'all'
                ? 'Take a mock exam to start tracking your progress!'
                : `You haven't ${filterType} any exams yet.`}
            </p>
            <Link
              href="/mock-exam"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors font-semibold"
            >
              Start Mock Exam
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">Showing {filteredScores.length} exam{filteredScores.length !== 1 ? 's' : ''}</p>
            {filteredScores.map((score) => {

              const hasDetails = score.questionResults && score.questionResults.length > 0;

              return (
                <div
                  key={score.id}
                  className={`bg-white dark:bg-zinc-900 rounded-xl border-2 shadow-sm hover:shadow-md transition-all ${score.passed ? 'border-green-200 dark:border-green-900/30' : 'border-red-200 dark:border-red-900/30'
                    }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${score.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                          {score.passed ? (
                            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                          )}
                        </div>
                        <div>
                          <div className={`text-2xl font-bold ${score.passed ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {score.percentage}%
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {score.correct} / {score.total} correct
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                      </div>
                      <div className="flex items-center gap-2">
                        {hasDetails && (
                          <Link
                            href={`/progress/${score.id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black text-sm font-semibold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                          >
                            Review
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            score.id && deleteScore(score.id);
                          }}
                          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
                          title="Delete this score"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Date</div>
                          <div className="text-sm font-semibold text-black dark:text-white">{formatDate(score.date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Time Spent</div>
                          <div className="text-sm font-semibold text-black dark:text-white">{formatTime(score.timeSpent)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="w-4 h-4 text-orange-400" />
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Flagged</div>
                          <div className="text-sm font-semibold text-black dark:text-white">{score.flaggedCount}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Important</div>
                          <div className="text-sm font-semibold text-black dark:text-white">{score.importantCount}</div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 px-4 py-2 rounded-lg text-center font-semibold ${score.passed
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                      }`}>
                      {score.passed ? '✓ PASSED' : '✗ FAILED'} - {score.passed ? 'Pass mark is 65%' : 'Need 65% to pass'}
                    </div>
                  </div>


                </div>
              );
            })}
          </div>
        )}

        {/* Score Trend Chart */}
        {scores.length > 1 && (
          <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-black dark:text-white mb-4">Score Trend</h3>
            <div className="relative h-48">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 dark:text-slate-400 pr-2">
                <span>100%</span>
                <span>75%</span>
                <span>65%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Chart area */}
              <div className="ml-12 h-full relative border-l-2 border-b-2 border-slate-200 dark:border-zinc-700">
                {/* Pass line */}
                <div className="absolute left-0 right-0 border-t-2 border-dashed border-green-300 dark:border-green-700" style={{ bottom: '65%' }}>
                  <span className="absolute -top-2 right-0 text-xs text-green-600 dark:text-green-400 bg-white dark:bg-zinc-900 px-1">Pass</span>
                </div>

                {/* Score points and line */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  {/* Line connecting points */}
                  <polyline
                    points={scores.slice().reverse().map((s, i) => {
                      const x = (i / Math.max(scores.length - 1, 1)) * 100;
                      const y = 100 - s.percentage;
                      return `${x}%,${y}%`;
                    }).join(' ')}
                    fill="none"
                    stroke={improvementTrend >= 0 ? '#10b981' : '#f59e0b'}
                    strokeWidth="2"
                  />

                  {/* Points */}
                  {scores.slice().reverse().map((s, i) => {
                    const x = (i / Math.max(scores.length - 1, 1)) * 100;
                    const y = 100 - s.percentage;
                    return (
                      <circle
                        key={i}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="4"
                        fill={s.passed ? '#10b981' : '#ef4444'}
                        stroke="white"
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* X-axis labels */}
              <div className="ml-12 mt-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Oldest</span>
                <span>Latest</span>
              </div>
            </div>
          </div>
        )}

        {/* Performance Summary */}
        {scores.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Average Score */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Average Performance</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Average Score</span>
                    <span className="text-lg font-bold text-black dark:text-white">{averageScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full transition-all ${averageScore >= 65 ? 'bg-green-600 dark:bg-green-500' : 'bg-red-600 dark:bg-red-500'
                        }`}
                      style={{ width: `${averageScore}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-slate-500 dark:text-slate-400">0%</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Pass: 65%</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Range */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-black dark:text-white mb-4">Score Range</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Best Score</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{bestScore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Worst Score</span>
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">{worstScore}%</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-zinc-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Improvement</span>
                  <span className={`text-lg font-bold ${improvementTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {improvementTrend >= 0 ? '+' : ''}{improvementTrend}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Progress() {
  return (
    <ProtectedRoute>
      <ProgressContent />
    </ProtectedRoute>
  );
}
