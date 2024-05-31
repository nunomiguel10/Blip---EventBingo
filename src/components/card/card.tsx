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

    const handleEditClick = card => {
        navigate('/editcard', { state: { card } }); // Pass card data via state
    };

    const handleBuy = async card => {
        const user = auth.currentUser;

        if (user) {
            try {
                const bingoCardDocRef = doc(db, 'BingoCards', card.id);
                const bingoCardDocSnap = await getDoc(bingoCardDocRef);

                if (bingoCardDocSnap.exists()) {
                    const userDocRef = doc(db, 'Utilizador', user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userCredits = userDocSnap.data().creditos || 0;
                        const currentCards = userDocSnap.data().cartões || [];

                        if (userCredits >= card.valor) {
                            const cardId = bingoCardDocRef.id;
                            const updatedCards = [...currentCards, cardId];
                            const newCredits = userCredits - card.valor;

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

    const handleRemoveClick = async card => {
        try {
            const bingoCardDocRef = doc(db, 'BingoCards', card.id);

            // Remove o cartão da coleção "BingoCards"
            await deleteDoc(bingoCardDocRef);

            // Busca todos os usuários que compraram este cartão
            const usersQuery = query(collection(db, 'Utilizador'), where('cartões', 'array-contains', card.id));
            const usersSnapshot = await getDocs(usersQuery);

            // Remove o ID do cartão da lista de cartões de cada usuário
            const updateUserPromises = usersSnapshot.docs.map(async userDoc => {
                const userDocRef = doc(db, 'Utilizador', userDoc.id);
                const userData = userDoc.data();
                const updatedCards = userData.cartões.filter(cardId => cardId !== card.id);

                await updateDoc(userDocRef, { cartões: updatedCards });
            });

            // Espera todas as atualizações dos usuários serem concluídas
            await Promise.all(updateUserPromises);

            toast.success('Cartão removido com sucesso!', {
                position: 'top-center'
            });
        } catch (error) {
            console.error('Erro ao remover o cartão:', error);
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
                                <Bingo events={card.events} results={card.results} checks={card.checks} gridSize={card.gridSize} />
                                <h5 className="card-value">Custo: {card.valor} créditos</h5>
                                <h5 className="card-winnings">Ganhos Possíveis: {card.valor * 3} créditos</h5>
                                {showBuyButton && (
                                    <button className="btn btn-primary mt-3" onClick={() => handleBuy(card)}>
                                        Comprar
                                    </button>
                                )}
                                {isAdmin && (
                                    <>
                                        <button className="btn btn-primary mt-3" onClick={() => handleEditClick(card)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-danger mt-3" onClick={() => handleRemoveClick(card)}>
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
