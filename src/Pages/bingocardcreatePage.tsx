//@ts-nocheck
import { useEffect, useState } from 'react';
import { doc, DocumentData, collection, onSnapshot, query, serverTimestamp, setDoc /*where*/ } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import db, { auth } from '../Firebase.ts';
import { NavBar } from '../components/navbar/navbar';

import './bingocardcreatePage.scss';
// interface BingoCardInfo {
//     id: number;
//     event_name: string;
//     winner: string;
// }

export const BingocardcreatePage = () => {
    const [bingoCards, setBingoCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [evento, setEvento] = useState('');
    const [valor, setValor] = useState('');
    const [isCreatingANewCard, setisCreatingANewCard] = useState(false);
    //const [hora, setHora] = useState('');

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

    const addBingoCard = async event => {
        event.preventDefault();
        const newBingoCard = {
            evento,
            //data,
            valor,
            id_creator: auth.currentUser.uid,
            createdAt: serverTimestamp(),
            lastUpdate: serverTimestamp()
        };

        try {
            const cardRef = doc(collection(db, 'BingoCards'));

            setisCreatingANewCard(true);
            await setDoc(cardRef, newBingoCard);
            setEvento('');
            setValor('');
            //setData('');
            //setHora('');
        } catch (error) {
            console.error('Erro ao adicionar o cartão bingo', error);
        }
        setisCreatingANewCard(false);
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
                <div>
                    <ul className="list-group">
                        {bingoCards.map(card => {
                            return (
                                <li key={card.evento} className="list-group-item">
                                    {card.evento1}
                                </li>
                            );
                        })}
                    </ul>
                    {!isCreatingANewCard && (
                        <form onSubmit={addBingoCard}>
                            <div className="row">
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                            </div>
                            <div className="row">
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                            </div>
                            <div className="row">
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento} onChange={e => setEvento(e.target.value)} />
                            </div>
                            <div className="card_value_createpage">
                                <input type="text" placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} />
                            </div>
                            {/* <div className="row">
                            <input type="date" placeholder="Data" value={data} onChange={e => setData(e.target.value)} />
                            <input type="time" placeholder="Hora" value={hora} onChange={e => setHora(e.target.value)} />
                        </div> */}
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
            <div>
                <button onClick={handleClickCreateBingo}>Voltar</button>
            </div>
        </>
    );
};
