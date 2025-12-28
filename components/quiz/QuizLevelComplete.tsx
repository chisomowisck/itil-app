import { Award, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface QuizLevelCompleteProps {
    level: number;
    score: number;
    total: number;
    onContinue: () => void;
    onRestartLevel: () => void;
}

export default function QuizLevelComplete({
    level,
    score,
    total,
    onContinue,
    onRestartLevel,
}: QuizLevelCompleteProps) {
    const percentage = Math.round((score / total) * 100);
    const isPassing = percentage >= 65;

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-slate-200 dark:border-zinc-800 text-center animating-enter">
            <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6 text-yellow-600 dark:text-yellow-400">
                <Award className="w-10 h-10" />
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Level {level} Complete!
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
                You've completed this set of questions.
            </p>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Score</div>
                    <div className={`text-2xl font-bold ${isPassing ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                        {percentage}%
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700">
                    <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">Correct</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {score}/{total}
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                <button
                    onClick={onRestartLevel}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold border-2 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-zinc-600 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" />
                    Retry Level
                </button>
                <button
                    onClick={onContinue}
                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            <Link href="/quiz/review" className="mt-6 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
                Review Answers <ArrowRight className="w-3 h-3" />
            </Link>
        </div>
    );
}
