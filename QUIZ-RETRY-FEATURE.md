# Quiz Retry Feature - Master Your Weak Areas

## 🎯 Overview

Added three powerful retry functionalities to help users master their weak areas:
1. **Retry Failed Questions** - Focus on questions you got wrong
2. **Retry Flagged Questions** - Review questions you marked for later
3. **Retry Important Questions** - Practice questions you marked as key

All retry sessions are tracked separately in Firebase with their own scores and statistics.

---

## ✨ Features

### 1. **Beautiful Retry Cards** (Quiz Review Page)
Three gradient cards with:
- **Visual hierarchy** - Color-coded by type (Red, Orange, Yellow)
- **Question count** - Shows how many questions in each category
- **Hover effects** - Scale and shadow animations
- **Disabled state** - Grayed out when no questions available
- **Gradient backgrounds** - Modern, eye-catching design

### 2. **Dedicated Retry Quiz Page**
- **Separate quiz session** - Independent from main quiz
- **Progress tracking** - Visual progress bar
- **Color-coded UI** - Matches retry type (red/orange/yellow)
- **Radio button answers** - Consistent with mock exam
- **Results screen** - Shows performance after completion

### 3. **Firebase Integration**
- **Separate tracking** - Retry scores saved with `retryType` field
- **User stats** - Updates user profile stats
- **Score history** - All retry attempts tracked
- **Question results** - Detailed breakdown of each answer

---

## 📐 Implementation Details

### Quiz Review Page (`app/quiz/review/page.tsx`)

#### Retry Cards Section
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {/* Retry Failed Questions */}
  <button onClick={() => handleRetry('failed')}>
    <XCircle /> Retry Failed
    {incorrectQuestions.length} Questions
  </button>

  {/* Retry Flagged Questions */}
  <button onClick={() => handleRetry('flagged')}>
    <Flag /> Retry Flagged
    {flaggedQuestions.length} Questions
  </button>

  {/* Retry Important Questions */}
  <button onClick={() => handleRetry('important')}>
    <Star /> Retry Important
    {importantQuestions.length} Questions
  </button>
</div>
```

#### Retry Logic
```tsx
const handleRetry = (type: 'failed' | 'flagged' | 'important') => {
  // Get question IDs based on type
  let questionIds: number[] = [];
  
  if (type === 'failed') questionIds = incorrectQuestions;
  else if (type === 'flagged') questionIds = flaggedQuestions;
  else if (type === 'important') questionIds = importantQuestions;

  // Store session in localStorage
  localStorage.setItem('retrySession', JSON.stringify({
    type,
    questionIds,
    startTime: Date.now()
  }));

  // Navigate to retry page
  router.push(`/quiz/retry?type=${type}`);
};
```

### Retry Quiz Page (`app/quiz/retry/page.tsx`)

#### Features
- **Session management** - Loads retry session from localStorage
- **Question filtering** - Shows only selected questions
- **Answer tracking** - Tracks user answers
- **Score calculation** - Calculates performance
- **Firebase save** - Saves retry score with type indicator

#### Results Screen
```tsx
{showResults && (
  <div>
    <h2>{passed ? 'Great Progress!' : 'Keep Practicing!'}</h2>
    <p>You scored {correct} out of {questions.length} ({percentage}%)</p>
    
    <div className="grid grid-cols-2 gap-4">
      <div>Correct: {correct}</div>
      <div>Incorrect: {questions.length - correct}</div>
    </div>

    <Link href="/quiz/review">Back to Review</Link>
    <button onClick={tryAgain}>Try Again</button>
  </div>
)}
```

### Firebase Services (`lib/firebase/services.ts`)

#### Updated ExamScore Interface
```typescript
export interface ExamScore {
  id?: string;
  userId?: string;
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
  retryType?: 'failed' | 'flagged' | 'important'; // NEW!
}
```

---

## 🎨 Visual Design

### Retry Cards

**Failed Questions Card (Red)**
```
┌─────────────────────────────────────┐
│  ╔═══╗                              │
│  ║ X ║  Retry Failed                │
│  ╚═══╝                              │
│  Master the questions you got wrong │
│                                     │
│  12                      QUESTIONS  │
└─────────────────────────────────────┘
```

**Flagged Questions Card (Orange)**
```
┌─────────────────────────────────────┐
│  ╔═══╗                              │
│  ║ ⚑ ║  Retry Flagged               │
│  ╚═══╝                              │
│  Review questions you marked        │
│                                     │
│  8                       QUESTIONS  │
└─────────────────────────────────────┘
```

**Important Questions Card (Yellow)**
```
┌─────────────────────────────────────┐
│  ╔═══╗                              │
│  ║ ★ ║  Retry Important             │
│  ╚═══╝                              │
│  Practice questions you marked      │
│                                     │
│  15                      QUESTIONS  │
└─────────────────────────────────────┘
```

### Retry Quiz Page

**Header**
```
┌─────────────────────────────────────────────────────┐
│ ← [Icon] Retry Failed Questions    5/12 Answered    │
└─────────────────────────────────────────────────────┘
```

**Progress Bar**
```
████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
```

**Question Card**
```
┌─────────────────────────────────────────────────────┐
│ SERVICE MANAGEMENT                                  │
│ Question 1 of 12                                    │
│                                                     │
│ Which of the following best describes...?          │
│                                                     │
│ ◉ Option A (selected)                              │
│ ○ Option B                                         │
│ ○ Option C                                         │
│ ○ Option D                                         │
└─────────────────────────────────────────────────────┘

[Previous]              1 / 12              [Next]
```

---

## 🔥 Benefits

1. **Targeted Practice** - Focus on specific weak areas
2. **Progress Tracking** - See improvement over time
3. **Separate Scores** - Retry scores tracked independently
4. **Motivation** - Visual feedback encourages mastery
5. **Flexibility** - Retry as many times as needed
6. **Data Insights** - Track which areas need more work

---

## 📊 Data Flow

```
Quiz Review Page
    ↓
User clicks "Retry Failed"
    ↓
Store session in localStorage
    ↓
Navigate to /quiz/retry?type=failed
    ↓
Load retry session
    ↓
Filter questions by type
    ↓
User answers questions
    ↓
Submit answers
    ↓
Calculate score
    ↓
Save to Firebase with retryType
    ↓
Show results
    ↓
Option to try again or go back
```

---

## ✅ Result

Users can now:
- ✅ **Retry failed questions** to master difficult concepts
- ✅ **Retry flagged questions** to review uncertain answers
- ✅ **Retry important questions** to reinforce key topics
- ✅ **Track progress** with separate scores for each retry type
- ✅ **See improvement** over multiple retry attempts
- ✅ **Build confidence** by mastering weak areas

**Perfect for exam preparation!** 🎓

