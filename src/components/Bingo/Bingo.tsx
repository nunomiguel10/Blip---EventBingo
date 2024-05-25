/* eslint-disable react/prop-types */
//@ts-nocheck
//import React from 'react';

import './Bingo.scss';

const generateBingoCard = (events, results, gridSize) => {
    const card = [];
    let eventIndex = 0;
    let resultIndex = 0;

    for (let i = 0; i < gridSize; i++) {
        const row = [];

        for (let j = 0; j < gridSize; j++) {
            row.push({ event: events[eventIndex] || '', result: results[resultIndex] || '' });
            eventIndex++;
            resultIndex++;
        }
        card.push(row);
    }

    return card;
};

// eslint-disable-next-line react/prop-types
export const Bingo = ({ events = [], results = [], gridSize = 3 }) => {
    const card = generateBingoCard(events, results, gridSize);

    return (
        <div className="bingo-card">
            {card.map((row, rowIndex) => (
                <div key={rowIndex} className="bingo-row">
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className="bingo-cell">
                            <div className="bingo-event">{cell.event}</div>
                            <div className="bingo-result">{cell.result}</div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
