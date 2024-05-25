/* eslint-disable react/prop-types */
//@ts-nocheck
//import React from 'react';

import { Bingo } from '../Bingo/Bingo';

import './card.scss';

export const Card = ({ bingoCards }) => {
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {bingoCards.map((card, index) => (
                    <div key={index} className="col-lg-8 col-xl-6 mb-4">
                        <div className="card card-spacing text-center">
                            <div className="card-body">
                                <Bingo events={card.events} results={card.results} gridSize={card.gridSize} />
                                <h5 className="card-value">Custo: {card.valor} créditos</h5>
                                <h5 className="card-winnings">Ganhos Possíveis: créditos</h5>
                                <button className="btn btn-primary mt-3" onClick={() => card}>
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
