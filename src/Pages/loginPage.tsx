//@ts-nocheck
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { UserPage } from './userPage.tsx';

import db, { auth } from '../Firebase.ts';

import './loginPage.scss';

export const LoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleGoogle = async event => {
        event.preventDefault();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);

            if (result && result.user) {
                const user = result.user;

                // Referência ao documento do utilizador no Firestore
                const userDocRef = doc(db, 'Utilizador', user.uid);

                // Verifica se o documento do utilizador já existe
                const userDoc = await getDoc(userDocRef);

                if (!userDoc.exists()) {
                    // Cria um novo documento para o utilizador
                    await setDoc(userDocRef, {
                        uid: user.uid,
                        name: user.displayName,
                        email: user.email,
                        cartões: [],
                        creditos: 50000,
                        role: 'Cliente'
                    });
                }

                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    if (isLoggedIn) {
        return <UserPage />;
    }

    return (
        <div className="container_login">
            <main className="form-signin">
                <form>
                    <img src="images/logo.png" alt="Logo" className="logo mb-4" />
                    <button onClick={handleGoogle} className="w-100 btn btn-lg btn-primary google-button">
                        <img src="https://freesvg.org/img/1534129544.png" alt="Google Icon" className="google-icon" />
                        <span className="button-text">Inicie sessão com o Google</span>
                    </button>
                </form>
            </main>
        </div>
    );
};
