# Testing Checklist - Firebase Integration

## 🎯 Pre-Testing Setup

### 1. Install Firebase Package
- [ ] Open Git Bash terminal
- [ ] Run: `npm install firebase`
- [ ] Verify installation: Check `package.json` for `firebase` dependency

### 2. Verify Environment Variables
- [ ] Check `.env.local` exists in root directory
- [ ] Verify all Firebase credentials are present
- [ ] Restart dev server: `npm run dev`

### 3. Set Up Firestore Database
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: **itil-3fb04**
- [ ] Create Firestore Database (if not exists)
- [ ] Set security rules (see FIREBASE-SETUP-GUIDE.md)
- [ ] Publish rules

## 📝 Testing Steps

### Phase 1: Migration Testing

#### Test 1.1: Access Migration Page
- [ ] Navigate to `http://localhost:3000/admin/migrate`
- [ ] Page loads without errors
- [ ] Migration button is visible

#### Test 1.2: Migrate Questions
- [ ] Click "Start Migration" button
- [ ] Wait for upload to complete
- [ ] Verify success message appears
- [ ] Check browser console for errors

#### Test 1.3: Verify in Firebase Console
- [ ] Go to Firebase Console → Firestore Database
- [ ] Check `questions` collection exists
- [ ] Verify documents are present (should be 40+ questions)
- [ ] Click on a document and verify fields:
  - [ ] `id` (number)
  - [ ] `question` (string)
  - [ ] `options` (array)
  - [ ] `correctAnswer` (number)
  - [ ] `category` (string)
  - [ ] `explanation` (string)
  - [ ] `createdAt` (timestamp)

### Phase 2: Mock Exam Testing

#### Test 2.1: Load Questions from Firebase
- [ ] Navigate to `http://localhost:3000/mock-exam`
- [ ] Click "Start Exam"
- [ ] Verify 40 questions load
- [ ] Check browser console - should see Firebase API call
- [ ] Verify no errors in console

#### Test 2.2: Navigation Buttons (Sticky Fix)
- [ ] Answer a few questions
- [ ] Scroll down on a long question
- [ ] Verify navigation buttons are **always visible** at bottom
- [ ] Click "Next" without scrolling
- [ ] Click "Previous" without scrolling
- [ ] Verify buttons work correctly

#### Test 2.3: Take Complete Exam
- [ ] Answer all 40 questions
- [ ] Flag some questions (click Flag button)
- [ ] Mark some as important (click Star button)
- [ ] Toggle score visibility (eye icon)
- [ ] Verify score updates in real-time
- [ ] Click "Submit Exam" on last question

#### Test 2.4: Save Score to Firebase
- [ ] After submitting, check browser console
- [ ] Should see POST request to `/api/exam-scores`
- [ ] Verify no errors
- [ ] Go to Firebase Console → Firestore Database
- [ ] Check `examScores` collection exists
- [ ] Verify your exam result is saved with:
  - [ ] `date` (string)
  - [ ] `score` (number)
  - [ ] `percentage` (number)
  - [ ] `correct` (number)
  - [ ] `total` (number)
  - [ ] `passed` (boolean)
  - [ ] `timeSpent` (number)
  - [ ] `flaggedCount` (number)
  - [ ] `importantCount` (number)
  - [ ] `questionResults` (array of 40 objects)
  - [ ] `createdAt` (timestamp)

### Phase 3: Progress Page Testing

#### Test 3.1: Load Scores from Firebase
- [ ] Navigate to `http://localhost:3000/progress`
- [ ] Verify your exam score appears
- [ ] Check browser console - should see GET request to `/api/exam-scores`
- [ ] Verify no errors

#### Test 3.2: Statistics Dashboard
- [ ] Verify all 6 stat cards display:
  - [ ] Total Exams
  - [ ] Passed Count
  - [ ] Failed Count
  - [ ] Best Score
  - [ ] Average Score
  - [ ] Improvement Trend
- [ ] Verify numbers are correct

#### Test 3.3: Filtering
- [ ] Click "All" filter - shows all exams
- [ ] Click "Passed" filter - shows only passed exams (≥65%)
- [ ] Click "Failed" filter - shows only failed exams (<65%)
- [ ] Click "Flagged" filter - shows exams with flagged questions
- [ ] Click "Important" filter - shows exams with important questions

#### Test 3.4: Expandable Details
- [ ] Click chevron (▼) icon on an exam card
- [ ] Verify exam details expand
- [ ] Check category breakdown shows:
  - [ ] Correct count
  - [ ] Incorrect count
  - [ ] Flagged count
  - [ ] Important count
