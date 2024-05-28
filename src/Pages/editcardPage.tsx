import { useLocation, useNavigate } from 'react-router-dom';

import { NavBar } from '../components/navbar/navbar';
import { Bingo } from '../components/Bingo/Bingo';

import './editcardPage.scss';

export const EditCardPage = () => {
    const location = useLocation();
    const { card } = location.state || {};
    const navigate = useNavigate();

    const handleClickBack = () => {
        navigate('/userPage');
    };

    return (
        <>
            <NavBar />
            <div className="edit-card-container">
                <div className="card card-spacing text-center">
                    <div className="card-body">
                        <Bingo events={card.events} results={card.results} gridSize={card.gridSize} />
                        <h5 className="card-value">Custo: {card.valor} créditos</h5>
                        <h5 className="card-winnings">Ganhos Possíveis: créditos</h5>
                    </div>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleClickBack}>
                Voltar
            </button>
        </>
    );
};
