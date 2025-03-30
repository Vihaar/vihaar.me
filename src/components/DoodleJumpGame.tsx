
import React, { useEffect, useRef, useState } from 'react';

interface Platform {
  x: number;
  y: number;
  width: number;
  element: HTMLElement;
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
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  
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
      height: 50,
      isJumping: false,
    },
    platforms: [],
    keys: {},
    gameActive: false,
    animationFrameId: null,
    gameAreaHeight: 0,
    gameAreaWidth: 0,
  });

  // Load player image
  useEffect(() => {
    const playerImage = new Image();
    playerImage.src = 'public/lovable-uploads/cb50c55b-1318-4eb7-85b5-45911c26b639.png';
    playerImage.onload = () => {
      playerImageRef.current = playerImage;
      console.log("Player image loaded successfully");
    };
    playerImage.onerror = (e) => {
      console.error("Failed to load player image:", e);
    };
  }, []);

  const startGame = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    console.log("Starting game...");

    // Set canvas dimensions based on parent element
    const footerSection = canvas.closest("footer");
    if (footerSection) {
      // Make the game cover the entire footer section
      canvas.width = footerSection.clientWidth;
      canvas.height = footerSection.clientHeight - 120; // Leave space for copyright
      
      gameRef.current.gameAreaWidth = canvas.width;
      gameRef.current.gameAreaHeight = canvas.height;
      
      // Initialize player position
      gameRef.current.player = {
        x: canvas.width / 2 - 15,
        y: canvas.height - 100,
        velocityY: 0,
        velocityX: 0,
        width: 30,
        height: 50,
        isJumping: false,
      };
      
      // Find all link elements and headings in the footer to use as platforms
      const allElements = [
        ...Array.from(footerSection.querySelectorAll('a')), 
        ...Array.from(footerSection.querySelectorAll('h3, h4')),
        ...Array.from(footerSection.querySelectorAll('p'))
      ];
      
      gameRef.current.platforms = [];
      
      allElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const footerRect = footerSection.getBoundingClientRect();
        
        gameRef.current.platforms.push({
          x: rect.left - footerRect.left,
          y: rect.top - footerRect.top,
          width: rect.width,
          element: element as HTMLElement
        });
      });
      
      // Add some additional platforms if needed for better gameplay
      if (gameRef.current.platforms.length < 10) {
        const additionalCount = 10 - gameRef.current.platforms.length;
        for (let i = 0; i < additionalCount; i++) {
          // Create a temporary div element as platform
          const tempElement = document.createElement('div');
          tempElement.style.position = 'absolute';
          tempElement.style.left = `${Math.random() * (canvas.width - 80) + 40}px`;
          tempElement.style.top = `${Math.random() * (canvas.height - 50) + 50}px`;
          tempElement.style.width = '80px';
          tempElement.style.height = '10px';
          tempElement.style.backgroundColor = 'rgba(139, 92, 246, 0.2)';
          footerSection.appendChild(tempElement);
          
          gameRef.current.platforms.push({
            x: parseInt(tempElement.style.left),
            y: parseInt(tempElement.style.top),
            width: 80,
            element: tempElement
          });
        }
      }
      
      gameRef.current.gameActive = true;
      setIsActive(true);
      console.log("Game initialized with", gameRef.current.platforms.length, "platforms");
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
    
    // Draw transparent background
    ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
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
      // Reset position to the top
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
        player.y + player.height < platform.y + 20
      ) {
        player.velocityY = -8; // Jump velocity
        player.isJumping = true;
        setScore(prevScore => prevScore + 10);
        
        // Highlight the platform element when jumped on
        platform.element.classList.add('text-primary');
        
        // If the element has a fluid reveal, trigger hover effect
        const parentElement = platform.element.closest('.relative');
        if (parentElement && parentElement.querySelector('canvas')) {
          // Simulate hover by adding a class or triggering a mouseover event
          const hoverEvent = new MouseEvent('mouseover', {
            view: window,
            bubbles: true,
            cancelable: true
          });
          parentElement.dispatchEvent(hoverEvent);
          
          // Remove after a short delay
          setTimeout(() => {
            const leaveEvent = new MouseEvent('mouseleave', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            parentElement.dispatchEvent(leaveEvent);
          }, 1000);
        }
        
        // Remove highlight after a short delay
        setTimeout(() => {
          platform.element.classList.remove('text-primary');
        }, 300);
      }
    });
    
    // Draw player using the loaded image
    if (playerImageRef.current) {
      const img = playerImageRef.current;
      // Draw the character at 1/4 the original size
      const scale = 0.25;
      const width = img.width * scale;
      const height = img.height * scale;
      ctx.drawImage(
        img, 
        player.x - width / 2 + player.width / 2, 
        player.y - height + player.height, 
        width, 
        height
      );
      
      // Draw a debug outline around the player hitbox for visibility
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.strokeRect(player.x, player.y, player.width, player.height);
    } else {
      // Fallback if image isn't loaded
      ctx.fillStyle = '#8B4513'; // Brown for skin tone
      ctx.fillRect(player.x, player.y, player.width, player.height - 15); // Body
      
      // Head
      ctx.beginPath();
      ctx.arc(player.x + player.width / 2, player.y - 5, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw suit (blue)
      ctx.fillStyle = '#1E40AF';
      ctx.fillRect(player.x, player.y + player.height - 15, player.width, 15); // Pants
    }
    
    // Highlight platforms in game
    ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'; // Light purple highlight
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
    setScore(0);
    
    // Clean up any temporary platforms
    const footerSection = canvasRef.current?.closest("footer");
    if (footerSection) {
      gameRef.current.platforms.forEach(platform => {
        if (platform.element.tagName === 'DIV' && 
            platform.element.style.backgroundColor === 'rgba(139, 92, 246, 0.2)') {
          platform.element.remove();
        }
      });
    }
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
    <div className="w-full h-full relative">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
      />
      {!isActive && (
        <div className="w-full flex items-center justify-center mt-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
            onClick={startGame}
          >
            Start Doodle Jump! (Thanks for scrolling to the end)
          </button>
        </div>
      )}
    </div>
  );
};

export default DoodleJumpGame;
