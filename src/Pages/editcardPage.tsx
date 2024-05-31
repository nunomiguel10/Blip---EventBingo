//@ts-nocheck
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';

import db from '../Firebase.ts';
import { NavBar } from '../components/navbar/navbar';
import { Bingo } from '../components/Bingo/Bingo';

import './editcardPage.scss';

export const EditCardPage = () => {
    const location = useLocation();
    const { card } = location.state || {};
    const navigate = useNavigate();
    const [checks, setChecks] = useState(card.checks || Array(card.gridSize.rows * card.gridSize.cols).fill(false));

    useEffect(() => {
        const loadChecks = async () => {
            const cardRef = doc(db, 'BingoCards', card.id);
            const cardDoc = await cardRef.get();

            if (cardDoc.exists()) {
                const data = cardDoc.data();

                if (data.checks) {
                    setChecks(data.checks);
                }
            }
        };

        loadChecks();
    }, [card.id]);

    const handleClickBack = () => {
        navigate('/userPage');
    };

    const handleCheckToggle = async (index, value) => {
        const updatedChecks = [...checks];

        updatedChecks[index] = value;
        setChecks(updatedChecks);

        const cardRef = doc(db, 'BingoCards', card.id);

        try {
            await updateDoc(cardRef, { checks: updatedChecks });
        } catch (error) {
            console.error('Erro ao atualizar os checks no Firestore:', error);
        }
    };

    const handleFinishCard = async () => {
        const allTrue = checks.every(check => check === true);

        if (allTrue) {
            const usersRef = collection(db, 'Utilizador');
            const q = query(usersRef, where('cartões', 'array-contains', card.id));
            const querySnapshot = await getDocs(q);

            try {
                // Atualizar os documentos individualmente
                querySnapshot.forEach(async userDoc => {
                    const userRef = doc(db, 'Utilizador', userDoc.id); // Corrigido
                    const userData = userDoc.data();
                    const newCredits = (userData.creditos || 0) + card.valor * 3;

                    try {
                        await updateDoc(userRef, { creditos: newCredits });
                    } catch (error) {
                        console.error('Erro ao atribuir créditos extras ao usuário:', userDoc.id, error);
                    }
                });
            } catch (error) {
                console.error('Erro ao atribuir créditos extras:', error);
            }
        }
    };

    return (
        <>
            <NavBar />
            <div className="edit-card-container">
                <div className="card card-spacing text-center">
                    <div className="card-body">
                        <Bingo
                            events={card.events}
                            results={card.results}
                            gridSize={card.gridSize}
                            checks={checks}
                            onCheckToggle={handleCheckToggle}
                            showCheckButtons
                        />
                        <h5 className="card-value">Custo: {card.valor} créditos</h5>
                        <h5 className="card-winnings">Ganhos Possíveis: {card.valor * 3} créditos</h5>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleFinishCard}>
                Finalizar Cartão
            </button>
            <button className="btn btn-primary mt-3" onClick={handleClickBack}>
                Voltar
            </button>
        </>
    );
};
