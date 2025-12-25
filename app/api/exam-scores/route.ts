// API route for exam scores CRUD operations
import { NextRequest, NextResponse } from "next/server";
import { 
  saveExamScore, 
  getAllExamScores, 
  deleteExamScore, 
  deleteAllExamScores 
} from "@/lib/firebase/services";

/**
 * GET /api/exam-scores
 * Get all exam scores (optionally filtered by userId)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    
    const scores = await getAllExamScores(userId || undefined);
    return NextResponse.json({ success: true, data: scores });
  } catch (error) {
    console.error("Error in GET /api/exam-scores:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch exam scores" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/exam-scores
 * Save a new exam score
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      userId,
      date,
      score,
      percentage,
      correct,
      total,
      passed,
      timeSpent,
      flaggedCount,
      importantCount,
      questionResults,
    } = body;
    
    // Validate required fields
    if (
      date === undefined ||
      score === undefined ||
      percentage === undefined ||
      correct === undefined ||
      total === undefined ||
      passed === undefined ||
      timeSpent === undefined ||
      !questionResults
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const docId = await saveExamScore({
      userId,
      date,
      score,
      percentage,
      correct,
      total,
      passed,
      timeSpent,
      flaggedCount: flaggedCount || 0,
      importantCount: importantCount || 0,
      questionResults,
    });
    
    return NextResponse.json({
      success: true,
      message: "Exam score saved successfully",
      docId,
    });
  } catch (error) {
    console.error("Error in POST /api/exam-scores:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save exam score" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/exam-scores
 * Delete exam score(s)
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scoreId = searchParams.get("id");
    const userId = searchParams.get("userId");
    const deleteAll = searchParams.get("deleteAll") === "true";
    
    if (deleteAll) {
      await deleteAllExamScores(userId || undefined);
      return NextResponse.json({
        success: true,
        message: "All exam scores deleted successfully",
      });
    }
    
    if (!scoreId) {
      return NextResponse.json(
        { success: false, error: "Score ID is required" },
        { status: 400 }
      );
    }
    
    await deleteExamScore(scoreId);
    return NextResponse.json({
      success: true,
      message: "Exam score deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/exam-scores:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete exam score(s)" },
      { status: 500 }
    );
  }
}

