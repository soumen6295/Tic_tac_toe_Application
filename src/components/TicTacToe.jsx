import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: [a, b, c] };
        }
    }
    return { winner: null, line: [] };
}


export default function TicTacToe() {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
    const [step, setStep] = useState(0);
    const current = history[step];
    const xIsNext = step % 2 === 0;
    const [score, setScore] = useState({ X: 0, O: 0, Draws: 0 });
    const result = calculateWinner(current.squares);
    const winner = result.winner;

    const handleClick = (i) => {
        if (winner || current.squares[i]) return;
        const squares = current.squares.slice();
        squares[i] = xIsNext ? 'X' : 'O';
        const newHistory = history.slice(0, step + 1).concat([{ squares }]);
        const newStep = step + 1;
        setHistory(newHistory);
        setStep(newStep);

        const newResult = calculateWinner(squares);
        if (newResult.winner) {
            setScore((s) => ({ ...s, [newResult.winner]: s[newResult.winner] + 1 }));
        } else if (squares.every(Boolean)) {
            setScore((s) => ({ ...s, Draws: s.Draws + 1 }));
        }
    };

    const jumpTo = (move) => {
        setStep(move);
    };

    const resetBoard = () => {
        setHistory([{ squares: Array(9).fill(null) }]);
        setStep(0);
    };

    const resetScoreboard = () => setScore({ X: 0, O: 0, Draws: 0 });

    const renderSquare = (i) => {
        const isWinningSquare = result.line.includes(i);
        const btnClass = isWinningSquare ? 'btn btn-success w-100 h-100' : 'btn btn-outline-secondary w-100 h-100';
        return (
            <button key={i} onClick={() => handleClick(i)} className={btnClass} style={{ minWidth: 72, minHeight: 72, fontSize: 24, fontWeight: 600, lineHeight: 1, }} aria-label={`square-${i}`}> {current.squares[i]} </button>
        );
    };

    const boardRows = [0, 1, 2].map((r) => (
        <div key={r} className="d-flex gap-2">
            {[0, 1, 2].map(c => renderSquare(r * 3 + c))}
        </div>
    ));

    const moves = history.map((stepState, move) => {
        const desc = move ? `Go to move #${move}` : 'Go to game start';
        return (
            <li key={move} className="mb-1">
                <button className={`btn btn-sm ${move === step ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    const status = winner ? `Winner: ${winner}` : current.squares.every(Boolean) ? 'Draw' : `Next player: ${xIsNext ? 'X' : 'O'}`;

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
            <div className="card shadow" style={{ maxWidth: 920, width: '100%' }}>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2 className="h5 mb-0">Tic‑Tac‑Toe</h2>
                        <div className="text-end small text-muted">
                            Built with <a href="https://react.dev" target="_blank" rel="noreferrer">React</a> &amp; <a href="https://getbootstrap.com/" target="_blank" rel="noreferrer">Bootstrap</a>
                        </div>
                    </div>

                    <div className="row g-3">
                        <div className="col-md-6 d-flex flex-column align-items-center">
                            <div className="mb-3 p-3 bg-white rounded" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.04)' }}>
                                <div className="d-flex flex-column align-items-center">{boardRows}</div>
                            </div>

                            <div className="d-flex gap-2">
                                <button className="btn btn-outline-secondary" onClick={resetBoard}>New Game</button>
                                <button className="btn btn-outline-danger" onClick={resetScoreboard}>Reset Scoreboard</button>
                            </div>

                            <div className="mt-3 text-center">
                                <div className="fw-semibold mb-1">{status}</div>
                                <div className="small text-muted">Tip: click squares to play. Winning line is highlighted.</div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="mb-3">
                                <h6 className="mb-2">Scoreboard</h6>
                                <div className="d-flex gap-3">
                                    <div className="p-2 bg-white rounded text-center" style={{ minWidth: 90 }}>
                                        <div className="small text-muted">X</div>
                                        <div className="fs-4 fw-bold">{score.X}</div>
                                    </div>
                                    <div className="p-2 bg-white rounded text-center" style={{ minWidth: 90 }}>
                                        <div className="small text-muted">O</div>
                                        <div className="fs-4 fw-bold">{score.O}</div>
                                    </div>
                                    <div className="p-2 bg-white rounded text-center" style={{ minWidth: 90 }}>
                                        <div className="small text-muted">Draws</div>
                                        <div className="fs-4 fw-bold">{score.Draws}</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h6 className="mb-2">Move History</h6>
                                <ul className="list-unstyled mb-0">{moves}</ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
