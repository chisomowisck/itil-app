/**
 * Script to migrate questions from local JSON to Firebase Firestore
 * 
 * Usage:
 * 1. Make sure Firebase is configured in .env.local
 * 2. Run: npx ts-node scripts/migrate-questions-to-firebase.ts
 * 
 * Or use the API endpoint:
 * POST http://localhost:3000/api/questions
 * with the questions array as the body
 */

import * as fs from 'fs';
import * as path from 'path';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

async function migrateQuestions() {
  try {
    console.log('🚀 Starting migration of questions to Firebase...\n');
    
    // Read questions from local JSON file
    const questionsPath = path.join(process.cwd(), 'public', 'data', 'questions.json');
    const questionsData = fs.readFileSync(questionsPath, 'utf-8');
    const questions: Question[] = JSON.parse(questionsData);
    
    console.log(`📚 Found ${questions.length} questions in local file\n`);
    
    // Send to API endpoint
    const response = await fetch('http://localhost:3000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questions),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Migration successful!');
      console.log(`📊 ${result.message}\n`);
    } else {
      console.error('❌ Migration failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during migration:', error);
    process.exit(1);
  }
}

// Run the migration
migrateQuestions();

