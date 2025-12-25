# Quick Start Guide - User Authentication

## 🚀 Get Started in 3 Steps

### Step 1: Enable Firebase Authentication (2 minutes)

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **itil-3fb04**
3. Click **Authentication** in the left sidebar
4. Click **Get Started** button
5. Click **Email/Password** under "Sign-in method"
6. Toggle **Enable** switch
7. Click **Save**

✅ **Done!** Email/password authentication is now enabled.

---

### Step 2: Update Firestore Security Rules (1 minute)

1. In Firebase Console, click **Firestore Database** in the left sidebar
2. Click the **Rules** tab at the top
3. Open the `firestore.rules` file in your project
4. Copy all the rules
5. Paste into the Firebase Console rules editor
6. Click **Publish**

✅ **Done!** Your data is now secure and user-specific.

---

### Step 3: Test the Application (5 minutes)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   ```
   http://localhost:3000
   ```

3. **Create a new account:**
   - Click "Get Started" or navigate to `/register`
   - Enter your name, email, and password
   - Click "Create Account"
   - You'll be automatically logged in!

4. **Take a mock exam:**
   - You'll be redirected to the mock exam page
   - Answer some questions
   - Submit the exam
   - See your score!

5. **Check your profile:**
   - Click your name in the top-right corner
   - See your stats (exams taken, best score)
   - Navigate to progress page
   - View your exam history

6. **Test logout and login:**
   - Click "Logout" from the profile dropdown
   - Click "Login" from the home page
   - Enter your credentials
   - You're back in!

✅ **Done!** Authentication is working perfectly.

---

## 🎯 What You Can Do Now

### As a User
- ✅ Create an account
- ✅ Login securely
- ✅ Take mock exams
- ✅ Track your progress
- ✅ View your exam history
- ✅ See your best score
- ✅ Count total exams taken
- ✅ Logout safely

---

## 📚 Documentation

- **`AUTHENTICATION-GUIDE.md`** - Complete implementation guide
- **`IMPLEMENTATION-SUMMARY.md`** - Full summary of all changes
- **`firestore.rules`** - Security rules with comments

---

## 🔒 Security

Your app is now secure with:
- ✅ Email/password authentication
- ✅ User-specific data isolation
- ✅ Firestore security rules
- ✅ Server-side validation
- ✅ Protected routes
- ✅ Session persistence

---

## 🐛 Troubleshooting

### "Authentication not enabled"
**Solution:** Complete Step 1 above to enable Email/Password authentication in Firebase Console.

### "Permission denied"
**Solution:** Complete Step 2 above to update Firestore security rules.

### "Can't see my exam scores"
**Solution:** Make sure you're logged in. Scores are now user-specific.

### "Redirected to login page"
**Solution:** This is expected! Mock exam and progress pages now require authentication.

---

## 🎉 You're All Set!

Your ITIL Mock Exam app now has complete user authentication!

**Next Steps:**
1. Enable Firebase Authentication (Step 1)
2. Update Firestore Security Rules (Step 2)
3. Test the application (Step 3)
4. Start using the app!

**Need Help?**
- Check `AUTHENTICATION-GUIDE.md` for detailed information
- Review `IMPLEMENTATION-SUMMARY.md` for all changes

---

**Happy Studying!** 📚✨

