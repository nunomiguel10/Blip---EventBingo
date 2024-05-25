//@ts-nocheck
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { NavBar } from '../components/navbar/navbar';
import db from '../Firebase';
import { Card } from '../components/card/card';

export const CardsPage = () => {
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        const fetchBingoCards = async () => {
            const user = auth.currentUser;

            if (user) {
                setIsLoading(true);

                try {
                    // Obtenha o documento do usuário
                    const userDocRef = doc(db, 'Utilizador', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        const cardIds = userData.cartões || [];

                        // Obtenha os cartões de Bingo associados ao usuário
                        const cardPromises = cardIds.map(async cardId => {
                            const cardDocRef = doc(db, 'BingoCards', cardId);
                            const cardDocSnap = await getDoc(cardDocRef);

                            return { id: cardDocRef.id, ...cardDocSnap.data() };
                        });

                        const cards = await Promise.all(cardPromises);

                        setBingoCards(cards);
                    }
                } catch (error) {
                    console.error('Erro ao buscar os cartões do usuário:', error);
                }

                setIsLoading(false);
            }
        };

        fetchBingoCards();
    }, [auth]);

    return (
        <>
            <NavBar />
            {isLoading && (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {!isLoading && (
                <div>
                    <div className="row justify-content-center">
                        {bingoCards.length > 0 ? <Card bingoCards={bingoCards} showBuyButton={false} /> : <p>Nenhum cartão de Bingo encontrado.</p>}
                    </div>
                </div>
            )}
        </>
    );
};
