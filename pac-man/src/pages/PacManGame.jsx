import React, { useState, useEffect, useRef } from 'react';
import './PacManGame.css';

const numRows = 10;
const numCols = 10;

const initialBoard = Array(numRows).fill(Array(numCols).fill(4));

const PacManGame = () => {
  const [pacmanPosition, setPacmanPosition] = useState({ x: 1, y: 1 });
  const [ghostPosition, setGhostPosition] = useState({ x: 8, y: 1 });
  const [board, setBoard] = useState(initialBoard);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const appRef = useRef();

  useEffect(() => {
    appRef.current.focus();
  }, []);

  useEffect(() => {
    const newBoard = JSON.parse(JSON.stringify(board));
    newBoard[pacmanPosition.y][pacmanPosition.x] = 1;
    newBoard[ghostPosition.y][ghostPosition.x] = 2;
    setBoard(newBoard);
  }, [pacmanPosition, ghostPosition]);

  const isValidPosition = (position) => (
    position.x >= 0 &&
    position.x < numCols &&
    position.y >= 0 &&
    position.y < numRows &&
    board[position.y][position.x] !== 3
  );

  const handleKeyDown = (e) => {
    e.preventDefault();
    const moves = {
      ArrowUp: { dx: 0, dy: -1 },
      ArrowDown: { dx: 0, dy: 1 },
      ArrowLeft: { dx: -1, dy: 0 },
      ArrowRight: { dx: 1, dy: 0 },
    };
    if (moves[e.key]) {
      movePacman(moves[e.key].dx, moves[e.key].dy);
    }
  };

  const movePacman = (dx, dy) => {
    let newPosition = { ...pacmanPosition, x: pacmanPosition.x + dx, y: pacmanPosition.y + dy };
    if (isValidPosition(newPosition)) {
      const newBoard = JSON.parse(JSON.stringify(board));
      if (board[newPosition.y][newPosition.x] === 4) {
        setScore(score + 1);
      } else {
        newBoard[pacmanPosition.y][pacmanPosition.x] = 4; // Reset the previous position
      }
      newBoard[newPosition.y][newPosition.x] = 1; // Set the new position
      setBoard(newBoard);
      setPacmanPosition(newPosition);
    }
    if (newPosition.x === ghostPosition.x && newPosition.y === ghostPosition.y) {
      handleCollision();
    }
  };

  const moveGhost = () => {
    const dx = pacmanPosition.x - ghostPosition.x;
    const dy = pacmanPosition.y - ghostPosition.y;
    let newGhostPosition = { ...ghostPosition };
    if (Math.abs(dx) > Math.abs(dy)) {
      newGhostPosition.x += dx > 0 ? 1 : -1;
    } else {
      newGhostPosition.y += dy > 0 ? 1 : -1;
    }
    if (isValidPosition(newGhostPosition)) {
      setGhostPosition(newGhostPosition);
    }
    if (ghostPosition.x === pacmanPosition.x && ghostPosition.y === pacmanPosition.y) {
      handleCollision();
    }
  };

  const handleCollision = () => {
    setGameOver(true);
    // Replace alert with a custom modal or other user-friendly notification
    alert('Game Over');
  };

  return (
    <div
      className="App"
      onKeyDown={handleKeyDown}
      tabIndex="0"
      ref={appRef}
    >
      <div className="score">Score: {score}</div>
      <div className="board">
        {board.map((row, y) => (
          <div key={y} className="row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`cell ${
                  cell === 1 ? 'pacman' : 
                  cell === 2 ? 'ghost' : 
                  cell === 3 ? 'wall' : 
                  cell === 4 ? 'pellet' : ''
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PacManGame;