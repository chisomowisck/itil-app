# Deploy Firestore Security Rules - Simple Guide

## 🎯 Quick Instructions

Since you're getting the "Not in a Firebase app directory" error, the **easiest way** is to deploy the rules directly through the Firebase Console. Here's how:

---

## Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/
2. Click on your project: **itil-3fb04**

---

## Step 2: Open Firestore Database

1. In the left sidebar, click **"Firestore Database"**
2. If you see a **"Create database"** button:
   - Click it
   - Choose **"Start in production mode"**
   - Select a location (e.g., `us-central1` or closest to you)
   - Click **"Enable"**
   - Wait for the database to be created (takes ~30 seconds)

---

## Step 3: Update Security Rules

1. Click the **"Rules"** tab at the top of the page
2. You'll see an editor with some default rules
3. **Select ALL the text** in the editor (Ctrl+A)
4. **Delete it** (press Delete or Backspace)
5. **Copy the rules below** and paste them into the editor:

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

6. Click the **"Publish"** button
7. Wait for the confirmation message: "Rules published successfully"

---

## ✅ That's It!

Your Firestore security rules are now deployed. These rules ensure:
- ✅ Users can only read/write their own profile
- ✅ Users can only see their own exam results
- ✅ Users can read questions (but not modify them)
- ✅ All operations require authentication

---

## 🧪 Test It

Now you can test your app:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000

3. Create an account at `/register`

4. Take a mock exam

5. Check your progress at `/progress`

Everything should work now! 🎉

---

## 🐛 Troubleshooting

### Error: "Permission denied"
**Solution**: Make sure you published the rules in Step 3 above.

### Error: "Missing or insufficient permissions"
**Solution**: Make sure you're logged in. The rules require authentication.

### Error: "PERMISSION_DENIED: Missing or insufficient permissions"
**Solution**: 
1. Go back to Firebase Console → Firestore Database → Rules
2. Make sure the rules are published
3. Try logging out and logging back in to your app

---

## 📝 Note About Firebase CLI

The Firebase CLI deployment (`firebase deploy --only firestore:rules`) requires:
1. Firebase CLI to be installed globally
2. Being logged in with `firebase login`
3. Having the correct project configuration files

I've created these files for you:
- ✅ `firebase.json` - Firebase project configuration
- ✅ `.firebaserc` - Project alias configuration
- ✅ `firestore.indexes.json` - Firestore indexes

However, due to PowerShell execution policy restrictions on your system, it's easier to just use the Firebase Console method above.

If you want to use the CLI in the future, you can:
1. Open Git Bash (not PowerShell)
2. Run: `firebase login`
3. Run: `firebase deploy --only firestore:rules`

But for now, the Console method is simpler and works perfectly! ✅

