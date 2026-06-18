import React, { useState, useEffect, useRef } from 'react';

const RunnerGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('jobSnakeHighScore')) || 0;
    } catch {
      return 0;
    }
  });

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Game Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Grid settings
    const GRID_SIZE = 20;
    let cols = 0;
    let rows = 0;

    const resize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 800;
      canvas.height = canvas.parentElement.clientHeight || 280;
      cols = Math.floor(canvas.width / GRID_SIZE);
      rows = Math.floor(canvas.height / GRID_SIZE);
    };
    window.addEventListener('resize', resize);
    resize();

    // Game Variables
    let animationId;
    let frame = 0;
    let currentScore = 0;
    let gameSpeed = 8; // Frames per move (lower is faster)
    
    let snake = [];
    let direction = { x: 1, y: 0 };
    let nextDirection = { x: 1, y: 0 }; // buffer to prevent reverse self-collision
    let food = { x: 0, y: 0, type: 'NORMAL' };
    let particles = [];

    const spawnFood = () => {
      let valid = false;
      let newX, newY;
      while (!valid) {
        newX = Math.floor(Math.random() * (cols - 2)) + 1;
        newY = Math.floor(Math.random() * (rows - 2)) + 1;
        valid = !snake.some(segment => segment.x === newX && segment.y === newY);
      }
      food = { 
        x: newX, 
        y: newY, 
        type: Math.random() > 0.8 ? 'GOLD' : 'NORMAL' // 20% chance for gold food
      };
    };

    const initGame = () => {
      const startX = Math.floor(cols / 4);
      const startY = Math.floor(rows / 2);
      snake = [
        { x: startX, y: startY },
        { x: startX - 1, y: startY },
        { x: startX - 2, y: startY }
      ];
      direction = { x: 1, y: 0 };
      nextDirection = { x: 1, y: 0 };
      currentScore = 0;
      gameSpeed = 12; // Start slower
      spawnFood();
    };

    if (hasStarted && !gameOver && snake.length === 0) {
      initGame();
    }

    const keyDown = (e) => {
      if (!hasStarted) {
        if (e.code === 'Space' || e.code === 'Enter' || e.code.startsWith('Arrow')) {
          e.preventDefault();
          setHasStarted(true);
          initGame();
        }
        return;
      }
      
      if (gameOver) return;

      // Prevent reversing into yourself
      if ((e.code === 'ArrowUp' || e.code === 'KeyW') && direction.y !== 1) {
        e.preventDefault();
        nextDirection = { x: 0, y: -1 };
      }
      if ((e.code === 'ArrowDown' || e.code === 'KeyS') && direction.y !== -1) {
        e.preventDefault();
        nextDirection = { x: 0, y: 1 };
      }
      if ((e.code === 'ArrowLeft' || e.code === 'KeyA') && direction.x !== 1) {
        e.preventDefault();
        nextDirection = { x: -1, y: 0 };
      }
      if ((e.code === 'ArrowRight' || e.code === 'KeyD') && direction.x !== -1) {
        e.preventDefault();
        nextDirection = { x: 1, y: 0 };
      }
    };

    window.addEventListener('keydown', keyDown);

    const createExplosion = (x, y, color) => {
      const pxX = x * GRID_SIZE + GRID_SIZE/2;
      const pxY = y * GRID_SIZE + GRID_SIZE/2;
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: pxX, y: pxY,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          color
        });
      }
    };

    const updateScore = (pts) => {
      currentScore += pts;
      setScore(currentScore);
      setHighScore(prev => {
        const h = Math.max(prev, currentScore);
        try { localStorage.setItem('jobSnakeHighScore', h.toString()); } catch {}
        return h;
      });
      // Speed up game slightly as you score
      if (currentScore > 300) gameSpeed = 10;
      if (currentScore > 600) gameSpeed = 8;
      if (currentScore > 1200) gameSpeed = 6;
    };

    const update = () => {
      // Background (Arcade style grid)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for(let x=0; x<canvas.width; x+=GRID_SIZE) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for(let y=0; y<canvas.height; y+=GRID_SIZE) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

      if (hasStarted && !gameOver) {
        if (frame % gameSpeed === 0) {
          direction = nextDirection; // lock in the turn

          const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

          // Screen Wrap (Pass through boundaries)
          if (head.x < 0) head.x = cols - 1;
          else if (head.x >= cols) head.x = 0;
          
          if (head.y < 0) head.y = rows - 1;
          else if (head.y >= rows) head.y = 0;

          // Self Collision
          if (!gameOver) {
            for (let i = 0; i < snake.length; i++) {
              if (head.x === snake[i].x && head.y === snake[i].y) {
                setGameOver(true);
                createExplosion(head.x, head.y, '#ef4444');
                break;
              }
            }
          }

          if (!gameOver) {
            snake.unshift(head); // Add new head

            // Food Collision
            if (head.x === food.x && head.y === food.y) {
              const isGold = food.type === 'GOLD';
              updateScore(isGold ? 50 : 10);
              createExplosion(food.x, food.y, isGold ? '#fbbf24' : '#10b981');
              spawnFood();
              // Don't pop the tail, so snake grows
            } else {
              snake.pop(); // Remove tail
            }
          }
        }
      }

      // Draw Food
      if (hasStarted) {
        const foodPxX = food.x * GRID_SIZE;
        const foodPxY = food.y * GRID_SIZE;
        ctx.fillStyle = food.type === 'GOLD' ? '#fbbf24' : '#10b981';
        ctx.shadowBlur = 15;
        ctx.shadowColor = ctx.fillStyle;
        
        ctx.beginPath();
        // Draw apple/diamond shape
        if (food.type === 'GOLD') {
           ctx.moveTo(foodPxX + GRID_SIZE/2, foodPxY + 2);
           ctx.lineTo(foodPxX + GRID_SIZE - 2, foodPxY + GRID_SIZE/2);
           ctx.lineTo(foodPxX + GRID_SIZE/2, foodPxY + GRID_SIZE - 2);
           ctx.lineTo(foodPxX + 2, foodPxY + GRID_SIZE/2);
        } else {
           ctx.arc(foodPxX + GRID_SIZE/2, foodPxY + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw Snake
      if (hasStarted) {
        for (let i = 0; i < snake.length; i++) {
          const seg = snake[i];
          const pxX = seg.x * GRID_SIZE;
          const pxY = seg.y * GRID_SIZE;
          
          if (i === 0) {
            // Head
            ctx.fillStyle = '#06b6d4'; // Cyan head
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#06b6d4';
            ctx.fillRect(pxX + 1, pxY + 1, GRID_SIZE - 2, GRID_SIZE - 2);
            ctx.shadowBlur = 0;
            // Eyes
            ctx.fillStyle = 'white';
            if (direction.x === 1) { ctx.fillRect(pxX + 12, pxY + 4, 4, 4); ctx.fillRect(pxX + 12, pxY + 12, 4, 4); }
            else if (direction.x === -1) { ctx.fillRect(pxX + 4, pxY + 4, 4, 4); ctx.fillRect(pxX + 4, pxY + 12, 4, 4); }
            else if (direction.y === -1) { ctx.fillRect(pxX + 4, pxY + 4, 4, 4); ctx.fillRect(pxX + 12, pxY + 4, 4, 4); }
            else if (direction.y === 1) { ctx.fillRect(pxX + 4, pxY + 12, 4, 4); ctx.fillRect(pxX + 12, pxY + 12, 4, 4); }
          } else {
            // Body (Gradient fading to tail)
            const alpha = 1 - (i / snake.length) * 0.5;
            ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`; // Blue body
            ctx.fillRect(pxX + 2, pxY + 2, GRID_SIZE - 4, GRID_SIZE - 4);
          }
        }
      }

      // Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = p.life;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillRect(p.x, p.y, 4, 4);
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        }
      }

      if (hasStarted && !gameOver) {
        frame++;
      }
      
      animationId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', keyDown);
      cancelAnimationFrame(animationId);
    };
  }, [hasStarted, gameOver]);

  const restart = () => {
    setGameOver(false);
    setHasStarted(true);
    setScore(0);
  };

  const startGame = (e) => {
    e.stopPropagation();
    setHasStarted(true);
  };

  const containerStyle = isFullscreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#0f172a',
    zIndex: 99999,
    display: 'flex',
    flexDirection: 'column'
  } : {
    position: 'relative',
    height: '280px',
    width: '100%',
    background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    marginTop: '15px',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
  };

  return (
    <div className="runner-game-wrapper" style={{ isolation: 'isolate' }}>
      <div ref={containerRef} style={containerStyle}>
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

        {/* UI Overlay */}
        <button 
          onClick={toggleFullscreen}
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '15px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            zIndex: 100,
            fontSize: '12px'
          }}
        >
          {isFullscreen ? '↙ Minimize' : '⛶ Fullscreen'}
        </button>

        {hasStarted && !gameOver && (
          <div style={{ position: 'absolute', top: '15px', left: '20px', color: '#f8fafc', display: 'flex', gap: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>HIGH SCORE</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#fbbf24' }}>{highScore}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>SCORE</span>
              <span style={{ fontSize: '24px', fontWeight: '900', color: '#06b6d4' }}>{score}</span>
            </div>
          </div>
        )}

        {/* Start Menu */}
        {!hasStarted && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(15, 23, 42, 0.85)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            zIndex: 90
          }}>
            <div style={{ color: '#06b6d4', fontWeight: '900', fontSize: '42px', marginBottom: '5px', textShadow: '0 0 20px rgba(6, 182, 212, 0.8)' }}>
              DATA CRAWLER
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '30px', maxWidth: '400px', textAlign: 'center', fontWeight: '500' }}>
              Use Arrow Keys or WASD to navigate.<br/>
              Collect data nodes (food) to grow your crawler. <br/>
              Don't hit the walls or your own tail!
            </div>
            <button 
              onClick={startGame}
              style={{ 
                background: '#06b6d4', color: 'white', border: 'none', 
                padding: '12px 40px', borderRadius: '30px', cursor: 'pointer', fontSize: '20px', 
                fontWeight: '900', pointerEvents: 'auto', boxShadow: '0 4px 20px rgba(6, 182, 212, 0.5)',
                transition: 'transform 0.1s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              PLAY NOW
            </button>
          </div>
        )}

        {/* Game Over */}
        {gameOver && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            textAlign: 'center', background: 'rgba(15, 23, 42, 0.95)', padding: '40px 60px', borderRadius: '16px',
            border: '2px solid #ef4444', zIndex: 90, boxShadow: '0 0 50px rgba(239, 68, 68, 0.4)'
          }}>
            <div style={{ color: '#ef4444', fontWeight: '900', fontSize: '36px', marginBottom: '10px' }}>CONNECTION LOST</div>
            <div style={{ color: '#f8fafc', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' }}>
              Final Score: <span style={{color: '#06b6d4'}}>{score}</span>
            </div>
            <button 
              onClick={() => restart()}
              style={{ background: '#ef4444', color: 'white', border: 'none', padding: '14px 40px', borderRadius: '30px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold', boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4)' }}
            >
              TRY AGAIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RunnerGame;