- [ ] Verify question list shows all 40 questions
- [ ] Check each question shows:
  - [ ] Question number and category
  - [ ] Question text
  - [ ] Correct/Incorrect/Unanswered status
  - [ ] Flag icon (if flagged)
  - [ ] Star icon (if important)
  - [ ] Color coding (green/red/gray)

#### Test 3.5: Delete Score
- [ ] Click trash icon on an exam card
- [ ] Verify score is removed from list
- [ ] Check Firebase Console - document should be deleted
- [ ] Refresh page - score should not reappear

#### Test 3.6: Clear All Scores
- [ ] Click "Clear All Scores" button
- [ ] Confirm deletion in dialog
- [ ] Verify all scores are removed
- [ ] Check Firebase Console - `examScores` collection should be empty
- [ ] Refresh page - no scores should appear

### Phase 4: Fallback Testing

#### Test 4.1: Offline Mode (Questions)
- [ ] Open browser DevTools → Network tab
- [ ] Set to "Offline" mode
- [ ] Refresh mock exam page
- [ ] Verify questions load from local JSON (fallback)
- [ ] Check console for fallback message

#### Test 4.2: Offline Mode (Scores)
- [ ] Keep offline mode enabled
- [ ] Complete an exam and submit
- [ ] Verify score saves to localStorage (fallback)
- [ ] Go to Progress page
- [ ] Verify score loads from localStorage

#### Test 4.3: Firebase Failure Simulation
- [ ] Go to Firebase Console → Firestore → Rules
- [ ] Temporarily set: `allow read, write: if false;`
- [ ] Publish rules
- [ ] Try loading questions - should fallback to local JSON
- [ ] Try saving score - should fallback to localStorage
- [ ] Restore original rules

### Phase 5: Multi-Exam Testing

#### Test 5.1: Take Multiple Exams
- [ ] Take 3-5 mock exams
- [ ] Vary your scores (some pass, some fail)
- [ ] Flag different questions in each exam
- [ ] Mark different questions as important

#### Test 5.2: Verify Score Trend Chart
- [ ] Go to Progress page
- [ ] Verify score trend chart displays
- [ ] Check line connects all exam scores
- [ ] Verify pass line (65%) is shown
- [ ] Check color coding (green for pass, red for fail)
- [ ] Verify trend line shows improvement/decline

#### Test 5.3: Verify Performance Summary
- [ ] Check "Average Performance" card
- [ ] Verify progress bar shows correct percentage
- [ ] Check "Score Range" card shows:
  - [ ] Best score (highest percentage)
  - [ ] Worst score (lowest percentage)
  - [ ] Improvement trend (latest - oldest)

## 🐛 Error Testing

### Test 6.1: Invalid Firebase Credentials
- [ ] Temporarily change API key in `.env.local`
- [ ] Restart dev server
- [ ] Verify app falls back to localStorage
- [ ] Restore correct credentials

### Test 6.2: Network Errors
- [ ] Use browser DevTools to throttle network (Slow 3G)
- [ ] Try loading questions
- [ ] Try saving scores
- [ ] Verify graceful degradation

### Test 6.3: Firestore Quota Exceeded
- [ ] (Optional) Simulate by making many rapid requests
- [ ] Verify error handling
- [ ] Check fallback to localStorage

## ✅ Final Verification

### Checklist
- [ ] All questions load from Firebase
- [ ] All scores save to Firebase
- [ ] Navigation buttons are sticky and always visible
- [ ] Fallback to localStorage works
- [ ] No console errors
- [ ] Firebase Console shows correct data
- [ ] Progress page displays all features correctly
- [ ] Filtering works
- [ ] Expandable details work
- [ ] Delete operations work
- [ ] Score trend chart displays
- [ ] Performance summary is accurate

### Performance Check
- [ ] Page load time < 3 seconds
- [ ] Question navigation is smooth
- [ ] No lag when toggling score
- [ ] Smooth transitions for expandable details

### Browser Compatibility
- [ ] Test in Chrome
- [ ] Test in Firefox
- [ ] Test in Edge
- [ ] Test in Safari (if available)

## 📊 Expected Results

### Success Criteria
✅ All questions load from Firebase  
✅ All scores save to Firebase  
✅ Navigation buttons always visible  
✅ Fallback works when Firebase unavailable  
✅ No console errors  
✅ Data persists across page refreshes  
✅ Firebase Console shows correct data  

### Known Issues
- PowerShell execution policy prevents npm commands (use Git Bash)
- First Firebase call may be slow (cold start)
- Firestore rules must be set before app works

## 🎉 Testing Complete!

If all tests pass, your Firebase integration is working correctly! 🚀

---

**Next Steps:**
1. Add user authentication
2. Implement user-specific scores
3. Add real-time updates
4. Deploy to production

