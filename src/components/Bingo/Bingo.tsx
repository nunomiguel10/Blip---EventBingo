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

export const Bingo = ({ events = [], results = [], gridSize = { rows: 3, cols: 3 }, checks = [], onCheckToggle, showCheckButtons }) => {
    const { rows, cols } = gridSize;
    const card = generateBingoCard(events, results, rows, cols);

    const handleCheckToggle = (index, value) => {
        if (onCheckToggle) {
            onCheckToggle(index, value);
        }
    };

    return (
        <div className="bingo-card">
            {card.map((row, rowIndex) => (
                <div key={rowIndex} className="bingo-row">
                    {row.map((cell, colIndex) => (
                        <div key={colIndex} className="bingo-cell">
                            <div className="bingo-event">{cell.event}</div>
                            <div className="bingo-result">{cell.result}</div>
                            {showCheckButtons && (
                                <div className="check-buttons">
                                    <button
                                        className={`btn btn-success rounded-pill px-3 trueresult-button ${checks[rowIndex * cols + colIndex] ? 'checked' : ''}`}
                                        onClick={() => handleCheckToggle(rowIndex * cols + colIndex, true)} // Passa true para o botão True
                                    >
                                        Certo
                                    </button>
                                    <button
                                        className={`btn btn-danger rounded-pill px-3 falseresult-button ${!checks[rowIndex * cols + colIndex] ? 'checked' : ''}`}
                                        onClick={() => handleCheckToggle(rowIndex * cols + colIndex, false)} // Passa false para o botão False
                                    >
                                        Errado
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
