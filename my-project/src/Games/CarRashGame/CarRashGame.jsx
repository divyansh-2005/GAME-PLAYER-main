import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTma } from "../../Context/tmaProvider";
import "./CarRashGame.css";

const CarRashGame = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const { updateUserPoints } = useTma();

  // Game states
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("carrash_hiscore") || "0", 10);
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [pointsSaved, setPointsSaved] = useState(false);

  // References for mutable game loop variables to prevent state lag
  const gameRef = useRef({
    player: { x: 175, y: 480, width: 45, height: 75, targetX: 175, speed: 8 },
    obstacles: [],
    particles: [],
    speedMultiplier: 1,
    roadOffset: 0,
    keys: {},
    score: 0,
    gameOver: false,
    frameId: null,
  });

  // Track buttons for mobile touch controls
  const handleLeftPress = () => {
    gameRef.current.keys["ArrowLeft"] = true;
  };
  const handleLeftRelease = () => {
    gameRef.current.keys["ArrowLeft"] = false;
  };
  const handleRightPress = () => {
    gameRef.current.keys["ArrowRight"] = true;
  };
  const handleRightRelease = () => {
    gameRef.current.keys["ArrowRight"] = false;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      gameRef.current.keys[e.key] = true;
    };
    const handleKeyUp = (e) => {
      gameRef.current.keys[e.key] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (gameRef.current.frameId) {
        cancelAnimationFrame(gameRef.current.frameId);
      }
    };
  }, []);

  // Main game logic and loops
  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setPointsSaved(false);

    // Reset game mutable state
    gameRef.current = {
      player: { x: 175, y: 480, width: 45, height: 75, targetX: 175, speed: 9 },
      obstacles: [],
      particles: [],
      speedMultiplier: 1.0,
      roadOffset: 0,
      keys: {},
      score: 0,
      gameOver: false,
      frameId: null,
    };

    // Trigger game loop
    gameRef.current.frameId = requestAnimationFrame(gameLoop);
  };

  const gameLoop = () => {
    const state = gameRef.current;
    if (state.gameOver) return;

    updateGame();
    drawGame();

    state.frameId = requestAnimationFrame(gameLoop);
  };

  const updateGame = () => {
    const state = gameRef.current;

    // 1. Move Player with keyboard
    if (state.keys["ArrowLeft"] || state.keys["a"] || state.keys["A"]) {
      state.player.x -= state.player.speed;
    }
    if (state.keys["ArrowRight"] || state.keys["d"] || state.keys["D"]) {
      state.player.x += state.player.speed;
    }

    // Keep player in bounds (Road width is 260px, starts at x=70, ends at x=330)
    const minX = 75;
    const maxX = 325 - state.player.width;
    if (state.player.x < minX) state.player.x = minX;
    if (state.player.x > maxX) state.player.x = maxX;

    // 2. Animate Road
    state.roadOffset += 5 * state.speedMultiplier;
    if (state.roadOffset >= 40) state.roadOffset = 0;

    // 3. Handle Obstacles
    // Spawn new obstacles
    if (state.obstacles.length === 0 || (state.obstacles[state.obstacles.length - 1].y > 200 && Math.random() < 0.02)) {
      const lanes = [85, 175, 265]; // Lane positions
      const randomLane = lanes[Math.floor(Math.random() * lanes.length)];
      
      // Ensure we don't block all lanes simultaneously
      const tooClose = state.obstacles.some(
        (obs) => obs.y < 120
      );

      if (!tooClose) {
        // Neon color schemes for obstacles
        const obstacleColors = ["#00ffff", "#ff007f", "#ffff00", "#7fff00"];
        state.obstacles.push({
          x: randomLane - 22,
          y: -100,
          width: 44,
          height: 75,
          speed: (3 + Math.random() * 2) * state.speedMultiplier,
          color: obstacleColors[Math.floor(Math.random() * obstacleColors.length)],
          passed: false,
        });
      }
    }

    // Move & filter obstacles
    state.obstacles = state.obstacles.filter((obs) => {
      obs.y += obs.speed;

      // Check Score pass trigger
      if (!obs.passed && obs.y > state.player.y) {
        obs.passed = true;
        state.score += 10;
        setScore(state.score);
        // Gradually increase speed as player score climbs
        state.speedMultiplier = 1.0 + (state.score / 200);
      }

      // Check Collision
      if (
        obs.x < state.player.x + state.player.width &&
        obs.x + obs.width > state.player.x &&
        obs.y < state.player.y + state.player.height &&
        obs.y + obs.height > state.player.y
      ) {
        triggerGameOver();
      }

      return obs.y < 600; // Keep obstacles on screen
    });

    // 4. Update particles
    state.particles.forEach((part) => {
      part.x += part.vx;
      part.y += part.vy;
      part.alpha -= 0.02;
    });
    state.particles = state.particles.filter((part) => part.alpha > 0);
  };

  const triggerGameOver = () => {
    const state = gameRef.current;
    state.gameOver = true;
    setGameOver(true);

    // Create massive colorful particles for the collision explosion
    for (let i = 0; i < 40; i++) {
      state.particles.push({
        x: state.player.x + state.player.width / 2,
        y: state.player.y + state.player.height / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        radius: Math.random() * 6 + 2,
        color: i % 2 === 0 ? "#ff007f" : "#00ffff",
        alpha: 1.0,
      });
    }

    // Save High Score
    if (state.score > highScore) {
      setHighScore(state.score);
      localStorage.setItem("carrash_hiscore", state.score.toString());
    }

    // Automatically sync points directly to MongoDB backend!
    if (updateUserPoints && state.score > 0) {
      updateUserPoints(state.score);
      setPointsSaved(true);
    }
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const state = gameRef.current;

    // Clear Screen with deep retro synth background
    ctx.fillStyle = "#0d091a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Horizon Grid lines & star particles
    ctx.strokeStyle = "rgba(100, 40, 160, 0.25)";
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 150);
      ctx.stroke();
    }
    for (let i = 0; i < 150; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // 2. Draw Highway Road borders (cyan neon glow)
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff007f";
    ctx.fillStyle = "#161129";
    ctx.fillRect(70, 0, 260, canvas.height);

    // Side outer glowing markers
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#ff007f";
    ctx.beginPath();
    ctx.moveTo(70, 0);
    ctx.lineTo(70, canvas.height);
    ctx.moveTo(330, 0);
    ctx.lineTo(330, canvas.height);
    ctx.stroke();

    // 3. Draw Moving Road Lane lines (neon cyan glow)
    ctx.shadowColor = "#00ffff";
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 3;
    ctx.setLineDash([25, 25]);
    
    // Lane 1 divider
    ctx.beginPath();
    ctx.moveTo(156, -40 + state.roadOffset);
    ctx.lineTo(156, canvas.height + 40);
    ctx.stroke();

    // Lane 2 divider
    ctx.beginPath();
    ctx.moveTo(242, -40 + state.roadOffset);
    ctx.lineTo(242, canvas.height + 40);
    ctx.stroke();

    ctx.setLineDash([]); // Reset dash

    // 4. Draw Player Car (Neon hot pink theme)
    if (!state.gameOver) {
      ctx.shadowColor = "#ff007f";
      ctx.fillStyle = "#ff007f";
      
      // Main car body
      drawRoundedRect(ctx, state.player.x, state.player.y, state.player.width, state.player.height, 8);
      
      // Cockpit / Windshield (cyan blue tint)
      ctx.fillStyle = "#00ffff";
      drawRoundedRect(ctx, state.player.x + 8, state.player.y + 20, state.player.width - 16, 18, 4);

      // Neon glowing yellow headlights
      ctx.fillStyle = "#ffff00";
      ctx.shadowColor = "#ffff00";
      ctx.fillRect(state.player.x + 6, state.player.y + 4, 8, 4);
      ctx.fillRect(state.player.x + state.player.width - 14, state.player.y + 4, 8, 4);

      // Tail lights
      ctx.fillStyle = "#ff0000";
      ctx.shadowColor = "#ff0000";
      ctx.fillRect(state.player.x + 4, state.player.y + state.player.height - 8, 8, 4);
      ctx.fillRect(state.player.x + state.player.width - 12, state.player.y + state.player.height - 8, 8, 4);

      // Wheels
      ctx.fillStyle = "#080511";
      ctx.shadowBlur = 0;
      ctx.fillRect(state.player.x - 4, state.player.y + 12, 4, 16);
      ctx.fillRect(state.player.x + state.player.width, state.player.y + 12, 4, 16);
      ctx.fillRect(state.player.x - 4, state.player.y + state.player.height - 24, 4, 16);
      ctx.fillRect(state.player.x + state.player.width, state.player.y + state.player.height - 24, 4, 16);
    }

    // 5. Draw Obstacles (Vibrant neon colors)
    state.obstacles.forEach((obs) => {
      ctx.shadowBlur = 15;
      ctx.shadowColor = obs.color;
      ctx.fillStyle = obs.color;

      // Car body
      drawRoundedRect(ctx, obs.x, obs.y, obs.width, obs.height, 8);

      // Cockpit
      ctx.fillStyle = "#ffffff";
      drawRoundedRect(ctx, obs.x + 8, obs.y + 35, obs.width - 16, 18, 4);

      // Rear Red Lights
      ctx.fillStyle = "#ff3333";
      ctx.fillRect(obs.x + 6, obs.y + obs.height - 8, 8, 4);
      ctx.fillRect(obs.x + obs.width - 14, obs.y + obs.height - 8, 8, 4);

      // Headlights
      ctx.fillStyle = "#ffff33";
      ctx.fillRect(obs.x + 4, obs.y + 4, 8, 4);
      ctx.fillRect(obs.x + obs.width - 12, obs.y + 4, 8, 4);

      // Wheels
      ctx.fillStyle = "#080511";
      ctx.shadowBlur = 0;
      ctx.fillRect(obs.x - 4, obs.y + 12, 4, 16);
      ctx.fillRect(obs.x + obs.width, obs.y + 12, 4, 16);
      ctx.fillRect(obs.x - 4, obs.y + obs.height - 24, 4, 16);
      ctx.fillRect(obs.x + obs.width, obs.y + obs.height - 24, 4, 16);
    });

    // 6. Draw Explosion Particles
    state.particles.forEach((part) => {
      ctx.shadowBlur = 10;
      ctx.shadowColor = part.color;
      ctx.fillStyle = part.color;
      ctx.globalAlpha = part.alpha;
      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0; // Reset opacity
    ctx.shadowBlur = 0; // Reset shadow
  };

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  return (
    <div className="car-rash-wrapper">
      <div className="game-nav-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          ← Back to Arcade
        </button>
        <div className="neon-title">CAR RASH</div>
        <div className="score-board">
          <div className="stat-box cyan">
            <span className="stat-label">SCORE</span>
            <span className="stat-value">{score}</span>
          </div>
          <div className="stat-box pink">
            <span className="stat-label">HIGH</span>
            <span className="stat-value">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="game-container">
        {!gameStarted && (
          <div className="overlay start-overlay">
            <div className="overlay-content">
              <h1 className="cyber-glitch">NEON SPEEDWAY</h1>
              <p className="description">
                Dodge oncoming neon vehicles on the cyber highway. 
                Collect high scores to earn persistent Arcade Wallet Points!
              </p>
              <div className="key-guides">
                <div className="guide-item">
                  <span className="key-cap">A</span> or <span className="key-cap">←</span>
                  <span className="guide-text">Steer Left</span>
                </div>
                <div className="guide-item">
                  <span className="key-cap">D</span> or <span className="key-cap">→</span>
                  <span className="guide-text">Steer Right</span>
                </div>
              </div>
              <button className="neon-play-btn" onClick={startGame}>
                START ENGINE
              </button>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="overlay gameover-overlay">
            <div className="overlay-content">
              <h2 className="text-red-500 text-4xl font-extrabold mb-2 tracking-wider">GAME CRASHED</h2>
              <div className="final-score">
                <span>Final Score: </span>
                <span className="score-num">{score}</span>
              </div>
              {pointsSaved && (
                <div className="database-success">
                  ✨ +{score} persistent wallet points synced successfully!
                </div>
              )}
              <div className="overlay-buttons">
                <button className="neon-play-btn retry" onClick={startGame}>
                  DRIVE AGAIN
                </button>
                <button className="neon-play-btn exit" onClick={() => navigate("/")}>
                  ARCADE HOME
                </button>
              </div>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={400}
          height={600}
          className="game-canvas"
        />

        {/* Mobile controls */}
        <div className="mobile-controls-panel">
          <button
            className="mobile-steer-btn left"
            onMouseDown={handleLeftPress}
            onMouseUp={handleLeftRelease}
            onTouchStart={handleLeftPress}
            onTouchEnd={handleLeftRelease}
          >
            ◀
          </button>
          <button
            className="mobile-steer-btn right"
            onMouseDown={handleRightPress}
            onMouseUp={handleRightRelease}
            onTouchStart={handleRightPress}
            onTouchEnd={handleRightRelease}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarRashGame;
