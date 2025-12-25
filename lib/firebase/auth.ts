// Firebase Authentication Services
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
  UserCredential,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "./config";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

// User profile interface
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: any;
  lastLogin: any;
  examsTaken?: number;
  bestScore?: number;
}

/**
 * Register a new user with email and password
 */
export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Create user account
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: displayName,
    });

    // Create user profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      examsTaken: 0,
      bestScore: 0,
    });

    // Send email verification
    await sendEmailVerification(user);

    return { success: true, user };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Login user with email and password
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Update last login time
    await setDoc(
      doc(db, "users", user.uid),
      {
        lastLogin: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true, user };
  } catch (error: any) {
    console.error("Login error:", error);
    
    // Provide user-friendly error messages
    let errorMessage = error.message;
    if (error.code === "auth/user-not-found") {
      errorMessage = "No account found with this email.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address.";
    } else if (error.code === "auth/user-disabled") {
      errorMessage = "This account has been disabled.";
    }
    
    return { success: false, error: errorMessage };
  }
}

/**
 * Logout current user
 */
export async function logoutUser(): Promise<{ success: boolean; error?: string }> {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    console.error("Logout error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(
  uid: string
): Promise<{ success: boolean; profile?: UserProfile; error?: string }> {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, profile: docSnap.data() as UserProfile };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error: any) {
    console.error("Get profile error:", error);
    return { success: false, error: error.message };
  }
}

