import { Zap, Flag, Star, CheckCircle, Target } from 'lucide-react';

interface QuizSidebarProps {
    currentLevel: number;
    totalLevels: number;
    totalQuestions: number;
    answeredCount: number;
    correctCount: number;
    flaggedCount: number;
    importantCount: number;
    currentStreak: number;
}

export default function QuizSidebar({
    currentLevel,
    totalLevels,
    totalQuestions,
    answeredCount,
    correctCount,
    flaggedCount,
    importantCount,
    currentStreak,
}: QuizSidebarProps) {
    const overallProgress = Math.round((answeredCount / totalQuestions) * 100);
    const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

    return (
        <div className="h-full flex flex-col p-6 space-y-8">
            {/* Level Progress */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-white font-bold text-lg">
                        <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span>Level {currentLevel}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        of {totalLevels}
                    </span>
                </div>
                <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-600 transition-all duration-500 ease-out"
                        style={{ width: `${(answeredCount % 20) / 20 * 100}%` }} // Assuming 20 questions per level
                    />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {answeredCount % 20} / 20 questions to next level
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <Zap className="w-3 h-3" />
                        Streak
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {currentStreak}
                    </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl">
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3" />
                        Accuracy
                    </div>
                    <div className={`text-2xl font-bold ${accuracy >= 65 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'}`}>
                        {accuracy}%
                    </div>
                </div>
            </div>

            {/* Overall Progress */}
            <div className="p-6 bg-slate-900 dark:bg-white rounded-2xl text-white dark:text-slate-900 shadow-xl">
                <h3 className="font-bold mb-1">Total Progress</h3>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-4">
                    {answeredCount} of {totalQuestions} completed
                </p>
                <div className="flex items-end gap-2 mb-1">
                    <span className="text-4xl font-bold leading-none">{overallProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 dark:bg-black/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 dark:bg-blue-600 transition-all duration-500"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                            <Flag className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Flagged</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{flaggedCount}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                            <Star className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">Important</span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white">{importantCount}</span>
                </div>
            </div>
        </div>
    );
}
