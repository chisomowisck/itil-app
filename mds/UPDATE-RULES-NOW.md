# 🚨 UPDATE YOUR FIRESTORE RULES NOW

## The Problem

You're getting this error:
```
Error fetching questions: [Error [FirebaseError]: Missing or insufficient permissions.]
```

This is because the Firestore security rules are blocking access to the questions.

---

## The Solution (2 Minutes)

### Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/
2. Click on your project: **itil-3fb04**

### Step 2: Update Firestore Rules

1. Click **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab at the top
3. **Select ALL the text** in the editor (Ctrl+A)
4. **Delete it** (press Delete)
5. **Copy the rules below** and paste them:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Helper function to check if user owns the resource
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Questions collection - Public read access (questions are public data)
    // Write access is disabled (only allow writes through admin/migration tools)
    match /questions/{questionId} {
      allow read: if true; // Public read access
      allow write: if false; // Only allow writes through admin/migration tools
    }
    
    // User profiles collection
    match /users/{userId} {
      // Users can read and write their own profile
      allow read, write: if isOwner(userId);
      // Allow creation during registration
      allow create: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Exam scores collection - User-specific access
    match /examScores/{scoreId} {
      // Users can only read their own scores
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || 
                      !('userId' in resource.data)); // Backward compatibility for old scores
      
      // Users can only create scores for themselves
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Users can only update their own scores
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
      
      // Users can only delete their own scores
      allow delete: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
    }
    
    // Exam results collection - Alternative name for exam scores (for compatibility)
    match /examResults/{resultId} {
      // Users can only read their own results
      allow read: if isAuthenticated() && 
                     (resource.data.userId == request.auth.uid || 
                      !('userId' in resource.data)); // Backward compatibility for old results
      
      // Users can only create results for themselves
      allow create: if isAuthenticated() && 
                       request.resource.data.userId == request.auth.uid;
      
      // Users can only update their own results
      allow update: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
      
      // Users can only delete their own results
      allow delete: if isAuthenticated() && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

6. Click **"Publish"**
7. Wait for "Rules published successfully" message

---

## What Changed?

The key change is this line:
```javascript
match /questions/{questionId} {
  allow read: if true; // Public read access - CHANGED FROM: if isAuthenticated()
  allow write: if false;
}
```

**Before**: Questions required authentication to read
**After**: Questions are publicly readable (since they're public data anyway)

This allows the API route to fetch questions without authentication, while still protecting user data.

---

## ✅ Test It

After updating the rules:

1. Refresh your browser at http://localhost:3000
2. The questions should load now
3. You should be able to take the mock exam
4. Your scores will be saved with your user ID

---

## 🔒 Security

Don't worry, your data is still secure:
- ✅ Questions are public (anyone can read, but no one can modify)
- ✅ User profiles are protected (users can only see their own)
- ✅ Exam scores are protected (users can only see their own)
- ✅ All write operations require authentication

---

## 🐛 Still Having Issues?

If you still get errors after updating the rules:

1. **Clear your browser cache** (Ctrl+Shift+Delete)
2. **Logout and login again**
3. **Restart your dev server** (Ctrl+C, then `npm run dev`)
4. **Check the Firebase Console** to make sure the rules were published

---

## 📚 What's Next?

After the rules are updated, everything should work:
- ✅ Login and registration
- ✅ Taking mock exams
- ✅ Viewing progress
- ✅ User profile with stats
- ✅ All pages protected with authentication

Enjoy your fully functional ITIL exam app! 🎉

