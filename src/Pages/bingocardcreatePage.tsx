//@ts-nocheck
import { useEffect, useState } from 'react';
import { doc, DocumentData, collection, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import db, { auth } from '../Firebase.ts';
import { NavBar } from '../components/navbar/navbar';

import './bingocardcreatePage.scss';

export const BingocardcreatePage = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [valor, setValor] = useState('');
    const [isCreatingANewCard, setisCreatingANewCard] = useState(false);
    const [gridSize, setGridSize] = useState(3); // Default to 3x3 grid
    const [events, setEvents] = useState(Array(9).fill('')); // Default 9 empty events
    const [results, setResults] = useState(Array(9).fill('')); // Default 9 empty events

    const navigate = useNavigate();

    const handleClickCreateBingo = () => {
        navigate('/userPage');
    };

    useEffect(() => {
        const colletionRef = collection(db, 'BingoCards');
        const queryToDataBase = query(colletionRef);

        setIsLoading(true);
        const unsub = onSnapshot(queryToDataBase, querySnapshot => {
            const items: DocumentData[] = [];

            // eslint-disable-next-line @typescript-eslint/no-shadow
            querySnapshot.forEach(doc => {
                items.push(doc.data());
            });
            setBingoCards(items);
            setIsLoading(false);
        });

        return () => {
            unsub();
        };
    }, []);

    const handleGridSizeChange = size => {
        setGridSize(size);
        setEvents(Array(size * size).fill(''));
        setResults(Array(size * size).fill(''));
    };

    const handleEventChange = (index, value) => {
        const newEvents = [...events];

        newEvents[index] = value;
        setEvents(newEvents);
    };

    const handleResultChange = (index, value) => {
        const newResults = [...results];

        newResults[index] = value;
        setResults(newResults);
    };

    const addBingoCard = async event => {
        event.preventDefault();
        const newBingoCard = {
            valor,
            events,
            gridSize,
            results,
            id_creator: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            lastUpdate: serverTimestamp()
        };

        try {
            const cardRef = doc(collection(db, 'BingoCards'));

            setisCreatingANewCard(true);
            await setDoc(cardRef, newBingoCard);
            setValor('');
            setEvents(Array(gridSize * gridSize).fill(''));
            setResults(Array(gridSize * gridSize).fill(''));
        } catch (error) {
            console.error('Erro ao adicionar o cartão bingo', error);
        }
        setisCreatingANewCard(false);
    };

    const getInputGridClass = () => {
        return `input-grid input-grid-${gridSize}`;
    };

    return (
        <>
            <NavBar />
            {isLoading && (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {!isLoading && (
                <div className="container">
                    {!isCreatingANewCard && (
                        <form onSubmit={addBingoCard}>
                            <div className="row">
                                <select onChange={e => handleGridSizeChange(parseInt(e.target.value))}>
                                    <option value="3">3x3</option>
                                    <option value="4">4x4</option>
                                    <option value="5">5x5</option>
                                </select>
                            </div>
                            <div className="card-value">
                                <input type="text" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
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
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
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
