"use client";

import { useState } from "react";
import Link from "next/link";

export default function MigratePage() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const migrateQuestions = async () => {
    setLoading(true);
    setError("");
    setStatus("📚 Loading questions from local file...");

    try {
      // Fetch questions from local JSON
      const response = await fetch("/data/questions.json");
      const questions = await response.json();

      setStatus(`📊 Found ${questions.length} questions. Uploading to Firebase...`);

      // Upload to Firebase via API
      const uploadResponse = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(questions),
      });

      const result = await uploadResponse.json();

      if (result.success) {
        setStatus(`✅ ${result.message}`);
      } else {
        setError(`❌ Migration failed: ${result.error}`);
      }
    } catch (err) {
      setError(`❌ Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🔄 Migrate Questions to Firebase
          </h1>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This will upload all questions from the local JSON file
              to Firebase Firestore. Make sure Firebase is properly configured in your .env.local file.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={migrateQuestions}
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Migrating..." : "Start Migration"}
            </button>

            {status && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">{status}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Migration Steps:
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600">
              <li>Ensure Firebase configuration is set in .env.local</li>
              <li>Click "Start Migration" button above</li>
              <li>Wait for the upload to complete</li>
              <li>Verify questions in Firebase Console</li>
              <li>Test the app to ensure questions load from Firebase</li>
            </ol>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
            <li>This will create new documents in Firestore</li>
            <li>If questions already exist, duplicates will be created</li>
            <li>You may need to manually delete duplicates from Firebase Console</li>
            <li>Make sure you have proper Firebase permissions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

