/* eslint-disable react/prop-types */
//@ts-nocheck
//import React from 'react';

import { Bingo } from '../Bingo/Bingo';

import './card.scss';

export const Card = ({ purchasedBingoCards }) => {
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {purchasedBingoCards.map((card, index) => (
                    <div key={index} className="col-lg-8 col-xl-6 mb-4">
                        <div className="card card-spacing text-center">
                            <div className="card-body">
                                <Bingo events={card.events} gridSize={card.gridSize} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
