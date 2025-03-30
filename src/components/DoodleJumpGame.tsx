
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
  const [gameOver, setGameOver] = useState(false);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  
  const gameRef = useRef<{
    player: Player;
    platforms: Platform[];
    keys: { [key: string]: boolean };
    gameActive: boolean;
    animationFrameId: number | null;
    gameAreaHeight: number;
    gameAreaWidth: number;
    viewportOffset: number;
    initialPlatformY: number;
  }>({
    player: {
      x: 0,
      y: 0,
      velocityY: 0,
      velocityX: 0,
      width: 40,
      height: 50,
      isJumping: false,
    },
    platforms: [],
    keys: {},
    gameActive: false,
    animationFrameId: null,
    gameAreaHeight: 0,
    gameAreaWidth: 0,
    viewportOffset: 0,
    initialPlatformY: 0,
  });

  // Load player image on mount
  useEffect(() => {
    const playerImage = new Image();
    playerImage.src = '/lovable-uploads/f8be5753-5265-4a3b-b018-aa7a4b595c40.png';
    playerImage.onload = () => {
      playerImageRef.current = playerImage;
    };
    
    return () => {
      playerImageRef.current = null;
    };
  }, []);

  const startGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Reset game state
    setScore(0);
    setGameOver(false);

    // Set canvas dimensions based on parent container
    const footerSection = canvas.parentElement;
    if (footerSection) {
      canvas.width = footerSection.clientWidth;
      canvas.height = 400; // Increase height for better gameplay
      
      gameRef.current.gameAreaWidth = canvas.width;
      gameRef.current.gameAreaHeight = canvas.height;
      gameRef.current.viewportOffset = 0;
      
      // Initialize player position
      gameRef.current.player = {
        x: canvas.width / 2 - 20,
        y: canvas.height - 150,
        velocityY: 0,
        velocityX: 0,
        width: 40,
        height: 50,
        isJumping: false,
      };
      
      // Create initial platforms
      gameRef.current.platforms = [];
      const platformCount = 10;
      
      // First platform directly under the player
      gameRef.current.platforms.push({
        x: canvas.width / 2 - 30,
        y: canvas.height - 100,
        width: 60,
      });
      
      gameRef.current.initialPlatformY = canvas.height - 100;
      
      // Generate other random platforms
      for (let i = 1; i < platformCount; i++) {
        gameRef.current.platforms.push({
          x: Math.random() * (canvas.width - 80) + 40,
          y: (canvas.height - 150) - i * (canvas.height / platformCount),
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
    
    // Draw background - light blue sky like Studio Ghibli
    const ghibliGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    ghibliGradient.addColorStop(0, '#87CEEB'); // Light sky blue at top
    ghibliGradient.addColorStop(1, '#E0F7FA'); // Lighter blue at bottom
    ctx.fillStyle = ghibliGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some Ghibli-style clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(
        (canvas.width / 5) * i + 50 + Math.sin(Date.now() / 2000 + i) * 30,
        50 + i * 20, 
        30 + i * 5, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }
    
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
    
    // Screen wrapping for player
    if (player.x > canvas.width) {
      player.x = 0;
    } else if (player.x < 0) {
      player.x = canvas.width;
    }
    
    // Check if player is moving upward past half the screen
    if (player.y < canvas.height / 2 && player.velocityY < 0) {
      // Move viewport instead of player
      gameRef.current.viewportOffset -= player.velocityY;
      
      // Move platforms down
      platforms.forEach(platform => {
        platform.y -= player.velocityY;
      });
      
      // Player stays at half screen
      player.y = canvas.height / 2;
      
      // Increase score based on upward movement
      setScore(prev => prev + Math.round(-player.velocityY));
    }
    
    // Generate new platforms as the game scrolls up
    if (platforms[platforms.length - 1].y > 100) {
      platforms.push({
        x: Math.random() * (canvas.width - 80) + 40,
        y: 0,
        width: 60,
      });
    }
    
    // Remove platforms that are no longer visible
    if (platforms.length > 15) {
      platforms.shift();
    }
    
    // Check game over - player falls below viewport
    if (player.y > canvas.height) {
      gameRef.current.gameActive = false;
      setIsActive(false);
      setGameOver(true);
      return;
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
        player.velocityY = -10; // Jump velocity
        player.isJumping = true;
      }
    });
    
    // Draw platforms - Ghibli-style green grass platforms
    ctx.fillStyle = '#8FBC8F'; // Green for platforms
    platforms.forEach((platform) => {
      ctx.beginPath();
      ctx.roundRect(platform.x, platform.y, platform.width, 10, 5);
      ctx.fill();
      
      // Add grass tufts
      ctx.fillStyle = '#90EE90';
      for (let i = 0; i < platform.width; i += 8) {
        ctx.fillRect(platform.x + i, platform.y - 2, 3, 3);
      }
      ctx.fillStyle = '#8FBC8F';
    });
    
    // Draw player as the uploaded image
    if (playerImageRef.current) {
      // Calculate source position to crop just one face from the image
      // This is an estimation; adjust values based on actual image
      const faceSize = 100; // Approximate size of one face in the image
      const sourceX = 0; // Position of the first face
      const sourceY = 0;
      
      ctx.drawImage(
        playerImageRef.current,
        sourceX, sourceY, faceSize, faceSize, // Source rectangle
        player.x, player.y, player.width, player.height // Destination rectangle
      );
    } else {
      // Fallback if image not loaded
      ctx.fillStyle = '#8B4513'; // Brown for skin tone
      ctx.fillRect(player.x, player.y, player.width, player.height - 15); // Body
      
      // Head
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y - 5, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw clothes (blue outfit like in Ghibli image)
      ctx.fillStyle = '#1A5276'; // Dark blue
      ctx.fillRect(player.x, player.y + player.height - 15, player.width, 15); // Pants
    }
    
    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '16px "Poppins", sans-serif';
    ctx.fillText(`Score: ${score}`, 10, 25);
    
    // Instructions
    ctx.fillText('Use ← → arrow keys to move', canvas.width / 2 - 100, 25);
    
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
        if (!gameRef.current.gameActive && !gameOver) {
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
  }, [gameOver]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-pointer"
        onClick={() => !isActive && !gameOver ? startGame() : stopGame()}
      />
      {!isActive && !gameOver && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="px-6 py-3 bg-[#EA6D57] text-white rounded-md hover:bg-[#D55D49] transition-colors font-heading shadow-lg"
            onClick={startGame}
          >
            Surprise Me!
          </button>
        </div>
      )}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-xs">
            <h3 className="text-2xl font-bold mb-2 font-heading">Game Over!</h3>
            <p className="mb-4">Your score: <span className="font-bold">{score}</span></p>
            <button
              className="px-6 py-3 bg-[#EA6D57] text-white rounded-md hover:bg-[#D55D49] transition-colors font-heading"
              onClick={startGame}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoodleJumpGame;
