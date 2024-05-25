//@ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query } from 'firebase/firestore';

import db from '../Firebase.ts';
import { Card } from '../components/card/card';
import { NavBar } from '../components/navbar/navbar';

import './userPage.scss';

export const UserPage = () => {
    const navigate = useNavigate();
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        navigate('/bingocardcreatepage');
    };

    useEffect(() => {
        const collectionRef = collection(db, 'BingoCards');
        const queryToDataBase = query(collectionRef);

        setIsLoading(true);
        const unsub = onSnapshot(queryToDataBase, querySnapshot => {
            const items = [];

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
                    <button className="button_userpage" onClick={handleClick}>
                        Adicionar cartão
                    </button>
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
