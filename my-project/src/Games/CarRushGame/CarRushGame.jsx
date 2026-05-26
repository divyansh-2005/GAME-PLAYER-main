import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Back from "../../Components/Back";
import "./CarRush.css";

const LANE_COUNT = 3;
const LANE_WIDTH = 80;
const CAR_HEIGHT = 60;
const CAR_WIDTH = 50;
const ROAD_WIDTH = LANE_COUNT * LANE_WIDTH;
const ROAD_HEIGHT = 500;
const OBSTACLE_HEIGHT = 60;
const OBSTACLE_WIDTH = 50;
const INITIAL_SPEED = 3;

const CarRushGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const gameState = useRef({
    playerLane: 1,
    obstacles: [],
    speed: INITIAL_SPEED,
    frameCount: 0,
    score: 0,
    roadOffset: 0,
    gameOver: false,
  });

  useEffect(() => {
    const hs = localStorage.getItem("carRushHighScore");
    if (hs) setHighScore(parseInt(hs));
  }, []);

  const spawnObstacle = useCallback(() => {
    const lane = Math.floor(Math.random() * LANE_COUNT);
    gameState.current.obstacles.push({
      lane,
      y: -OBSTACLE_HEIGHT,
    });
  }, []);

  const resetGame = useCallback(() => {
    gameState.current = {
      playerLane: 1,
      obstacles: [],
      speed: INITIAL_SPEED,
      frameCount: 0,
      score: 0,
      roadOffset: 0,
      gameOver: false,
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  }, []);

  const drawCar = useCallback((ctx, x, y, color, isPlayer) => {
    // Car body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, CAR_WIDTH, CAR_HEIGHT, 8);
    ctx.fill();

    // Windshield
    ctx.fillStyle = isPlayer ? "#87CEEB" : "#444";
    ctx.fillRect(x + 8, y + 8, CAR_WIDTH - 16, 15);

    // Headlights
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(x + 5, y + CAR_HEIGHT - 8, 8, 5);
    ctx.fillRect(x + CAR_WIDTH - 13, y + CAR_HEIGHT - 8, 8, 5);

    // Wheels
    ctx.fillStyle = "#333";
    ctx.fillRect(x - 4, y + 8, 6, 12);
    ctx.fillRect(x + CAR_WIDTH - 2, y + 8, 6, 12);
    ctx.fillRect(x - 4, y + CAR_HEIGHT - 20, 6, 12);
    ctx.fillRect(x + CAR_WIDTH - 2, y + CAR_HEIGHT - 20, 6, 12);
  }, []);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animFrameId;

    const gameLoop = () => {
      const state = gameState.current;
      if (state.gameOver) return;

      state.frameCount++;
      state.roadOffset = (state.roadOffset + state.speed) % 40;

      // Spawn obstacles
      if (state.frameCount % Math.max(30, 60 - Math.floor(state.score / 5)) === 0) {
        spawnObstacle();
      }

      // Move obstacles
      state.obstacles = state.obstacles
        .map((obs) => ({ ...obs, y: obs.y + state.speed }))
        .filter((obs) => obs.y < ROAD_HEIGHT + OBSTACLE_HEIGHT);

      // Collision detection
      const playerX = 15 + state.playerLane * LANE_WIDTH + (LANE_WIDTH - CAR_WIDTH) / 2;
      const playerY = ROAD_HEIGHT - CAR_HEIGHT - 20;

      for (const obs of state.obstacles) {
        const obsX = 15 + obs.lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2;
        if (
          obs.y + OBSTACLE_HEIGHT > playerY &&
          obs.y < playerY + CAR_HEIGHT &&
          obsX + OBSTACLE_WIDTH > playerX &&
          obsX < playerX + CAR_WIDTH
        ) {
          state.gameOver = true;
          setGameOver(true);
          const finalScore = state.score;
          setScore(finalScore);
          const hs = localStorage.getItem("carRushHighScore") || 0;
          if (finalScore > parseInt(hs)) {
            localStorage.setItem("carRushHighScore", finalScore.toString());
            setHighScore(finalScore);
          }
          return;
        }
      }

      // Increase score & speed
      if (state.frameCount % 10 === 0) {
        state.score++;
        setScore(state.score);
      }
      if (state.frameCount % 200 === 0) {
        state.speed += 0.5;
      }

      // Draw road
      ctx.fillStyle = "#333";
      ctx.fillRect(0, 0, ROAD_WIDTH + 30, ROAD_HEIGHT);

      // Road edges
      ctx.fillStyle = "#fff";
      ctx.fillRect(12, 0, 4, ROAD_HEIGHT);
      ctx.fillRect(ROAD_WIDTH + 14, 0, 4, ROAD_HEIGHT);

      // Lane dashes
      ctx.fillStyle = "#fff";
      for (let i = 1; i < LANE_COUNT; i++) {
        for (let y = -40 + state.roadOffset; y < ROAD_HEIGHT; y += 40) {
          ctx.fillRect(15 + i * LANE_WIDTH - 2, y, 4, 20);
        }
      }

      // Draw obstacles
      const obstacleColors = ["#e74c3c", "#e67e22", "#9b59b6"];
      state.obstacles.forEach((obs) => {
        const obsX = 15 + obs.lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_WIDTH) / 2;
        drawCar(ctx, obsX, obs.y, obstacleColors[obs.lane % 3], false);
      });

      // Draw player car
      drawCar(ctx, playerX, playerY, "#3498db", true);

      animFrameId = requestAnimationFrame(gameLoop);
    };

    animFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameStarted, gameOver, spawnObstacle, drawCar]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted || gameOver) return;
      const state = gameState.current;
      if (e.key === "ArrowLeft" && state.playerLane > 0) {
        state.playerLane--;
      } else if (e.key === "ArrowRight" && state.playerLane < LANE_COUNT - 1) {
        state.playerLane++;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver]);

  // Touch controls
  const handleTouchStart = useCallback(
    (e) => {
      if (!gameStarted || gameOver) return;
      const touch = e.touches[0];
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const state = gameState.current;
      if (x < rect.width / 2 && state.playerLane > 0) {
        state.playerLane--;
      } else if (x >= rect.width / 2 && state.playerLane < LANE_COUNT - 1) {
        state.playerLane++;
      }
    },
    [gameStarted, gameOver]
  );

  return (
    <>
      <Header />
      <Back />
      <div className="car-rush-container">
        <h1 className="car-rush-title">🏎️ Car Rush</h1>

        <div className="car-rush-stats">
          <div className="car-rush-stat">Score: {score}</div>
          <div className="car-rush-stat">High Score: {highScore}</div>
        </div>

        <div className="car-rush-canvas-wrapper">
          <canvas
            ref={canvasRef}
            width={ROAD_WIDTH + 30}
            height={ROAD_HEIGHT}
            onTouchStart={handleTouchStart}
            className="car-rush-canvas"
          />

          {!gameStarted && !gameOver && (
            <div className="car-rush-overlay">
              <h2>🏁 Car Rush</h2>
              <p>Dodge incoming traffic!</p>
              <p className="car-rush-controls">
                ⬅️ Arrow Left / Arrow Right ➡️
              </p>
              <button className="car-rush-btn" onClick={resetGame}>
                Start Game
              </button>
            </div>
          )}

          {gameOver && (
            <div className="car-rush-overlay">
              <h2>💥 Game Over!</h2>
              <p>Score: {score}</p>
              <button className="car-rush-btn" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
        </div>

        <div className="car-rush-mobile-controls">
          <button
            className="car-rush-mobile-btn"
            onClick={() => {
              if (gameState.current.playerLane > 0)
                gameState.current.playerLane--;
            }}
          >
            ⬅️
          </button>
          <button
            className="car-rush-mobile-btn"
            onClick={() => {
              if (gameState.current.playerLane < LANE_COUNT - 1)
                gameState.current.playerLane++;
            }}
          >
            ➡️
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CarRushGame;
