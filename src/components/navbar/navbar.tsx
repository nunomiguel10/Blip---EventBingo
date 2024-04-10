/* eslint-disable jsx-a11y/anchor-is-valid */

import React from 'react';

interface NavBarProps {
    credits: number;
}

export const NavBar: React.FC<NavBarProps> = ({ credits }) => {
    return (
        <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    EventBingo
                </a>
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
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">
                                Página Inicial
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">
                                Meus Cartões
                            </a>
                        </li>
                    </ul>
                    <div className="creditos">{credits} Créditos</div>
                </div>
            </div>
        </nav>
    );
};
