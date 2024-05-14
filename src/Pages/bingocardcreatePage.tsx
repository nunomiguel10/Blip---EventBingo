//@ts-nocheck
import { useEffect, useState } from 'react';
import { doc, DocumentData, collection, onSnapshot, query, serverTimestamp, setDoc /*where*/ } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import { auth, db } from '../Firebase.ts';
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
    const [evento1, setEvento1] = useState('');
    const [evento2, setEvento2] = useState('');
    const [evento3, setEvento3] = useState('');
    const [evento4, setEvento4] = useState('');
    const [evento5, setEvento5] = useState('');
    const [evento6, setEvento6] = useState('');
    const [evento7, setEvento7] = useState('');
    const [evento8, setEvento8] = useState('');
    const [evento9, setEvento9] = useState('');
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
            evento1,
            evento2,
            evento3,
            evento4,
            evento5,
            evento6,
            evento7,
            evento8,
            evento9,
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
            setEvento1('');
            setEvento2('');
            setEvento3('');
            setEvento4('');
            setEvento5('');
            setEvento6('');
            setEvento7('');
            setEvento8('');
            setEvento9('');
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
                                    {card.evento1} <br />
                                    {card.evento2} <br />
                                    {card.evento3} <br />
                                    {card.evento4} <br />
                                    {card.evento5} <br />
                                    {card.evento6} <br />
                                    {card.evento7} <br />
                                    {card.evento8} <br />
                                    {card.evento9}
                                </li>
                            );
                        })}
                    </ul>
                    {!isCreatingANewCard && (
                        <form onSubmit={addBingoCard}>
                            <div className="row">
                                <input type="text" placeholder="Evento" value={evento1} onChange={e => setEvento1(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento2} onChange={e => setEvento2(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento3} onChange={e => setEvento3(e.target.value)} />
                            </div>
                            <div className="row">
                                <input type="text" placeholder="Evento" value={evento4} onChange={e => setEvento4(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento5} onChange={e => setEvento5(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento6} onChange={e => setEvento6(e.target.value)} />
                            </div>
                            <div className="row">
                                <input type="text" placeholder="Evento" value={evento7} onChange={e => setEvento7(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento8} onChange={e => setEvento8(e.target.value)} />
                                <input type="text" placeholder="Evento" value={evento9} onChange={e => setEvento9(e.target.value)} />
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
