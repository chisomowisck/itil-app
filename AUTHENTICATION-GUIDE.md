# Authentication Implementation Guide

## 🔐 Overview

The ITIL Mock Exam app now includes complete user authentication with Firebase Auth. Users must create an account and login to take exams and track their progress.

## ✅ What Was Implemented

### 1. **Firebase Authentication Setup**
- Email/password authentication
- User profile management
- Session persistence
- Email verification support

### 2. **Authentication Pages**
- `/login` - User login page
- `/register` - User registration page
- Forgot password support (ready for implementation)

### 3. **Protected Routes**
- Mock exam page requires authentication
- Progress page requires authentication
- Automatic redirect to login if not authenticated

### 4. **User Profile Component**
- Displays user name and email
- Shows exam statistics (exams taken, best score)
- Quick navigation to progress and exam pages
- Logout functionality

### 5. **User-Specific Data**
- Each user's exam scores are isolated
- Users can only see their own exam history
- Firestore security rules enforce data privacy

### 6. **Automatic Stats Tracking**
- Exams taken counter
- Best score tracking
- Last login timestamp
- Profile creation date

## 📁 Files Created

```
lib/firebase/auth.ts                    # Authentication services
contexts/AuthContext.tsx                # Auth state management
components/auth/LoginForm.tsx           # Login form component
components/auth/RegisterForm.tsx        # Registration form component
components/auth/UserProfile.tsx         # User profile dropdown
components/auth/ProtectedRoute.tsx      # Route protection wrapper
app/login/page.tsx                      # Login page
app/register/page.tsx                   # Registration page
firestore.rules                         # Security rules
AUTHENTICATION-GUIDE.md                 # This file
```

## 📝 Files Modified

```
lib/firebase/config.ts                  # Added Auth initialization
lib/firebase/services.ts                # Added user stats update
app/layout.tsx                          # Added AuthProvider
app/mock-exam/page.tsx                  # Added auth protection & userId
app/progress/page.tsx                   # Added auth protection & filtering
```

## 🚀 How to Enable Authentication

### Step 1: Enable Firebase Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **itil-3fb04**
3. Click **Authentication** in the left sidebar
4. Click **Get Started**
5. Click **Email/Password** under Sign-in method
6. Toggle **Enable**
7. Click **Save**

### Step 2: Update Firestore Security Rules

1. Go to **Firestore Database** → **Rules**
2. Copy the rules from `firestore.rules` file
3. Paste into the Firebase Console
4. Click **Publish**

The new rules ensure:
- Only authenticated users can access data
- Users can only read/write their own exam scores
- Questions are read-only for all authenticated users
- User profiles are private to each user

### Step 3: Test the Authentication Flow

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/register`

3. Create a new account:
   - Enter your name
   - Enter your email
   - Create a password (min 6 characters)
   - Confirm password
   - Click "Create Account"

4. You'll be automatically logged in and redirected to the mock exam page

5. Take an exam and verify:
   - Your score is saved
   - Your profile shows updated stats
   - You can see your exam history in the progress page

## 🔒 Security Features

### Firestore Security Rules

```javascript
// Questions - Read-only for authenticated users
match /questions/{questionId} {
  allow read: if isAuthenticated();
  allow write: if false;
}

// User Profiles - Private to each user
match /users/{userId} {
  allow read, write: if isOwner(userId);
}

