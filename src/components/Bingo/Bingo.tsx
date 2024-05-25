/* eslint-disable react/prop-types */
//@ts-nocheck
//import React from 'react';

import './Bingo.scss';

const generateBingoCard = (events, results, rows, cols) => {
    const card = [];
    let eventIndex = 0;
    let resultIndex = 0;

    for (let i = 0; i < rows; i++) {
        const row = [];

        for (let j = 0; j < cols; j++) {
            row.push({ event: events[eventIndex] || '', result: results[resultIndex] || '' });
            eventIndex++;
            resultIndex++;
        }
        card.push(row);
    }

    return card;
};

export const Bingo = ({ events = [], results = [], gridSize = { rows: 3, cols: 3 } }) => {
    const { rows, cols } = gridSize;
    const card = generateBingoCard(events, results, rows, cols);

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
