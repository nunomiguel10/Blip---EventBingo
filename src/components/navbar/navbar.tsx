import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

import db, { auth } from '../../Firebase';

import './navbar.scss';

export const NavBar = () => {
    const [credits, setCredits] = useState(0);
    const [name, setUserName] = useState('');

    useEffect(() => {
        const fetchUserData = async (user: User | null) => {
            if (user) {
                // Buscando créditos do usuário
                const userDoc = await getDoc(doc(db, 'Utilizador', user.uid));

                if (userDoc.exists()) {
                    setCredits(userDoc.data().creditos);
                }

                // Buscando nome do usuário no Firebase Authentication
                setUserName(user.displayName || ''); // Nome do usuário se disponível, senão vazio
            }
        };

        const unsubscribe = onAuthStateChanged(auth, user => {
            fetchUserData(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary justify-content-between">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/userPage">
                    <img src="images/logo.png" alt="EventBingo Logo" style={{ width: '120px', marginLeft: '10px' }} />
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/userPage">
                                Página Inicial
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cardPage">
                                Meus Cartões
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/userPage">
                                Ganhos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/userPage">
                                Encerrados
                            </Link>
                        </li>
                        {/* <li className="nav-item">
                            <Link className="nav-link" to="/userPage">
                                Adicionar Créditos
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <ul className="nav justify-content-center">
                    <li className="nav-item" style={{ marginRight: '40px', fontSize: '20px' }}>
                        <>Olá {name}!</>
                    </li>
                    <li className="nav-item">
                        <img src="images/carrinho.png" alt="" style={{ width: '35px', height: '30px' }} /> {credits}
                    </li>
                </ul>
            </div>
        </nav>
    );
};
