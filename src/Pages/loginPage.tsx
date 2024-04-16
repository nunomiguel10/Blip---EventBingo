import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';

import { UserPage } from './userPage.tsx';

import { auth } from '../Firebase.ts';

import './loginPage.scss';

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
        <div className="container">
            <div className="flex justify-center items-center h-screen">
                <button onClick={handleGoogle} className="butao_signin">
                    <span className="google-icon"> </span>Sign In With Google
                </button>
            </div>
        </div>
    );
};