// Exam Scores - User-specific access
match /examScores/{scoreId} {
  allow read: if resource.data.userId == request.auth.uid;
  allow create: if request.resource.data.userId == request.auth.uid;
  allow update, delete: if resource.data.userId == request.auth.uid;
}
```

### Data Isolation

- Each exam score includes `userId` field
- API routes filter by `userId` automatically
- Users cannot access other users' data
- Firestore rules enforce server-side validation

## 📊 User Profile Structure

```typescript
{
  uid: string;              // Firebase Auth UID
  email: string;            // User email
  displayName: string;      // User's full name
  createdAt: Timestamp;     // Account creation date
  lastLogin: Timestamp;     // Last login time
  examsTaken: number;       // Total exams completed
  bestScore: number;        // Best exam percentage
}
```

## 🎨 User Experience Flow

### New User Journey

1. **Landing** → User visits the app
2. **Register** → Creates account at `/register`
3. **Email Verification** → Receives verification email (optional)
4. **Auto Login** → Automatically logged in after registration
5. **Take Exam** → Redirected to mock exam page
6. **Track Progress** → View personal exam history

### Returning User Journey

1. **Landing** → User visits the app
2. **Login** → Logs in at `/login`
3. **Dashboard** → Access to mock exam and progress pages
4. **Profile** → View stats in user profile dropdown
5. **Logout** → Securely logout when done

## 🔧 Authentication API

### Register User

```typescript
import { registerUser } from '@/lib/firebase/auth';

const result = await registerUser(email, password, displayName);
if (result.success) {
  // User registered and logged in
  console.log(result.user);
} else {
  // Handle error
  console.error(result.error);
}
```

### Login User

```typescript
import { loginUser } from '@/lib/firebase/auth';

const result = await loginUser(email, password);
if (result.success) {
  // User logged in
  console.log(result.user);
} else {
  // Handle error
  console.error(result.error);
}
```

### Logout User

```typescript
import { logoutUser } from '@/lib/firebase/auth';

const result = await logoutUser();
if (result.success) {
  // User logged out
} else {
  // Handle error
  console.error(result.error);
}
```

### Get User Profile

```typescript
import { getUserProfile } from '@/lib/firebase/auth';

const result = await getUserProfile(userId);
if (result.success) {
  console.log(result.profile);
}
```

## 🎯 Using Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, userProfile, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  
  return (
    <div>
      <h1>Welcome, {userProfile?.displayName}!</h1>
      <p>Exams taken: {userProfile?.examsTaken}</p>
      <p>Best score: {userProfile?.bestScore}%</p>
    </div>
  );
}
```

## 🛡️ Protected Routes

```typescript
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute>
      <MyPageContent />
    </ProtectedRoute>
  );
}
```

## 📈 Automatic Stats Updates

When a user completes an exam:

1. Exam score is saved with `userId`
2. User profile is automatically updated:
   - `examsTaken` increments by 1
   - `bestScore` updates if new score is higher
3. Stats are visible in user profile dropdown
4. Progress page shows user-specific history

## 🐛 Troubleshooting

### Issue: "Authentication not enabled"
**Solution**: Enable Email/Password authentication in Firebase Console

### Issue: "Permission denied"
**Solution**: Update Firestore security rules from `firestore.rules` file

### Issue: "User not redirected after login"
**Solution**: Check that AuthProvider is wrapping the app in `app/layout.tsx`

### Issue: "Can't see exam scores"
**Solution**: Make sure you're logged in and scores have `userId` field

### Issue: "Email verification not working"
**Solution**: Configure email templates in Firebase Console → Authentication → Templates

## 🔜 Future Enhancements

- [ ] Password reset functionality
- [ ] Social authentication (Google, GitHub)
- [ ] Email verification requirement
- [ ] User profile editing
- [ ] Avatar upload
- [ ] Admin dashboard
- [ ] User roles and permissions
- [ ] Two-factor authentication

## ✅ Testing Checklist

- [ ] Enable Firebase Authentication
- [ ] Update Firestore security rules
- [ ] Create a new account
- [ ] Login with existing account
- [ ] Take a mock exam
- [ ] Verify score is saved
- [ ] Check user profile stats
- [ ] View progress page
- [ ] Logout
- [ ] Try accessing protected pages (should redirect to login)
- [ ] Login again and verify data persists

---

**Authentication is now fully implemented!** 🎉

Users can create accounts, login, take exams, and track their personal progress securely.

