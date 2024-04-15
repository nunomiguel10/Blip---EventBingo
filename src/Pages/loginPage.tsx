import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

import { UserPage } from './userPage.tsx';

import { auth } from '../Firebase.ts';

export const LoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Erro ao fazer login com o Google:', error);
        }
    };

    if (isLoggedIn) {
        return <UserPage />;
    }

    return (
        <div className="pt-36 w-full flex">
            <button onClick={handleGoogle} className="mx-auto border-4 bg-green-500">
                Sign In With Google
            </button>
        </div>
    );
};
