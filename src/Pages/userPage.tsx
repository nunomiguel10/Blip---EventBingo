import { useNavigate } from 'react-router-dom';

import { Card } from '../components/card/card';
import { NavBar } from '../components/navbar/navbar';

import './userPage.scss';

export const UserPage = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/bingocardcreatepage');
    };

    return (
        <>
            <NavBar />
            <div className="container_user_page">
                <div>
                    <button className="button_userpage" onClick={handleClick}>
                        Adicionar cartão
                    </button>
                </div>
                <div className="row justify-content-center">
                    {/* Renderizar apenas o componente Card */}
                    <Card />
                </div>
            </div>
        </>
    );
};
