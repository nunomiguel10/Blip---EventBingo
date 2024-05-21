import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { doc, setDoc, getDoc /*where*/ } from 'firebase/firestore';

import { UserPage } from './userPage.tsx';

import db, { auth } from '../Firebase.ts';

import './loginPage.scss';

export const LoginPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleGoogle = async () => {
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
    //else {
    //     return <LoginPage />;
    // }

    return (
        <div className="container_login">
            <div className="login-content">
                {/* Coloque seu logotipo aqui */}
                <img src="images/logo.png" alt="Logo" className="logo" />

                {/* Botão de login */}
                <button onClick={handleGoogle} className="butao_signin">
                    <span className="google-icon"> </span>Sign In With Google
                </button>
            </div>
        </div>
    );
};
