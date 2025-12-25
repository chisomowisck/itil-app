# Quick Reference Card

## 🚀 Getting Started (3 Steps)

### 1. Install Firebase
```bash
# Open Git Bash (not PowerShell)
npm install firebase
```

### 2. Set Up Firestore
1. Go to https://console.firebase.google.com/
2. Select project: **itil-3fb04**
3. Create Firestore Database
4. Copy these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /questions/{questionId} {
      allow read: if true;
      allow write: if false;
    }
    match /examScores/{scoreId} {
      allow read, write, delete: if true;
    }
  }
}
```

### 3. Migrate Questions
```bash
npm run dev
# Then go to: http://localhost:3000/admin/migrate
# Click "Start Migration"
```

## 📁 Files Created

```
.env.local                          # Firebase credentials
lib/firebase/config.ts              # Firebase init
lib/firebase/services.ts            # CRUD operations
app/api/questions/route.ts          # Questions API
app/api/exam-scores/route.ts        # Scores API
app/admin/migrate/page.tsx          # Migration UI
```

## 🔧 API Endpoints

```
GET    /api/questions              → Get all questions
POST   /api/questions              → Upload questions
GET    /api/exam-scores            → Get all scores
POST   /api/exam-scores            → Save score
DELETE /api/exam-scores?id={id}   → Delete score
```

## 🎯 Key Features

### ✅ Firebase Integration
- Questions stored in Firestore
- Exam scores stored in Firestore
- Automatic fallback to localStorage
- Real-time sync across devices

### ✅ UI Improvements
- **Sticky navigation** - Always visible
- **Live score tracking** - Toggle with eye icon
- **Expandable details** - Click chevron to see questions
- **Score trend chart** - Visual progress tracking
- **Advanced filtering** - All/Passed/Failed/Flagged/Important

### ✅ Complete Data Storage
Every exam stores:
- All 40 questions with answers
- Which questions were flagged
- Which questions were important
- Correct/incorrect status
- Category breakdown
- Time spent

## 🔄 How It Works

```
User → Next.js Page → API Route → Firebase Service → Firestore
  ↓                                                      ↓
Fallback ←─────────────────────────────────────── Success/Fail
  ↓
localStorage
```

## 📊 Firestore Collections

### questions
```json
{
  "id": 1,
  "question": "What is ITIL?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0,
  "category": "Foundations",
  "explanation": "...",
  "createdAt": "2024-12-24T10:00:00Z"
}
```

### examScores
```json
{
  "date": "2024-12-24T10:00:00Z",
  "score": 30,
  "percentage": 75,
  "passed": true,
  "questionResults": [...],
  "createdAt": "2024-12-24T10:00:00Z"
}
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| npm fails | Use Git Bash, not PowerShell |
| Questions not loading | Run migration at `/admin/migrate` |
| Permission denied | Update Firestore rules |
| Env vars not loaded | Restart dev server |

## 📚 Documentation

- **FIREBASE-SETUP-GUIDE.md** - Complete setup
- **TESTING-CHECKLIST.md** - Testing steps
- **COMPLETE-IMPLEMENTATION-SUMMARY.md** - Full details

## ✅ Testing Checklist

- [ ] Install Firebase: `npm install firebase`
- [ ] Set up Firestore database
- [ ] Configure security rules
- [ ] Migrate questions
- [ ] Take a mock exam
- [ ] Check Firebase Console
- [ ] Verify score saves
- [ ] Test navigation (sticky buttons)
- [ ] Test progress page
- [ ] Test filtering
- [ ] Test expandable details

## 🎉 You're Done!

Your app now has:
- ☁️ Cloud storage
- 📱 Sticky navigation
- 📊 Complete history
- 🔄 Auto fallback
- 🎯 Full details

**Start using:** `npm run dev` → `http://localhost:3000`

---

**Need help?** Check the full documentation files!

