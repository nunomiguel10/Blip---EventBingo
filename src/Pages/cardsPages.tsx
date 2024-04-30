//@ts-nocheck
import { useEffect, useState } from 'react';
import { DocumentData, collection, onSnapshot, query, where } from 'firebase/firestore';

import { NavBar } from '../components/navbar/navbar';
import db from '../Firebase';

export const CardsPage = () => {
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const colletionRef = collection(db, 'BingoCards');
        const queryToDataBase = query(colletionRef, where('evento', '>=', 'Lakers'), where('evento', '<=', 'Lakers' + '\uf8ff'));

        setIsLoading(true);
        const unsub = onSnapshot(queryToDataBase, querySnapshot => {
            const items: DocumentData[] = [];

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

    return (
        <>
            <NavBar />
            {isLoading && (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {!isLoading && (
                <ul className="list-group">
                    {bingoCards.map(card => {
                        return (
                            <li key={card.evento} className="list-group-item">
                                {card.evento}
                            </li>
                        );
                    })}
                </ul>
            )}
        </>
    );
};
