import React from 'react';

import './Bingo.scss';

const generateBingoCard = () => {
    const card = [];

    for (let i = 0; i < 5; i++) {
        const row = [];

        for (let j = 0; j < 5; j++) {
            row.push(Math.floor(Math.random() * 100) + 1);
        }
        card.push(row);
    }

    return card;
};

export const Bingo = () => {
    const card = generateBingoCard();

    return (
        <div className="bingo-card">
            {card.map((row, rowIndex) => (
                <div key={rowIndex} className="bingo-row">
                    {row.map((number, colIndex) => (
                        <div key={colIndex} className="bingo-cell">
                            {number}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
