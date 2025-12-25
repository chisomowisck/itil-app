// Firebase Firestore services for questions and exam scores
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  increment,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./config";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

export interface QuestionResult {
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

export interface ExamScore {
  id?: string; // Firestore document ID
  userId?: string; // For future multi-user support
  date: string;
  score: number;
  percentage: number;
  correct: number;
  total: number;
  passed: boolean;
  timeSpent: number;
  flaggedCount: number;
  importantCount: number;
  questionResults: QuestionResult[];
  createdAt?: Timestamp;
}

// ============================================================================
// QUESTIONS COLLECTION SERVICES
// ============================================================================

/**
 * Get all questions from Firestore
 */
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const questionsRef = collection(db, "questions");
    const querySnapshot = await getDocs(questionsRef);

    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: data.id,
        question: data.question,
        options: data.options,
        correctAnswer: data.correctAnswer,
        category: data.category,
        explanation: data.explanation,
      });
    });

    // Sort by ID
    return questions.sort((a, b) => a.id - b.id);
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
}

/**
 * Get a single question by ID
 */
export async function getQuestionById(questionId: number): Promise<Question | null> {
  try {
    const questionsRef = collection(db, "questions");
    const q = query(questionsRef, where("id", "==", questionId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const data = querySnapshot.docs[0].data();
    return {
      id: data.id,
      question: data.question,
      options: data.options,
      correctAnswer: data.correctAnswer,
      category: data.category,
      explanation: data.explanation,
    };
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
}

/**
 * Add a new question to Firestore
 */
export async function addQuestion(question: Omit<Question, "id">): Promise<string> {
  try {
    // Get the highest ID
    const questions = await getAllQuestions();
    const maxId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 0;

    const questionsRef = collection(db, "questions");
    const docRef = await addDoc(questionsRef, {
      ...question,
      id: maxId + 1,
      createdAt: Timestamp.now(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding question:", error);
    throw error;
  }
}

/**
 * Bulk upload questions to Firestore
 */
export async function bulkUploadQuestions(questions: Question[]): Promise<void> {
  try {
    const questionsRef = collection(db, "questions");

    for (const question of questions) {
      await addDoc(questionsRef, {
        ...question,
        createdAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error("Error bulk uploading questions:", error);
    throw error;
  }
}

// ============================================================================
// EXAM SCORES COLLECTION SERVICES
// ============================================================================

/**
 * Save exam score to Firestore
 */
export async function saveExamScore(examScore: Omit<ExamScore, "id" | "createdAt">): Promise<string> {
  try {
    const scoresRef = collection(db, "examScores");
    const docRef = await addDoc(scoresRef, {
      ...examScore,
      createdAt: Timestamp.now(),
    });

    // Update user stats if userId is provided
    if (examScore.userId) {
      await updateUserStats(examScore.userId, examScore.percentage);
    }

    return docRef.id;
  } catch (error) {
    console.error("Error saving exam score:", error);
    throw error;
  }
}

/**
 * Get all exam scores (optionally filtered by userId)
 */
export async function getAllExamScores(userId?: string): Promise<ExamScore[]> {
  try {
    const scoresRef = collection(db, "examScores");
    let q;

    if (userId) {
      // Remove orderBy to avoid creating a composite index
      q = query(scoresRef, where("userId", "==", userId));
    } else {
      q = query(scoresRef, orderBy("createdAt", "desc"));
    }

    const querySnapshot = await getDocs(q);

    const scores: ExamScore[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      scores.push({
        id: doc.id,
        userId: data.userId,
        date: data.date,
        score: data.score,
        percentage: data.percentage,
        correct: data.correct,
        total: data.total,
        passed: data.passed,
        timeSpent: data.timeSpent,
        flaggedCount: data.flaggedCount,
        importantCount: data.importantCount,
        questionResults: data.questionResults,
        createdAt: data.createdAt,
      });
    });

    // Sort manually in client to handle the missing index
    return scores.sort((a, b) => {
      const dateA = a.createdAt ? a.createdAt.toMillis() : new Date(a.date).getTime();
      const dateB = b.createdAt ? b.createdAt.toMillis() : new Date(b.date).getTime();
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error fetching exam scores:", error);
    throw error;
  }
}

/**
 * Get a single exam score by ID
 */
export async function getExamScoreById(scoreId: string): Promise<ExamScore | null> {
  try {
    const scoreRef = doc(db, "examScores", scoreId);
    const scoreDoc = await getDoc(scoreRef);

    if (!scoreDoc.exists()) {
      return null;
    }

    const data = scoreDoc.data();
    return {
      id: scoreDoc.id,
      userId: data.userId,
      date: data.date,
      score: data.score,
      percentage: data.percentage,
      correct: data.correct,
      total: data.total,
      passed: data.passed,
      timeSpent: data.timeSpent,
      flaggedCount: data.flaggedCount,
      importantCount: data.importantCount,
      questionResults: data.questionResults,
      createdAt: data.createdAt,
    };
  } catch (error) {
    console.error("Error fetching exam score:", error);
    throw error;
  }
}

/**
 * Delete an exam score by ID
 */
export async function deleteExamScore(scoreId: string): Promise<void> {
  try {
    const scoreRef = doc(db, "examScores", scoreId);
    await deleteDoc(scoreRef);
  } catch (error) {
    console.error("Error deleting exam score:", error);
    throw error;
  }
}

/**
 * Delete all exam scores (optionally filtered by userId)
 */
export async function deleteAllExamScores(userId?: string): Promise<void> {
  try {
    const scores = await getAllExamScores(userId);

    for (const score of scores) {
      if (score.id) {
        await deleteExamScore(score.id);
      }
    }
  } catch (error) {
    console.error("Error deleting all exam scores:", error);
    throw error;
  }
}

// ============================================================================
// USER PROFILE FUNCTIONS
// ============================================================================

/**
 * Update user profile stats after completing an exam
 */
export async function updateUserStats(
  userId: string,
  examPercentage: number
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentBestScore = userDoc.data().bestScore || 0;
      const newBestScore = Math.max(currentBestScore, examPercentage);

      await setDoc(
        userRef,
        {
          examsTaken: increment(1),
          bestScore: newBestScore,
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error updating user stats:", error);
    throw error;
  }
}
