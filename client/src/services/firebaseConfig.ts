import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getFunctions, Functions } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
};

// Check if Firebase is properly configured
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId && 
  firebaseConfig.storageBucket && 
  firebaseConfig.messagingSenderId && 
  firebaseConfig.appId &&
  firebaseConfig.apiKey !== '' &&
  firebaseConfig.authDomain !== '';

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let functions: Functions | null = null;

// Initialize Firebase only if properly configured
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    functions = getFunctions(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.warn('🔧 Firebase initialization failed, using offline mode:', error);
    app = null;
    db = null;
    auth = null;
    functions = null;
  }
} else {
  console.warn('🔧 Firebase not configured - using offline mode');
  console.warn('To enable Firebase: Set VITE_FIREBASE_API_KEY and other required environment variables');
}

// Export Firebase services (may be null if not configured)
export { db, auth, functions, isFirebaseConfigured };
export default app;