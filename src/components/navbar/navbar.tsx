import { Link } from 'react-router-dom';

export const NavBar = () => {
    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary justify-content-between">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/userPage">
                    <img src="src\components\images\logo.png" alt="EventBingo Logo" style={{ width: '120px', marginLeft: '10px' }} />
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
                        <li className="nav-item">
                            <Link className="nav-link" to="/userPage">
                                Adicionar Créditos
                            </Link>
                        </li>
                    </ul>
                </div>
                <ul className="nav justify-content-center">
                    <li className="nav-item">
                        <img src="src\components\images\carrinho.png" alt="" style={{ width: '35px', height: '30px' }} /> 1000 créditos
                    </li>
                </ul>
            </div>
        </nav>
    );
};
