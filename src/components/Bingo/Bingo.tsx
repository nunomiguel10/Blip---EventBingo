//@ts-nocheck
//import React from 'react';

import './Bingo.scss';

const generateBingoCard = (events, gridSize) => {
    const card = [];
    let eventIndex = 0;

    for (let i = 0; i < gridSize; i++) {
        const row = [];

        for (let j = 0; j < gridSize; j++) {
            row.push(events[eventIndex] || '');
            eventIndex++;
        }
        card.push(row);
    }

    return card;
};

// eslint-disable-next-line react/prop-types
export const Bingo = ({ events = [], gridSize = 3 }) => {
    const card = generateBingoCard(events, gridSize);

    return (
        <div className="bingo-card">
            {card.map((row, rowIndex) => (
                <div key={rowIndex} className="bingo-row">
                    {row.map((event, colIndex) => (
                        <div key={colIndex} className="bingo-cell">
                            {event}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
