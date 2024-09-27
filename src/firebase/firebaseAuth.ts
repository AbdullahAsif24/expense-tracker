
import { app } from './firebaseconfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification } from "firebase/auth";

export const auth = getAuth(app);


export function signupWithEmailPassword(email: string, password: string) {

    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user, 'user created successfully.');
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
            throw new Error(errorMessage);
            // ..
        });
}


export function loginWithEmailPassword(email: string, password: string) {

    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user, 'user')
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorMessage);
            throw new Error(errorMessage)
        });
}


export function SignOutFunc(auth: any) {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        // An error happened.
    });
}



export function EmailVerificationFunc() {
    const crruser = auth.currentUser;
    if (crruser) {
        return sendEmailVerification(crruser).then(() => {
            // Email sent.
            console.log('Verification email sent!');
        }).catch((error) => {
            // An error happened.
            throw new Error(error);
        });
    }
}