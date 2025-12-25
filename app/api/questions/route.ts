// API route for questions CRUD operations
import { NextRequest, NextResponse } from "next/server";
import { getAllQuestions, addQuestion, bulkUploadQuestions } from "@/lib/firebase/services";

/**
 * GET /api/questions
 * Get all questions from Firestore
 */
export async function GET() {
  try {
    const questions = await getAllQuestions();
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error("Error in GET /api/questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/questions
 * Add a new question or bulk upload questions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if it's a bulk upload
    if (Array.isArray(body)) {
      await bulkUploadQuestions(body);
      return NextResponse.json({ 
        success: true, 
        message: `Successfully uploaded ${body.length} questions` 
      });
    }
    
    // Single question upload
    const { question, options, correctAnswer, category, explanation } = body;
    
    if (!question || !options || correctAnswer === undefined || !category || !explanation) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const docId = await addQuestion({
      question,
      options,
      correctAnswer,
      category,
      explanation,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Question added successfully",
      docId 
    });
  } catch (error) {
    console.error("Error in POST /api/questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add question(s)" },
      { status: 500 }
    );
  }
}

