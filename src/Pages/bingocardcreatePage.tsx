// import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//import { Card } from '../components/card/card';
import { NavBar } from '../components/navbar/navbar';

// interface BingoCardInfo {
//     id: number;
//     event_name: string;
//     winner: string;
// }

export const BingocardcreatePage = () => {
    // const [bingocard, setBingoCard] = useState<BingoCardInfo[]>([]);

    const navigate = useNavigate();

    const handleClickCreateBingo = () => {
        navigate('/userPage');
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('URL_DA_SUA_API');
    //             const data = await response.json(bingocard);

    //             setBingoCard(data);
    //         } catch (error) {
    //             console.error('Erro ao buscar os dados do Bingo Card:', error);
    //         }
    //     };

    //     fetchData();
    // }, []);

    return (
        <>
            <NavBar />
            <div>Escolha o tipo de cartão</div>
            <div> oi</div>
            <div>
                <button onClick={handleClickCreateBingo}>Voltar</button>
            </div>
        </>
    );
};
