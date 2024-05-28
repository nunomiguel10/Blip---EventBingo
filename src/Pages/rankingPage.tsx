//@ts-nocheck
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';

import db from '../Firebase.ts'; // ajuste este caminho conforme necessário
import { NavBar } from '../components/navbar/navbar';

import './rankingPage.scss';

export const RankingPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                // Obtenha uma referência à coleção 'Utilizador'
                const usersCollectionRef = collection(db, 'Utilizador');

                // Use onSnapshot para escutar mudanças em tempo real na coleção
                const unsubscribe = onSnapshot(usersCollectionRef, snapshot => {
                    const usersData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    // Ordenar os utilizadores pelos créditos (assumindo que 'creditos' é um campo numérico)
                    usersData.sort((a, b) => b.creditos - a.creditos);

                    setUsers(usersData);
                    setIsLoading(false);
                });

                // Limpar a subscrição quando o componente for desmontado
                return () => unsubscribe();
            } catch (error) {
                console.error('Erro ao buscar os utilizadores:', error);
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <>
            <NavBar />
            <div className="ranking-container">
                <h1>Ranking de Utilizadores</h1>
                {isLoading ? (
                    <p>Carregando...</p>
                ) : (
                    <ul>
                        {users.map((user, index) => (
                            <li key={user.id}>
                                <span>
                                    {index + 1}. {user.name || 'Anônimo'} : {user.creditos} créditos
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};
