"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { logoutUser } from "@/lib/firebase/auth";

export default function UserProfile() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const result = await logoutUser();
    
    if (result.success) {
      router.push("/login");
    } else {
      console.error("Logout failed:", result.error);
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
        title="My Profile"
      >
        <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
          {userProfile?.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
        </div>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {userProfile?.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {user.email}
              </p>
              {userProfile && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Exams Taken
                    </p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {userProfile.examsTaken || 0}
                    </p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded p-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Best Score
                    </p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {userProfile.bestScore || 0}%
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/progress");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>My Progress</span>
              </button>

              <button
                onClick={() => {
                  setShowDropdown(false);
                  router.push("/mock-exam");
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Take Exam</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>{loading ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

