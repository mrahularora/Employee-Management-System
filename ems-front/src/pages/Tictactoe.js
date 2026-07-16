import React, { useState, useEffect } from 'react';
import "../index.css";
import EmployeeHeader from "../components/EmployeeHeader";
import EmployeeNavigation from "../components/EmployeeNavigation";
import EmployeeFooter from "../components/EmployeeFooter";
import '../TicTacToe.css';

const Square = ({ value, onClick }) => (
  <button className="square btn btn-light" onClick={onClick}>
    {value}
  </button>
);

const Board = ({ squares, onClick }) => {
  const renderSquare = (i) => (
    <Square value={squares[i]} onClick={() => onClick(i)} />
  );

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}{renderSquare(1)}{renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}{renderSquare(4)}{renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}{renderSquare(7)}{renderSquare(8)}
      </div>
    </div>
  );
};

const calculateWinner = (squares) => {
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
      return squares[a];
    }
  }
  return null;
};

const TicTacToe = () => {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [playerX, setPlayerX] = useState("");
  const [playerO, setPlayerO] = useState("");
  const [scoreX, setScoreX] = useState(0);
  const [scoreO, setScoreO] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [playerXName, setPlayerXName] = useState("");
  const [playerOName, setPlayerOName] = useState("");

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      if (winner === 'X') {
        setScoreX((score) => score + 1);
      } else {
        setScoreO((score) => score + 1);
      }
      const timeout = setTimeout(() => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (squares.every(square => square !== null)) {
      const timeout = setTimeout(() => {
        setSquares(Array(9).fill(null));
        setXIsNext(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [squares]);

  const handleClick = (i) => {
    const newSquares = squares.slice();
    if (calculateWinner(newSquares) || newSquares[i]) {
      return;
    }
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const startNewGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const handleReset = () => {
    startNewGame();
    setScoreX(0);
    setScoreO(0);
  };

  const handleStartGame = (e) => {
    e.preventDefault();
    setPlayerX(playerXName);
    setPlayerO(playerOName);
    setGameStarted(true);
  };

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = `Winner: ${winner === 'X' ? playerX : playerO}`;
  } else if (squares.every(square => square !== null)) {
    status = 'Draw!';
  } else {
    status = `Next player: ${xIsNext ? playerX : playerO}`;
  }

  return (
    <div>
    <EmployeeHeader />
    <EmployeeNavigation />
    <div className="game container">
      {!gameStarted ? (
         <form onSubmit={handleStartGame} className="player-form">
         <div className="form-group">
           <label>
             Player X Name:
             
           </label><input
               type="text"
               placeholder="Player X Name"
               className="form-control"
               value={playerXName}
               onChange={(e) => setPlayerXName(e.target.value)}
               required
             />
         </div>
         <div className="form-group">
           <label>
             Player O Name:
            
           </label> <input
               type="text"
               className="form-control"
               placeholder="Player O Name"
               value={playerOName}
               onChange={(e) => setPlayerOName(e.target.value)}
               required
             />
         </div>
         <button type="submit" className="btn btn-primary mt-3">Start Game</button>
       </form>
      ) : (
        <>
          <div className="game-info text-center">
            <h3>{playerX} (X) vs {playerO} (O)</h3>
            <div className="status">{status}</div>
            <div className="score">
              {playerX} (X): {scoreX} - {playerO} (O): {scoreO}
            </div>
           
          </div>
          <div className="game-board">
            <Board squares={squares} onClick={handleClick} />
          </div>

          <button className="reset-button btn btn-warning" onClick={handleReset}>Reset</button>
        </>
      )}
    </div>
    <EmployeeFooter />
    </div>
  );
};

export default TicTacToe;
