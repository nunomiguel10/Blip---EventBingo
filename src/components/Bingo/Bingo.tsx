/* eslint-disable react/prop-types */
// @ts-nocheck
// import React from 'react';

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

export const Bingo = ({ events = [], results = [], gridSize = { rows: 3, cols: 3 }, eventFinalResult = [], onCheckToggle, showCheckButtons }) => {
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
                    {row.map((cell, colIndex) => {
                        const isChecked = eventFinalResult[rowIndex * cols + colIndex];
                        const cellClass = isChecked === true ? 'cell-true' : isChecked === false ? 'cell-false' : '';

                        return (
                            <div key={colIndex} className={`bingo-cell ${cellClass}`}>
                                <div className="bingo-event">{cell.event}</div>
                                <div className="bingo-result">{cell.result}</div>
                                {showCheckButtons && (
                                    <div className="check-buttons">
                                        <button
                                            className={`btn btn-success rounded-pill px-3 trueresult-button ${isChecked ? 'checked' : ''}`}
                                            onClick={() => handleCheckToggle(rowIndex * cols + colIndex, true)}
                                        >
                                            Certo
                                        </button>
                                        <button
                                            className={`btn btn-danger rounded-pill px-3 falseresult-button ${isChecked === false ? 'checked' : ''}`}
                                            onClick={() => handleCheckToggle(rowIndex * cols + colIndex, false)}
                                        >
                                            Errado
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
