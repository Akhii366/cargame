// src/CarRacingGame.js
import React, { useState, useEffect } from 'react';
import './CarRacingGame.css';

const GAME_WIDTH = 300;
const GAME_HEIGHT = 500;
const CAR_WIDTH = 30;
const CAR_HEIGHT = 100; // Adjust the height as needed
const OBSTACLE_WIDTH = 50;
const OBSTACLE_HEIGHT = 30;

// Replace with the actual URL of the obstacle image
const obstacleImageUrl = 'https://png.pngtree.com/png-vector/20241017/ourmid/pngtree-3d-detailed-black-spider-web-design-on-transparent-background-png-image_14095878.png'; 

// Replace with the actual URL of the car image
const carImageUrl = 'https://beta.frvr.ai/img/83I5CWNNxVfAQmkSkmovA4ldKaw=/fit-in/512x512/filters:format(png):quality(85)/https://cdn.frvr.ai/657b6135cf187241b1c7321d.png%3F3'; // Add your car image URL

// Replace with the actual URL of the GIF
const gifBackgroundUrl = 'https://cdn-icons-png.flaticon.com/512/608/608755.png'; // Add your GIF URL

function CarRacingGame() {
  const [carPosition, setCarPosition] = useState(GAME_WIDTH / 2 - CAR_WIDTH / 2);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Handle car movement
  const moveCar = (direction) => {
    setCarPosition((prev) => {
      const newPos = direction === 'left' ? prev - 20 : prev + 20;
      return Math.max(0, Math.min(GAME_WIDTH - CAR_WIDTH, newPos));
    });
  };

  // Generate obstacles at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        { x: Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH), y: -OBSTACLE_HEIGHT }
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Update obstacles and detect collisions
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, y: obs.y + 5 }))
          .filter((obs) => obs.y < GAME_HEIGHT)
      );

      setScore((prev) => prev + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [gameOver]);

  // Collision detection
  useEffect(() => {
    obstacles.forEach((obs) => {
      if (
        obs.y + OBSTACLE_HEIGHT >= GAME_HEIGHT - 60 && // Car height position
        obs.x < carPosition + CAR_WIDTH &&
        obs.x + OBSTACLE_WIDTH > carPosition
      ) {
        setGameOver(true);
      }
    });
  }, [obstacles, carPosition]);

  const resetGame = () => {
    setCarPosition(GAME_WIDTH / 2 - CAR_WIDTH / 2);
    setObstacles([]);
    setScore(0);
    setGameOver(false);
  };

  // Handle key presses for car movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') moveCar('left');
      if (e.key === 'ArrowRight') moveCar('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="game-container">
      <h1>Car Racing Game</h1>
      <div
        className={`game-area ${gameOver ? 'paused' : ''}`} // Add 'paused' class when game is over
        style={{ width: GAME_WIDTH, height: GAME_HEIGHT, backgroundImage: `url(${gifBackgroundUrl})` }}
      >
        <div
          className="car"
          style={{ left: carPosition, bottom: 10, backgroundImage: `https://beta.frvr.ai/img/83I5CWNNxVfAQmkSkmovA4ldKaw=/fit-in/512x512/filters:format(png):quality(85)/https://cdn.frvr.ai/657b6135cf187241b1c7321d.png%3F3(${carImageUrl})` }}
        ></div>
        {obstacles.map((obs, index) => (
          <div
            key={index}
            className="obstacle"
            style={{ left: obs.x, top: obs.y, backgroundImage: `https://png.pngtree.com/png-vector/20241017/ourmid/pngtree-3d-detailed-black-spider-web-design-on-transparent-background-png-image_14095878.png(${obstacleImageUrl})` }}
          ></div>
        ))}
        {gameOver && (
          <div className="game-over">
            <p>Game Over!</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
      <div className="score">Score: {score}</div>
    </div>
  );
}

export default CarRacingGame;
