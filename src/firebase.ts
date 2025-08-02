import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
const firebaseConfig = {
  apiKey: 'AIzaSyAxs2AAoL7WohN0Km486lNZeSJSyUiAaos',
  authDomain: 'suilift-2e123.firebaseapp.com',
  projectId: 'suilift-2e123',
  storageBucket: 'suilift-2e123.firebasestorage.app',
  messagingSenderId: '52947305726',
  appId: '1:52947305726:web:657b3000178fece25ed1af',
  measurementId: 'G-Y7FCLMGMPB',
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
