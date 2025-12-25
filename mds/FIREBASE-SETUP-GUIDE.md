# Firebase Setup Guide for ITIL App

## 🔥 Overview

This guide will help you set up Firebase Firestore for the ITIL mock exam application. The app now uses Firebase to store:
- **Questions** - All exam questions with answers and explanations
- **Exam Scores** - Complete exam results with question-level details

## 📋 Prerequisites

1. **Firebase Account** - You already have a Firebase project: `itil-3fb04`
2. **Node.js** - Installed on your system
3. **Git Bash** - For running npm commands (due to PowerShell restrictions)

## 🚀 Step 1: Install Firebase Package

Open **Git Bash** terminal and run:

```bash
npm install firebase
```

This will install the Firebase SDK for web applications.

## 🔧 Step 2: Environment Variables

The `.env.local` file has already been created with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDlRlvMxTJIjEG-TuvZ8aCmgbKErzxZMeg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=itil-3fb04.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=itil-3fb04
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=itil-3fb04.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=190041904534
NEXT_PUBLIC_FIREBASE_APP_ID=1:190041904534:web:7d0691ca22c02890a439b7
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-P9N972S235
```

⚠️ **Important**: Make sure `.env.local` is in your `.gitignore` file to keep credentials secure!

## 🗄️ Step 3: Set Up Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **itil-3fb04**
3. Click **Firestore Database** in the left sidebar
4. Click **Create Database**
5. Choose **Start in production mode** (we'll set rules next)
6. Select a location (choose closest to your users)
7. Click **Enable**

## 🔒 Step 4: Configure Firestore Security Rules

In the Firebase Console, go to **Firestore Database** → **Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to questions for everyone
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false; // Only allow writes through admin
    }
    
    // Allow read/write access to exam scores for everyone (for now)
    // TODO: Add authentication and restrict to user's own scores
    match /examScores/{scoreId} {
      allow read: if true;
      allow write: if true;
      allow delete: if true;
    }
  }
}
```

Click **Publish** to save the rules.

## 📊 Step 5: Create Firestore Collections

You need to create two collections:

### Option A: Using the Migration Page (Recommended)

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/admin/migrate`

3. Click **"Start Migration"** button

4. Wait for the upload to complete (this will upload all 40+ questions)

### Option B: Manual Creation

1. In Firebase Console, go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `questions`
4. Add a test document with these fields:
   - `id` (number): 1
   - `question` (string): "Test question"
   - `options` (array): ["A", "B", "C", "D"]
   - `correctAnswer` (number): 0
   - `category` (string): "Test"
   - `explanation` (string): "Test explanation"
   - `createdAt` (timestamp): Auto-generated

5. Repeat for `examScores` collection (this will be auto-created when you submit your first exam)

## 🏗️ Architecture Overview

### File Structure

```
itil-app/
├── .env.local                          # Firebase credentials
├── lib/
│   └── firebase/
│       ├── config.ts                   # Firebase initialization
│       └── services.ts                 # Firestore CRUD operations
├── app/
│   ├── api/
│   │   ├── questions/
│   │   │   └── route.ts               # Questions API endpoint
│   │   └── exam-scores/
│   │       └── route.ts               # Exam scores API endpoint
│   ├── admin/
│   │   └── migrate/
│   │       └── page.tsx               # Migration tool
│   ├── mock-exam/
│   │   └── page.tsx                   # Updated to use Firebase
│   └── progress/
│       └── page.tsx                   # Updated to use Firebase
└── scripts/
    └── migrate-questions-to-firebase.ts # CLI migration script
```

### Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─ GET /api/questions
       │  └─> Fetch all questions from Firestore
       │
       ├─ POST /api/questions
       │  └─> Upload questions to Firestore
       │
       ├─ GET /api/exam-scores
       │  └─> Fetch all exam scores from Firestore
       │
       ├─ POST /api/exam-scores
       │  └─> Save exam score to Firestore
       │
       └─ DELETE /api/exam-scores?id={id}
          └─> Delete exam score from Firestore
```

## 🔄 Fallback Strategy

The app implements a **graceful fallback** strategy:

1. **Try Firebase first** - Attempt to load/save data from Firestore
2. **Fallback to localStorage** - If Firebase fails, use browser localStorage
3. **Error handling** - All errors are logged to console

This ensures the app works even if:
- Firebase is down
- Network is offline
- Firestore rules block access
- API endpoints fail

## 📝 API Endpoints

### GET /api/questions
Fetch all questions from Firestore.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "What is ITIL?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "category": "Foundations",
      "explanation": "..."
    }
  ]
}
```

### POST /api/questions
Upload questions to Firestore (single or bulk).

**Request Body (Bulk):**
```json
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "category": "...",
    "explanation": "..."
  }
]
```

### GET /api/exam-scores
Fetch all exam scores.

**Query Parameters:**
- `userId` (optional): Filter by user ID

### POST /api/exam-scores
Save exam score.

**Request Body:**
```json
{
  "date": "2024-12-24T10:00:00Z",
  "score": 30,
  "percentage": 75,
  "correct": 30,
  "total": 40,
  "passed": true,
  "timeSpent": 2700,
  "flaggedCount": 3,
  "importantCount": 2,
  "questionResults": [...]
}
```

### DELETE /api/exam-scores
Delete exam score(s).

**Query Parameters:**
- `id`: Score ID to delete
- `deleteAll=true`: Delete all scores

## ✅ Testing the Setup

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Migrate questions:**
   - Go to `http://localhost:3000/admin/migrate`
   - Click "Start Migration"
   - Verify success message

3. **Take a mock exam:**
   - Go to `http://localhost:3000/mock-exam`
   - Complete the exam
   - Submit and check if score is saved

4. **Check Firebase Console:**
   - Go to Firestore Database
   - Verify `questions` collection has documents
   - Verify `examScores` collection has your exam result

5. **Check Progress Page:**
   - Go to `http://localhost:3000/progress`
   - Verify your exam score appears
   - Try deleting a score

## 🐛 Troubleshooting

### Questions not loading?
- Check Firebase Console → Firestore → `questions` collection
- Check browser console for errors
- Verify `.env.local` has correct credentials
- Check Firestore security rules allow read access

### Scores not saving?
- Check browser console for errors
- Verify Firestore security rules allow write access
- Check network tab for API call failures
- Verify `.env.local` is loaded (restart dev server)

### Migration fails?
- Check Firebase Console for quota limits
- Verify you have write permissions
- Check browser console for detailed errors
- Try uploading fewer questions at a time

### "Permission denied" errors?
- Update Firestore security rules (see Step 4)
- Make sure rules are published
- Wait a few minutes for rules to propagate

## 🔐 Security Recommendations

1. **Add Authentication** - Implement Firebase Auth to restrict access
2. **User-specific data** - Store scores per user ID
3. **Admin-only writes** - Restrict question writes to admin users
4. **Rate limiting** - Add Cloud Functions to prevent abuse
5. **Environment variables** - Never commit `.env.local` to git

## 🚀 Next Steps

1. ✅ Install Firebase package
2. ✅ Configure environment variables
3. ✅ Set up Firestore database
4. ✅ Configure security rules
5. ✅ Migrate questions to Firestore
6. ✅ Test the application
7. 🔜 Add user authentication
8. 🔜 Implement user-specific scores
9. 🔜 Add admin dashboard
10. 🔜 Deploy to production

---

**Need help?** Check the [Firebase Documentation](https://firebase.google.com/docs/firestore) or open an issue on GitHub.

