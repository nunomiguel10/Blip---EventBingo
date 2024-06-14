//@ts-nocheck
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateDoc, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';

import db from '../Firebase.ts';
import { NavBar } from '../components/navbar/navbar';
import { Bingo } from '../components/Bingo/Bingo';

import './editcardPage.scss';

export const EditCardPage = () => {
    const location = useLocation();
    const { card } = location.state || {};
    const navigate = useNavigate();
    const [eventFinalResult, setEventFinalResult] = useState(card.eventFinalResult || Array(card.gridSize.rows * card.gridSize.cols).fill(false));

    useEffect(() => {
        // Vai à base de dados buscar os documentos da coleção "BingoCards"
        const loadEventFinalResult = async () => {
            const cardRef = doc(db, 'BingoCards', card.id);
            const cardDoc = await cardRef.get();

            if (cardDoc.exists()) {
                const data = cardDoc.data();

                if (data.eventFinalResult) {
                    setEventFinalResult(data.eventFinalResult);
                }
            }
        };

        loadEventFinalResult();
    }, [card.id]);

    const handleClickBack = () => {
        navigate('/userPage');
    };

    // Função para atualizar o estado do resultado final
    const handleCheckToggle = async (index, value) => {
        const updatedeventFinalResult = [...eventFinalResult];

        updatedeventFinalResult[index] = value;
        setEventFinalResult(updatedeventFinalResult);

        const cardRef = doc(db, 'BingoCards', card.id);

        try {
            await updateDoc(cardRef, { eventFinalResult: updatedeventFinalResult });
        } catch (error) {
            console.error('Erro ao atualizar os eventFinalResult no Firestore:', error);
        }
    };

    const handleFinishCard = async () => {
        const rows = card.gridSize.rows;
        const cols = card.gridSize.cols;
        const totalCells = rows * cols;
        const cellsPerRow = cols;

        const markedRows = new Set();

        // Verifica quais as linhas que estão marcadas
        for (let i = 0; i < totalCells; i += cellsPerRow) {
            let isRowMarked = true;

            for (let j = 0; j < cellsPerRow; j++) {
                if (!eventFinalResult[i + j]) {
                    isRowMarked = false;
                    break;
                }
            }
            if (isRowMarked) {
                markedRows.add(i);
            }
        }

        // Calcula os créditos com base nas linhas marcadas
        let extraCredits = 0;

        if (markedRows.size === 1) {
            // Se apenas uma linha do cartão estiver marcada, ganha metade dos créditos do cartão
            extraCredits = card.valor / 2;
        } else if (markedRows.size === 2) {
            // Se duas linhas do cartão estiverem marcadas, ganha o valor do cartão
            extraCredits = parseFloat(card.valor);
        } else if (markedRows.size === rows) {
            // Se todas as linhas estiverem marcadas, ganha o valor do cartão * 3
            extraCredits = card.valor * 3;
        } else if (markedRows.size > 2 && markedRows.size <= rows) {
            // Se mais de duas linhas do cartão estiverem marcadas e se forem menos ou igual ao número total de linhas do cartão, ganha 1,5 vezes o valor do cartão
            extraCredits = card.valor * 1.5;
        }

        const cardRef = doc(db, 'BingoCards', card.id);

        try {
            await updateDoc(cardRef, { isActive: false });

            // Atualiza os créditos para os utilizadores que compraram este cartão
            if (extraCredits > 0) {
                const usersRef = collection(db, 'Utilizador');
                const q = query(usersRef, where('cartões', 'array-contains', card.id));
                const querySnapshot = await getDocs(q);

                try {
                    querySnapshot.forEach(async userDoc => {
                        const userRef = doc(db, 'Utilizador', userDoc.id);
                        const userData = userDoc.data();

                        // Verifica quantas cópias do cartão o utilizador tem
                        const cardCopies = userData.cartões.filter(cardId => cardId === card.id).length;

                        // Calcula os créditos com base no número de cópias do cartão
                        const totalExtraCredits = extraCredits * cardCopies;
                        const existingCredits = parseFloat(userData.creditos) || 0; // Convertendo para número

                        // Adiciona os créditos aos créditos do utilizador
                        const newCredits = parseFloat(existingCredits + totalExtraCredits);

                        try {
                            await updateDoc(userRef, { creditos: newCredits.toString() });
                        } catch (error) {
                            console.error('Erro ao atribuir créditos extras ao usuário:', userDoc.id, error);
                        }
                    });
                } catch (error) {
                    console.error('Erro ao atribuir créditos extras:', error);
                }
            }

            // Caso o cartão seja finalizado com sucesso, aparece uma notificaçã do toast de sucesso
            toast.success('Cartão finalizado com sucesso!');
            navigate('/userPage');
        } catch (error) {
            toast.error('Erro ao finalizar o cartão. Tente novamente.');
        }
    };

    return (
        <div className="editcard-page">
            <NavBar />
            <div className="edit-card-container">
                <div className="card card-spacing text-center">
                    <div className="card-body">
                        <Bingo
                            events={card.events}
                            results={card.results}
                            gridSize={card.gridSize}
                            eventFinalResult={eventFinalResult}
                            onCheckToggle={handleCheckToggle}
                            showCheckButtons
                        />
                        <h5 className="card-value">Custo: {card.valor} créditos</h5>
                        <h5 className="card-winnings">Ganhos Possíveis: {card.valor * 3} créditos</h5>
                    </div>
                </div>
            </div>
            <div className="edit-buttons-container">
                <button className="btn btn-primary mt-3 endcard-button" onClick={handleFinishCard}>
                    Finalizar Cartão
                </button>
                <button className="btn btn-primary mt-3 editback-button" onClick={handleClickBack}>
                    Voltar
                </button>
            </div>
        </div>
    );
};
