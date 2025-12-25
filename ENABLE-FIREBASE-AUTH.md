# Enable Firebase Authentication - Step by Step Guide

## 🚨 IMPORTANT: You Must Complete This Before Testing

The error you're seeing:
```
POST https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=... 400 (Bad Request)
Firebase: Error (auth/configuration-not-found)
```

This means **Firebase Authentication is not enabled yet** in your Firebase Console. Follow these steps to fix it:

---

## 📋 Step-by-Step Instructions

### Step 1: Open Firebase Console

1. Go to: https://console.firebase.google.com/
2. You should see your project: **itil-3fb04**
3. Click on the project to open it

### Step 2: Navigate to Authentication

1. In the left sidebar, find and click **"Authentication"**
2. If you see a "Get Started" button, click it
3. If you already see the Authentication dashboard, proceed to Step 3

### Step 3: Enable Email/Password Authentication

1. Click on the **"Sign-in method"** tab at the top
2. You'll see a list of sign-in providers
3. Find **"Email/Password"** in the list
4. Click on it to open the configuration
5. You'll see two toggles:
   - **Enable** (this is the one you need)
   - Email link (passwordless sign-in) - leave this OFF for now
6. Toggle **"Enable"** to ON (it should turn blue/green)
7. Click **"Save"** button

### Step 4: Verify It's Enabled

1. You should now see "Email/Password" with a green "Enabled" status
2. The configuration is complete!

---

## 🔒 Step 5: Update Firestore Security Rules

Now that authentication is enabled, you need to update your Firestore security rules:

### Option A: Using Firebase Console (Recommended)

1. In Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab at the top
3. You'll see the current rules in an editor
4. **Delete all the existing rules**
5. Open the `firestore.rules` file in your project (in VS Code)
6. **Copy all the content** from that file
7. **Paste it** into the Firebase Console rules editor
8. Click **"Publish"** button
9. Wait for the confirmation message

### Option B: Using Firebase CLI

If you have Firebase CLI installed:

```bash
firebase deploy --only firestore:rules
```

---

## ✅ Step 6: Test the Application

Now you can test the authentication:

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   ```
   http://localhost:3000
   ```

3. **You should see the landing page** with Login and Sign Up buttons

4. **Click "Sign Up"** or navigate to `/register`

5. **Create a new account**:
   - Enter your name (e.g., "John Doe")
   - Enter your email (e.g., "john@example.com")
   - Create a password (minimum 6 characters)
   - Confirm your password
   - Click "Create Account"

6. **You should be automatically logged in** and redirected to the mock exam page

7. **Check your profile**:
   - Click on your name in the top-right corner
   - You should see your stats (0 exams taken, 0% best score)

8. **Take a mock exam**:
   - Answer some questions
   - Submit the exam
   - Your score should be saved

9. **Check your updated stats**:
   - Click on your name again
   - You should see "1 exam taken" and your score percentage

10. **Test logout**:
    - Click "Logout" from the profile dropdown
    - You should be redirected to the landing page

11. **Test login**:
    - Click "Login"
    - Enter your email and password
    - You should be logged in and redirected to the mock exam page

---

## 🎯 What's Protected Now

After enabling authentication, **ALL pages require login** except:
- `/` - Landing page (redirects to `/mock-exam` if logged in)
- `/login` - Login page
- `/register` - Registration page

**Protected pages** (require authentication):
- `/mock-exam` - Mock exam page
- `/progress` - Progress tracking page
- `/categories` - Categories page
- `/categories/[category]` - Category practice page
- `/flashcards` - Flashcards page
- `/practice` - Practice mode page
- `/study-guide` - Study guide page

If you try to access any protected page without being logged in, you'll be automatically redirected to the login page.

---

## 🐛 Troubleshooting

### Error: "auth/configuration-not-found"
**Solution**: You haven't enabled Email/Password authentication yet. Follow Steps 1-3 above.

### Error: "Permission denied" when saving scores
**Solution**: You haven't updated Firestore security rules yet. Follow Step 5 above.

### Error: "Can't see my exam scores"
**Solution**: Make sure you're logged in. Scores are now user-specific.

### Error: "Redirected to login page when accessing any page"
**Solution**: This is expected! All pages now require authentication. Create an account or login.

### Error: "Email already in use"
**Solution**: You've already created an account with this email. Use the login page instead.

### Error: "Password should be at least 6 characters"
**Solution**: Firebase requires passwords to be at least 6 characters long. Use a longer password.

---

## 📚 What Happens After You Enable Auth

1. **User Registration**:
   - Users can create accounts with email/password
   - User profiles are automatically created in Firestore
   - Users are automatically logged in after registration

2. **User Login**:
   - Users can login with their email/password
   - Session persists across page reloads
   - Users are redirected to the mock exam page after login

3. **Data Isolation**:
   - Each user only sees their own exam scores
   - Firestore rules enforce server-side security
   - No user can access another user's data

4. **Automatic Stats Tracking**:
   - Exams taken counter increments on each exam
   - Best score updates when user improves
   - Stats are visible in the user profile dropdown

5. **Protected Routes**:
   - All pages require authentication
   - Unauthenticated users are redirected to login
   - After login, users are redirected back to the page they tried to access

---

## ✨ Summary

**Before you can use the app, you MUST:**
1. ✅ Enable Email/Password authentication in Firebase Console (Steps 1-3)
2. ✅ Update Firestore security rules (Step 5)
3. ✅ Test the application (Step 6)

**After completing these steps:**
- Authentication will work perfectly
- Users can create accounts and login
- All exam scores will be saved with user IDs
- Each user will only see their own data
- The app is secure and ready to use!

---

**Need help?** Check the other documentation files:
- `AUTHENTICATION-GUIDE.md` - Complete implementation details
- `AUTH-QUICK-START.md` - Quick start guide
- `IMPLEMENTATION-SUMMARY.md` - Full summary of changes

---

**Ready to enable authentication?** Start with Step 1 above! 🚀

