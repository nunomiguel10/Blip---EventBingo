//@ts-nocheck
import { useEffect, useState } from 'react';
import { doc, DocumentData, collection, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import db from '../Firebase.ts';
import { NavBar } from '../components/navbar/navbar';

import './bingocardcreatePage.scss';

export const BingocardcreatePage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [bingoCards, setBingoCards] = useState<DocumentData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [valor, setValor] = useState<string>('');
    const [isCreatingANewCard, setIsCreatingANewCard] = useState<boolean>(false);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [gridSize, setGridSize] = useState<{ rows: number; cols: number }>({ rows: 3, cols: 3 }); // Default to 3x3 grid
    const [events, setEvents] = useState<string[]>(Array(9).fill('')); // Default 9 empty events
    const [results, setResults] = useState<string[]>(Array(9).fill('')); // Default 9 empty results
    const [checks, setChecks] = useState<boolean[]>(Array(9).fill('')); // Default 9 false checks

    const navigate = useNavigate();

    const handleClickCreateBingo = () => {
        navigate('/userPage');
    };

    useEffect(() => {
        const collectionRef = collection(db, 'BingoCards');
        const queryToDataBase = query(collectionRef);

        setIsLoading(true);
        const unsub = onSnapshot(queryToDataBase, querySnapshot => {
            const items: DocumentData[] = [];

            // eslint-disable-next-line @typescript-eslint/no-shadow
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            });
            setBingoCards(items);
            setIsLoading(false);
            setIsActive(true);
        });

        return () => unsub();
    }, []);

    const handleGridSizeChange = (rows: number, cols: number) => {
        setGridSize({ rows, cols });
        setEvents(Array(rows * cols).fill(''));
        setResults(Array(rows * cols).fill(''));
        setChecks(Array(rows * cols).fill('')); // Inicializar o array de booleanos
    };

    const handleEventChange = (index: number, value: string) => {
        setEvents(prevEvents => {
            const newEvents = [...prevEvents];

            newEvents[index] = value;

            return newEvents;
        });
    };

    const handleResultChange = (index: number, value: string) => {
        setResults(prevResults => {
            const newResults = [...prevResults];

            newResults[index] = value;

            return newResults;
        });
    };

    const addBingoCard = async event => {
        event.preventDefault();
        if (!valor) {
            alert('Por favor, preencha o campo "Valor".');
        }
        const cardRef = doc(collection(db, 'BingoCards')); // Gera uma referência de documento com ID
        const newBingoCard = {
            id: cardRef.id, // Adiciona o ID do documento ao objeto do cartão Bingo
            valor,
            events,
            gridSize,
            results,
            isActive,
            checks, // Adicionar o array de booleanos
            createdAt: serverTimestamp(),
            lastUpdate: serverTimestamp()
        };

        try {
            setIsCreatingANewCard(true);
            await setDoc(cardRef, newBingoCard);
            setValor('');
            setEvents(Array(gridSize.rows * gridSize.cols).fill(''));
            setResults(Array(gridSize.rows * gridSize.cols).fill(''));
            setChecks(Array(gridSize.rows * gridSize.cols).fill('')); // Resetar o array de booleanos
        } catch (error) {
            console.error('Erro ao adicionar o cartão bingo', error);
        }
        setIsCreatingANewCard(false);
    };

    const getInputGridClass = () => `input-grid input-grid-${gridSize.rows}-${gridSize.cols}`;

    return (
        <>
            <NavBar />
            {isLoading && (
                <div className="spinner-border" role="status" aria-label="Loading...">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {!isLoading && (
                <div className="container">
                    {!isCreatingANewCard && (
                        <form onSubmit={addBingoCard}>
                            <div className="row">
                                <select
                                    onChange={e => {
                                        const [rows, cols] = e.target.value.split('x').map(Number);

                                        handleGridSizeChange(rows, cols);
                                    }}
                                >
                                    <option value="3x3">3x3</option>
                                    <option value="3x4">3x4</option>
                                    <option value="4x4">4x4</option>
                                    <option value="4x3">4x3</option>
                                </select>
                            </div>
                            <div className="card-value-create">
                                <input
                                    type="text"
                                    placeholder="Valor"
                                    value={valor}
                                    onChange={e => setValor(e.target.value)}
                                    required // Torna o campo obrigatório
                                />
                            </div>
                            <div className={getInputGridClass()}>
                                {events.map((event, index) => (
                                    <div key={index} className="event-result-pair">
                                        <input
                                            type="text"
                                            placeholder={`Evento ${index + 1}`}
                                            value={event}
                                            onChange={e => handleEventChange(index, e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            placeholder={`Resultado ${index + 1}`}
                                            value={results[index]}
                                            onChange={e => handleResultChange(index, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                            <button className="button_create_card" type="submit">
                                Adicionar Cartão de Bingo
                            </button>
                        </form>
                    )}
                    {isCreatingANewCard && (
                        <div className="spinner-border" role="status" aria-label="Creating bingo card...">
                            <span className="visually-hidden">Creating bingo card...</span>
                        </div>
                    )}
                </div>
            )}
            <div className="container">
                <button className="button_back_createcard" onClick={handleClickCreateBingo}>
                    Voltar
                </button>
            </div>
        </>
    );
};
