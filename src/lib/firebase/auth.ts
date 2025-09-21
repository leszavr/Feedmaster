
import { 
    getAuth, 
    signInWithEmailAndPassword,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { app } from './client-app';

const auth = getAuth(app);

export const signInWithEmail = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

export const signOut = async () => {
    return firebaseSignOut(auth);
}
