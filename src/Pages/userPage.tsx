//@ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, doc, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import db from '../Firebase.ts';
import { Card } from '../components/card/card';
import { NavBar } from '../components/navbar/navbar';

import './userPage.scss';

export const UserPage = () => {
    const navigate = useNavigate();
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth();

    const handleClick = () => {
        navigate('/bingocardcreatepage');
    };

    useEffect(() => {
        const unsubscribeFromAuth = onAuthStateChanged(auth, user => {
            if (user) {
                const userDocRef = doc(db, 'Utilizador', user.uid);
                const unsubscribeFromSnapshot = onSnapshot(
                    userDocRef,
                    userDoc => {
                        if (userDoc.exists()) {
                            const userData = userDoc.data();

                            setIsAdmin(userData.role === 'Admin');
                        } else {
                            setIsAdmin(false);
                        }
                    },
                    error => {
                        console.error('Error fetching user role:', error);
                    }
                );

                return () => {
                    unsubscribeFromSnapshot();
                };
            } else {
                setIsAdmin(false);
            }
        });

        return () => {
            unsubscribeFromAuth();
        };
    }, [auth]);

    useEffect(() => {
        const collectionRef = collection(db, 'BingoCards');
        const queryToDataBase = query(collectionRef, where('isActive', '==', true));

        setIsLoading(true);
        const unsub = onSnapshot(queryToDataBase, querySnapshot => {
            const items = [];

            // eslint-disable-next-line @typescript-eslint/no-shadow
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            });
            setBingoCards(items);
            setIsLoading(false);
        });

        return () => {
            unsub();
        };
    }, []);

    return (
        <>
            <NavBar />
            <div className="container_user_page">
                <div>
                    {isAdmin && (
                        <button className="btn btn-primary rounded-pill px-3" onClick={handleClick}>
                            Adicionar cartão
                        </button>
                    )}
                </div>
                <div className="row justify-content-center">
                    {isLoading ? (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : (
                        <Card bingoCards={bingoCards} />
                    )}
                </div>
            </div>
        </>
    );
};
