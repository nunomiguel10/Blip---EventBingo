import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

import db, { auth } from '../../Firebase';

import './navbar.scss';

export const NavBar = () => {
    const [credits, setCredits] = useState(0);
    const [name, setUserName] = useState('');

    useEffect(() => {
        let unsubscribeUserDoc = () => {};

        const fetchUserData = async (user: User | null) => {
            if (user) {
                // Vai à base de dados buscar todos os documentos da coleção "Utilizador"
                const userDocRef = doc(db, 'Utilizador', user.uid);

                // Vai à base de dados buscar os créditos do utilizador
                unsubscribeUserDoc = onSnapshot(userDocRef, userDoc => {
                    if (userDoc.exists()) {
                        setCredits(userDoc.data().creditos);
                    }
                });

                // Vai à base de dados buscar o nome do utilizador e caso não tenha nome aparece uma string vazia
                setUserName(user.displayName || '');
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, user => {
            if (user) {
                fetchUserData(user);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeUserDoc();
        };
    }, []);

    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-color">
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
                            <Link className="nav-link" to="/rankingPage">
                                Ranking
                            </Link>
                        </li>
                    </ul>
                </div>
                <ul className="nav justify-content-center">
                    <li className="nav-item" style={{ marginRight: '40px', fontSize: '20px' }}>
                        <>Bem-vindo {name}!</>
                    </li>
                    <li className="nav-item">
                        <img src="images/credits.png" alt="" style={{ width: '35px', height: '35px' }} /> {credits}
                    </li>
                </ul>
            </div>
        </nav>
    );
};
