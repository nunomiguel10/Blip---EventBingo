/* eslint-disable react/prop-types */
//@ts-nocheck
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import db from '../../Firebase.ts';
import { Bingo } from '../Bingo/Bingo';

import './card.scss';

export const Card = ({ bingoCards, showBuyButton = true }) => {
    const auth = getAuth();

    const handleBuy = async card => {
        const user = auth.currentUser;

        if (user) {
            try {
                // Busca o documento na coleção "BingoCards"
                const bingoCardDocRef = doc(db, 'BingoCards', card.id);
                const bingoCardDocSnap = await getDoc(bingoCardDocRef);

                if (bingoCardDocSnap.exists()) {
                    const userDocRef = doc(db, 'Utilizador', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userCredits = userDocSnap.data().creditos || 0;
                        const currentCards = userDocSnap.data().cartões || [];

                        if (userCredits >= card.valor) {
                            // Use o ID do documento Firestore do BingoCard como ID do cartão
                            const cardId = bingoCardDocRef.id;

                            // Adiciona o ID do cartão à lista de cartões do usuário
                            const updatedCards = [...currentCards, cardId];

                            // Calcula os novos créditos do usuário
                            const newCredits = userCredits - card.valor;

                            // Atualiza o documento do usuário com os novos cartões e créditos
                            await updateDoc(userDocRef, {
                                cartões: updatedCards,
                                creditos: newCredits
                            });

                            //console.log('Cartão comprado com sucesso:', cardId);
                        } else {
                            console.error('Créditos insuficientes para comprar o cartão.');
                        }
                    }
                } else {
                    console.error('BingoCard não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao comprar o cartão:', error);
            }
        } else {
            console.error('Nenhum usuário autenticado.');
        }
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {bingoCards.map((card, index) => (
                    <div key={index} className="col-lg-8 col-xl-6 mb-4">
                        <div className="card card-spacing text-center">
                            <div className="card-body">
                                <Bingo events={card.events} results={card.results} gridSize={card.gridSize} />
                                <h5 className="card-value">Custo: {card.valor} créditos</h5>
                                <h5 className="card-winnings">Ganhos Possíveis: créditos</h5>
                                {showBuyButton && (
                                    <button className="btn btn-primary mt-3" onClick={() => handleBuy(card)}>
                                        Comprar
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
