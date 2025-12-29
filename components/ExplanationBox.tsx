'use client';

import { Info } from 'lucide-react';

interface ExplanationBoxProps {
    explanation: string;
    className?: string;
}

export default function ExplanationBox({ explanation, className = '' }: ExplanationBoxProps) {
    return (
        <div className={`bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                    <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Explanation</h4>
                    <div 
                        className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed prose prose-sm max-w-none
                                   prose-strong:text-blue-900 dark:prose-strong:text-blue-100
                                   prose-strong:font-bold
                                   prose-p:my-1
                                   prose-ul:my-2
                                   prose-li:my-1"
                        dangerouslySetInnerHTML={{ __html: explanation }}
                    />
                </div>
            </div>
        </div>
    );
}

