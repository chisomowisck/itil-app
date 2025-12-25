'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  FileText, 
  TrendingUp, 
  BookOpen, 
  Layers, 
  CreditCard, 
  Dumbbell, 
  BookMarked 
} from 'lucide-react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/mock-exam', label: 'Mock Exam', icon: FileText },
    { href: '/progress', label: 'Progress', icon: TrendingUp },
    { href: '/categories', label: 'Categories', icon: Layers },
    { href: '/flashcards', label: 'Flashcards', icon: CreditCard },
    { href: '/practice', label: 'Practice', icon: Dumbbell },
    { href: '/study-guide', label: 'Study Guide', icon: BookMarked },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg border-2 border-slate-300 hover:bg-slate-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                isActive(item.href)
                  ? 'bg-black text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-50 mx-4">
          <nav className="p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all mb-1 ${
                    isActive(item.href)
                      ? 'bg-black text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}

