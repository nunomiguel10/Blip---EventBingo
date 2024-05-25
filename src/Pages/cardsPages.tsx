//@ts-nocheck
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { doc, DocumentData, collection, onSnapshot, /*query*/ serverTimestamp, setDoc /*where*/ } from 'firebase/firestore';

import { NavBar } from '../components/navbar/navbar';
import db from '../Firebase';
import { Card } from '../components/card/card';

export const CardsPage = () => {
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [evento, setEvento] = useState('');
    // const [valor, setValor] = useState('');
    // const [data, setData] = useState('');
    // const [hora, setHora] = useState('');
    // const [isCreatingANewCard, setisCreatingANewCard] = useState(false);

    useEffect(() => {
        const colletionRef = collection(db, 'BingoCards');
        // const queryToDataBase = query(colletionRef, where('evento', '>=', 'Lakers'), where('evento', '<=', 'Lakers' + '\uf8ff'));

        setIsLoading(true);
        const unsub = onSnapshot(colletionRef, querySnapshot => {
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

    // const addBingoCard = async event => {
    //     event.preventDefault();
    //     const newBingoCard = {
    //         evento,
    //         data,
    //         valor,
    //         hora,
    //         createdAt: serverTimestamp(),
    //         lastUpdate: serverTimestamp()
    //     };

    //     try {
    //         const cardRef = doc(collection(db, 'BingoCards'));

    //         setisCreatingANewCard(true);
    //         await setDoc(cardRef, newBingoCard);
    //         setEvento('');
    //         setValor('');
    //         setData('');
    //         setHora('');
    //     } catch (error) {
    //         console.error('Erro ao adicionar o cartão bingo', error);
    //     }
    //     setisCreatingANewCard(false);
    // };

    return (
        <>
            <NavBar />
            {isLoading && (
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            )}
            {!isLoading && (
                <div>
                    <div className="row justify-content-center">
                        {isLoading ? (
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : (
                            <Card bingoCards={bingoCards} />
                        )}
                    </div>
                    {/* {!isCreatingANewCard && (
                        <form onSubmit={addBingoCard}>
                            <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                            <input type="text" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
                            <input type="date" placeholder="Data" value={data} onChange={e => setData(e.target.value)} />
                            <input type="time" placeholder="Hora" value={hora} onChange={e => setHora(e.target.value)} />
                            <button type="submit">Adicionar Cartão de Bingo</button>
                        </form>
                    )}
                    {isCreatingANewCard && (
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    )} */}
                </div>
            )}
        </>
    );
};
