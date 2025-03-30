
import React, { useEffect, useRef, useState } from 'react';

interface Platform {
  x: number;
  y: number;
  width: number;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  velocityX: number;
  width: number;
  height: number;
  isJumping: boolean;
}

const DoodleJumpGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [score, setScore] = useState(0);
  const gameRef = useRef<{
    player: Player;
    platforms: Platform[];
    keys: { [key: string]: boolean };
    gameActive: boolean;
    animationFrameId: number | null;
    gameAreaHeight: number;
    gameAreaWidth: number;
  }>({
    player: {
      x: 0,
      y: 0,
      velocityY: 0,
      velocityX: 0,
      width: 30,
      height: 40,
      isJumping: false,
    },
    platforms: [],
    keys: {},
    gameActive: false,
    animationFrameId: null,
    gameAreaHeight: 0,
    gameAreaWidth: 0,
  });

  const startGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions based on parent container
    const footerSection = canvas.parentElement;
    if (footerSection) {
      canvas.width = footerSection.clientWidth;
      canvas.height = 300; // Fixed height for the game
      
      gameRef.current.gameAreaWidth = canvas.width;
      gameRef.current.gameAreaHeight = canvas.height;
      
      // Initialize player position
      gameRef.current.player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 100,
        velocityY: 0,
        velocityX: 0,
        width: 30,
        height: 40,
        isJumping: false,
      };
      
      // Create initial platforms
      gameRef.current.platforms = [];
      const platformCount = 8;
      
      for (let i = 0; i < platformCount; i++) {
        gameRef.current.platforms.push({
          x: Math.random() * (canvas.width - 80) + 40,
          y: i === 0 ? canvas.height - 50 : Math.random() * (canvas.height - 50) + 50,
          width: 60,
        });
      }
      
      gameRef.current.gameActive = true;
      setIsActive(true);
      gameLoop();
    }
  };

  const gameLoop = () => {
    if (!canvasRef.current || !gameRef.current.gameActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const { player, platforms, keys } = gameRef.current;
    
    // Draw background
    ctx.fillStyle = 'rgba(241, 240, 251, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update player position based on key presses
    if (keys['ArrowLeft']) {
      player.velocityX = -5;
    } else if (keys['ArrowRight']) {
      player.velocityX = 5;
    } else {
      player.velocityX *= 0.9; // Slow down when no keys pressed
    }
    
    player.x += player.velocityX;
    player.y += player.velocityY;
    player.velocityY += 0.25; // Gravity
    
    // Handle screen wrapping
    if (player.x > canvas.width) {
      player.x = 0;
    } else if (player.x < 0) {
      player.x = canvas.width;
    }
    
    // Check if player fell through the bottom
    if (player.y > canvas.height) {
      player.y = 0;
      setScore(prevScore => prevScore - 50); // Penalty for falling
    }
    
    // Check platform collisions
    platforms.forEach((platform) => {
      if (
        player.velocityY > 0 &&
        player.x + player.width > platform.x &&
        player.x < platform.x + platform.width &&
        player.y + player.height > platform.y &&
        player.y + player.height < platform.y + 10
      ) {
        player.velocityY = -8; // Jump velocity
        player.isJumping = true;
        setScore(prevScore => prevScore + 10);
      }
    });
    
    // Draw player - brown Indian character in pajamas
    ctx.fillStyle = '#8B4513'; // Brown for skin tone
    ctx.fillRect(player.x, player.y, player.width, player.height - 15); // Body
    
    // Head
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y - 5, 10, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw pajamas (light blue)
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(player.x, player.y + player.height - 15, player.width, 15); // Pants
    
    // Draw platforms
    ctx.fillStyle = '#9b87f5'; // Primary purple color
    platforms.forEach((platform) => {
      ctx.fillRect(platform.x, platform.y, platform.width, 10);
    });
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
    
    // Instructions
    ctx.fillText('Use ← → arrow keys to move', canvas.width / 2 - 100, 20);
    
    // Continue the game loop
    gameRef.current.animationFrameId = requestAnimationFrame(gameLoop);
  };

  const stopGame = () => {
    if (gameRef.current.animationFrameId) {
      cancelAnimationFrame(gameRef.current.animationFrameId);
    }
    gameRef.current.gameActive = false;
    setIsActive(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        gameRef.current.keys[e.key] = true;
        
        // Start the game on first key press if not already active
        if (!gameRef.current.gameActive) {
          startGame();
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        gameRef.current.keys[e.key] = false;
      }
    };
    
    const handleResize = () => {
      if (gameRef.current.gameActive) {
        stopGame();
        startGame();
      }
    };
    
    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      
      if (gameRef.current.animationFrameId) {
        cancelAnimationFrame(gameRef.current.animationFrameId);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
        onClick={() => !isActive ? startGame() : stopGame()}
      />
      {!isActive && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            onClick={startGame}
          >
            Start Doodle Jump!
          </button>
        </div>
      )}
    </div>
  );
};

export default DoodleJumpGame;
