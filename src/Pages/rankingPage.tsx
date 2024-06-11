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
        <div style={{ backgroundColor: '#a3a1a1' }}>
            <NavBar />
            <h1 className="ranking-title">Ranking de Utilizadores</h1>
            <div className="ranking-container">
                {isLoading ? (
                    <p>Carregando...</p>
                ) : (
                    <table className="table table-dark table-ranking">
                        <thead>
                            <tr>
                                <th scope="col" className="table-cell">
                                    Posição
                                </th>
                                <th scope="col" className="table-cell">
                                    Nome
                                </th>
                                <th scope="col" className="table-cell">
                                    Créditos
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="table-cell">{index + 1}</td>
                                    <td className="table-cell">{user.name || 'Anônimo'}</td>
                                    <td className="table-cell">{user.creditos}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};
