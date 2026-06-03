import { useEffect, useRef, useState, useCallback } from "react";
import Header from "../../Components/Header";
import Footer from "../../Components/Footer";
import Back from "../../Components/Back";
import "./CarCrashGame.css";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const CAR_WIDTH = 40;
const CAR_HEIGHT = 70;
const LANE_COUNT = 3;
const LANE_WIDTH = CANVAS_WIDTH / LANE_COUNT;

const OBSTACLE_COLORS = ["#e74c3c", "#8e44ad", "#2980b9", "#16a085", "#f39c12"];

const CarCrashGame = () => {
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    running: false,
    score: 0,
    speed: 3,
    frameCount: 0,
    playerLane: 1,
    playerY: CANVAS_HEIGHT - CAR_HEIGHT - 20,
    obstacles: [],
    roadLines: [0, 150, 300, 450],
    animationId: null,
  });

  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("carCrashHighScore")) || 0
  );
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);

  const getPlayerX = (lane) => lane * LANE_WIDTH + LANE_WIDTH / 2 - CAR_WIDTH / 2;

  const drawRoad = (ctx) => {
    // Road background
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Lane dividers
    ctx.setLineDash([30, 20]);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;

    const state = gameStateRef.current;
    for (let i = 1; i < LANE_COUNT; i++) {
      ctx.beginPath();
      const x = i * LANE_WIDTH;
      state.roadLines.forEach((y) => {
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 30);
      });
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Road borders
    ctx.fillStyle = "#2c3e50";
    ctx.fillRect(0, 0, 10, CANVAS_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - 10, 0, 10, CANVAS_HEIGHT);
  };

  const drawCar = (ctx, x, y, color, isPlayer) => {
    // Car body
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, CAR_WIDTH, CAR_HEIGHT, 8);
    ctx.fill();

    // Windshield
    ctx.fillStyle = isPlayer ? "#aed6f1" : "#e74c3c22";
    ctx.fillRect(x + 6, y + (isPlayer ? 10 : CAR_HEIGHT - 25), CAR_WIDTH - 12, 18);

    // Wheels
    ctx.fillStyle = "#111";
    ctx.fillRect(x - 4, y + 8, 8, 14);
    ctx.fillRect(x + CAR_WIDTH - 4, y + 8, 8, 14);
    ctx.fillRect(x - 4, y + CAR_HEIGHT - 22, 8, 14);
    ctx.fillRect(x + CAR_WIDTH - 4, y + CAR_HEIGHT - 22, 8, 14);

    // Headlights / taillights
    ctx.fillStyle = isPlayer ? "#f9ca24" : "#c0392b";
    if (isPlayer) {
      ctx.fillRect(x + 4, y + 2, 10, 6);
      ctx.fillRect(x + CAR_WIDTH - 14, y + 2, 10, 6);
    } else {
      ctx.fillRect(x + 4, y + CAR_HEIGHT - 8, 10, 6);
      ctx.fillRect(x + CAR_WIDTH - 14, y + CAR_HEIGHT - 8, 10, 6);
    }
  };

  const spawnObstacle = () => {
    const state = gameStateRef.current;
    const lane = Math.floor(Math.random() * LANE_COUNT);
    const x = getPlayerX(lane);
    const color = OBSTACLE_COLORS[Math.floor(Math.random() * OBSTACLE_COLORS.length)];
    state.obstacles.push({ x, y: -CAR_HEIGHT, lane, color });
  };

  const checkCollision = (playerX, playerY, obs) => {
    return (
      playerX < obs.x + CAR_WIDTH &&
      playerX + CAR_WIDTH > obs.x &&
      playerY < obs.y + CAR_HEIGHT &&
      playerY + CAR_HEIGHT > obs.y
    );
  };

  const resetGame = useCallback(() => {
    const state = gameStateRef.current;
    state.score = 0;
    state.speed = 3;
    state.frameCount = 0;
    state.playerLane = 1;
    state.obstacles = [];
    state.roadLines = [0, 150, 300, 450];
    setScore(0);
    setGameOver(false);
  }, []);

  const startGame = useCallback(() => {
    resetGame();
    setStarted(true);
    gameStateRef.current.running = true;
  }, [resetGame]);

  const moveLeft = useCallback(() => {
    const state = gameStateRef.current;
    if (state.running && state.playerLane > 0) state.playerLane -= 1;
  }, []);

  const moveRight = useCallback(() => {
    const state = gameStateRef.current;
    if (state.running && state.playerLane < LANE_COUNT - 1) state.playerLane += 1;
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") moveLeft();
      if (e.key === "ArrowRight") moveRight();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [moveLeft, moveRight]);

  // Game loop
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const state = gameStateRef.current;

    const loop = () => {
      if (!state.running) return;

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update road lines
      state.roadLines = state.roadLines.map((y) => {
        let newY = y + state.speed;
        return newY > CANVAS_HEIGHT ? newY - CANVAS_HEIGHT : newY;
      });

      drawRoad(ctx);

      // Spawn obstacles
      state.frameCount++;
      const spawnInterval = Math.max(40, 90 - Math.floor(state.score / 5) * 5);
      if (state.frameCount % spawnInterval === 0) spawnObstacle();

      // Update obstacles
      state.obstacles = state.obstacles
        .map((obs) => ({ ...obs, y: obs.y + state.speed }))
        .filter((obs) => obs.y < CANVAS_HEIGHT);

      // Draw obstacles
      state.obstacles.forEach((obs) => drawCar(ctx, obs.x, obs.y, obs.color, false));

      // Player
      const playerX = getPlayerX(state.playerLane);
      const playerY = state.playerY;
      drawCar(ctx, playerX, playerY, "#27ae60", true);

      // Collision detection
      const crashed = state.obstacles.some((obs) => checkCollision(playerX, playerY, obs));
      if (crashed) {
        state.running = false;
        const finalScore = state.score;
        if (finalScore > parseInt(localStorage.getItem("carCrashHighScore") || "0")) {
          localStorage.setItem("carCrashHighScore", String(finalScore));
          setHighScore(finalScore);
        }
        setGameOver(true);
        return;
      }

      // Score
      state.score++;
      state.speed = 3 + Math.floor(state.score / 100) * 0.5;
      setScore(state.score);

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(10, 10, 140, 36);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px Arial";
      ctx.fillText(`Score: ${state.score}`, 20, 33);

      state.animationId = requestAnimationFrame(loop);
    };

    state.animationId = requestAnimationFrame(loop);
    return () => {
      if (state.animationId) cancelAnimationFrame(state.animationId);
      state.running = false;
    };
  }, [started]);

  return (
    <>
      <Header />
      <Back />
      <div className="car-crash-game">
        <div className="car-crash-container">
          <div className="car-crash-info">
            <h1 className="car-crash-title">🚗 Car Crash Game</h1>
            <div className="car-crash-scores">
              <div className="score-box">
                <span className="score-label">Score</span>
                <span className="score-value">{score}</span>
              </div>
              <div className="score-box">
                <span className="score-label">Best</span>
                <span className="score-value">{highScore}</span>
              </div>
            </div>
            <div className="car-crash-instructions">
              <h3>How to Play</h3>
              <ul>
                <li>⬅️ ➡️ Arrow keys to change lanes</li>
                <li>Avoid oncoming traffic</li>
                <li>Survive as long as possible!</li>
                <li>Speed increases over time</li>
              </ul>
            </div>
            {!started && !gameOver && (
              <button className="car-btn start-btn" onClick={startGame}>
                🚦 Start Game
              </button>
            )}
            {gameOver && (
              <div className="game-over-panel">
                <h2>💥 CRASH!</h2>
                <p>Your Score: <strong>{score}</strong></p>
                <p>Best Score: <strong>{highScore}</strong></p>
                <button className="car-btn restart-btn" onClick={startGame}>
                  🔄 Play Again
                </button>
              </div>
            )}
            <div className="car-mobile-controls">
              <button className="car-btn control-btn" onClick={moveLeft}>◀ Left</button>
              <button className="car-btn control-btn" onClick={moveRight}>Right ▶</button>
            </div>
          </div>
          <div className="car-crash-canvas-wrap">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="car-crash-canvas"
            />
            {!started && !gameOver && (
              <div className="canvas-overlay">
                <p>Press <strong>Start Game</strong> to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CarCrashGame;
