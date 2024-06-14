/* eslint-disable react/prop-types */
//@ts-nocheck
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, onSnapshot, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

import db from '../../Firebase.ts';
import { Bingo } from '../Bingo/Bingo';

import './card.scss';

export const Card = ({ bingoCards, showBuyButton = true }) => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);

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

    // Vai para a página de editar e leva o cartão como estado para modificar apenas esse cartão
    const handleEditClick = card => {
        navigate('/editcard', { state: { card } });
    };

    // Função que permite a compra do cartão
    const handleBuy = async card => {
        const user = auth.currentUser;

        if (user) {
            try {
                // Vai à base de dados o id do cartão
                const bingoCardDocRef = doc(db, 'BingoCards', card.id);
                const bingoCardDocSnap = await getDoc(bingoCardDocRef);

                // Caso o cartão exista
                if (bingoCardDocSnap.exists()) {
                    // Vai à base de dados buscar o id do utilizador
                    const userDocRef = doc(db, 'Utilizador', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    // Se o utilizador existir vai efetuar a compra do cartão
                    if (userDocSnap.exists()) {
                        const userCredits = userDocSnap.data().creditos || 0;
                        const currentCards = userDocSnap.data().cartões || [];

                        // Convertemos para número para ter a certeza que estamos a lidar com números
                        const userCreditsNumber = Number(userCredits);
                        const cardValueNumber = Number(card.valor);

                        // Verifica se o utilizador tem créditos suficientes para comprar o cartão
                        if (userCreditsNumber >= cardValueNumber) {
                            const cardId = bingoCardDocRef.id;
                            const updatedCards = [...currentCards, cardId];
                            const newCredits = userCreditsNumber - cardValueNumber;

                            await updateDoc(userDocRef, {
                                cartões: updatedCards,
                                creditos: newCredits
                            });

                            toast.success('Cartão comprado com sucesso!', {
                                position: 'top-center'
                            });
                        } else {
                            toast.error('Créditos insuficientes para comprar o cartão.', {
                                position: 'top-center'
                            });
                        }
                    } else {
                        console.error('Documento não existe.');
                    }
                } else {
                    console.error('Cartão não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao comprar o cartão:', error);
            }
        } else {
            console.error('Nenhum utilizador autenticado.');
        }
    };

    // Função para remover os cartões do sistema
    const handleRemoveClick = async card => {
        try {
            const bingoCardDocRef = doc(db, 'BingoCards', card.id);

            // Remove o cartão da coleção "BingoCards"
            await deleteDoc(bingoCardDocRef);

            // Vai à base de dados buscar todos os utilizadores que tinham comprado o cartão
            const usersQuery = query(collection(db, 'Utilizador'), where('cartões', 'array-contains', card.id));
            const usersSnapshot = await getDocs(usersQuery);

            // Remove o ID do cartão da lista de cartões de cada utilizador
            const updateUserPromises = usersSnapshot.docs.map(async userDoc => {
                const userDocRef = doc(db, 'Utilizador', userDoc.id);
                const userData = userDoc.data();
                const updatedCards = userData.cartões.filter(cardId => cardId !== card.id);

                await updateDoc(userDocRef, { cartões: updatedCards });
            });

            await Promise.all(updateUserPromises);

            toast.success('Cartão removido com sucesso!', {
                position: 'top-center'
            });
        } catch (error) {
            toast.error('Erro ao remover o cartão.', {
                position: 'top-center'
            });
        }
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {bingoCards.map((card, index) => (
                    <div key={index} className="col-lg-8 col-xl-6 mb-4">
                        <div className="card card-spacing text-center">
                            <div className="card-body">
                                <Bingo
                                    events={card.events}
                                    results={card.results}
                                    eventFinalResult={card.eventFinalResult}
                                    gridSize={card.gridSize}
                                />
                                <h5 className="card-value">Custo: {card.valor} créditos</h5>
                                <h5 className="card-winnings">Ganhos Possíveis: {card.valor * 3} créditos</h5>
                                {showBuyButton && (
                                    <button className="btn btn-primary mt-3 buy-button" onClick={() => handleBuy(card)}>
                                        Comprar
                                    </button>
                                )}
                                {isAdmin && (
                                    <>
                                        <button className="btn btn-primary mt-3 edit-button" onClick={() => handleEditClick(card)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger mt-3 remove-button" onClick={() => handleRemoveClick(card)}>
                                            Remover
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
