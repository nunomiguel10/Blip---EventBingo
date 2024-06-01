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
        const rows = card.gridSize.rows;
        const cols = card.gridSize.cols;
        const totalCells = rows * cols;
        const cellsPerRow = cols;

        const markedRows = new Set();

        // Verifica quais linhas estão marcadas
        for (let i = 0; i < totalCells; i += cellsPerRow) {
            let isRowMarked = true;

            for (let j = 0; j < cellsPerRow; j++) {
                if (!checks[i + j]) {
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
            // Se apenas uma linha estiver marcada, ganhe metade dos créditos do cartão
            extraCredits = card.valor / 2;
        } else if (markedRows.size === 2) {
            // Se duas linhas estiverem marcadas, ganhe o valor do cartão
            extraCredits = parseFloat(card.valor);
        } else if (markedRows.size === rows) {
            // Se mais de duas linhas estiverem marcadas e menos ou igual ao número total de linhas, ganhe 1,5 vezes o valor do cartão
            extraCredits = card.valor * 3;
        } else if (markedRows.size > 2 && markedRows.size <= rows) {
            // Se todas as linhas estiverem marcadas, ganhe o valor do cartão * 3
            extraCredits = card.valor * 1.5;
        }

        // Atualiza os créditos para os usuários que possuem este cartão
        if (extraCredits > 0) {
            const usersRef = collection(db, 'Utilizador');
            const q = query(usersRef, where('cartões', 'array-contains', card.id));
            const querySnapshot = await getDocs(q);

            try {
                querySnapshot.forEach(async userDoc => {
                    const userRef = doc(db, 'Utilizador', userDoc.id);
                    const userData = userDoc.data();
                    const existingCredits = parseFloat(userData.creditos) || 0; // Convertendo para número

                    // Adiciona os créditos extras aos créditos existentes
                    const newCredits = parseFloat(existingCredits + extraCredits);

                    try {
                        await updateDoc(userRef, { creditos: newCredits.toString() }); // Convertendo de volta para string
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
