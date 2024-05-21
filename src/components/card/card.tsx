//import React from 'react';

import { Bingo } from '../Bingo/Bingo';

import './card.scss';

export const Card = () => {
    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                {[...Array(5)].map((_, index) => (
                    <div key={index} className="col-lg-8 col-xl-6 mb-4">
                        {' '}
                        {/* Define o tamanho dos cartões e adiciona margem na parte inferior */}
                        <div className="card card-spacing text-center">
                            <div className="card-body">
                                <Bingo />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
