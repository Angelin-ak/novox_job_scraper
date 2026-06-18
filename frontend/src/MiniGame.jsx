import React, { useState, useEffect } from 'react';

const MiniGame = () => {
  const [score, setScore] = useState(0);
  const [bugs, setBugs] = useState([]);

  useEffect(() => {
    // Add a new bug every 800ms
    const spawnInterval = setInterval(() => {
      const newBug = {
        id: Math.random().toString(36).substr(2, 9),
        top: Math.random() * 80 + 10, // 10% to 90%
        left: Math.random() * 80 + 10,
        type: Math.random() > 0.8 ? 'gold' : 'normal' // 20% chance of a golden offer!
      };
      
      setBugs(prev => [...prev, newBug]);
      
      // Auto-remove bug after 2 seconds if not clicked
      setTimeout(() => {
        setBugs(prev => prev.filter(b => b.id !== newBug.id));
      }, 2000);
      
    }, 800);

    return () => clearInterval(spawnInterval);
  }, []);

  const catchBug = (id, type, e) => {
    e.stopPropagation();
    if (type === 'gold') {
      setScore(prev => prev + 5);
    } else {
      setScore(prev => prev + 1);
    }
    setBugs(prev => prev.filter(b => b.id !== id));
    
    // Create floating "+1" text effect at click location
    const plusText = document.createElement('div');
    plusText.className = 'floating-score';
    plusText.innerText = type === 'gold' ? '+5' : '+1';
    plusText.style.left = `${e.clientX}px`;
    plusText.style.top = `${e.clientY}px`;
    document.body.appendChild(plusText);
    setTimeout(() => {
        if (document.body.contains(plusText)) {
            document.body.removeChild(plusText);
        }
    }, 1000);
  };

  return (
    <div className="minigame-container" style={{
      position: 'relative',
      height: '160px',
      background: 'rgba(15, 23, 42, 0.4)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginTop: '15px',
      cursor: 'crosshair',
      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '15px',
        color: 'var(--text-muted)',
        fontSize: '12px',
        fontWeight: 600,
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        MINI-GAME: CATCH THE OFFERS!
      </div>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '15px',
        color: 'var(--primary)',
        fontSize: '14px',
        fontWeight: 700,
        zIndex: 10,
        background: 'rgba(37, 99, 235, 0.1)',
        padding: '2px 8px',
        borderRadius: '12px',
        pointerEvents: 'none'
      }}>
        SCORE: {score}
      </div>

      {/* Target Elements */}
      {bugs.map(bug => (
        <div
          key={bug.id}
          onMouseDown={(e) => catchBug(bug.id, bug.type, e)}
          style={{
            position: 'absolute',
            top: `${bug.top}%`,
            left: `${bug.left}%`,
            fontSize: bug.type === 'gold' ? '28px' : '22px',
            transform: 'translate(-50%, -50%)',
            cursor: 'crosshair',
            userSelect: 'none',
            animation: 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            filter: bug.type === 'gold' ? 'drop-shadow(0 0 8px rgba(250, 204, 21, 0.8))' : 'none',
            zIndex: 5
          }}
        >
          {bug.type === 'gold' ? '🏆' : '💼'}
        </div>
      ))}

      <style>{`
        @keyframes popIn {
          0% { transform: translate(-50%, -50%) scale(0); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        .floating-score {
          position: fixed;
          color: #10b981;
          font-weight: bold;
          font-size: 18px;
          pointer-events: none;
          z-index: 99999;
          animation: floatUp 1s ease-out forwards;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MiniGame;
