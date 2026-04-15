import { useEffect, useRef, useState, useCallback } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, GAME_SPEED } from '../constants';
import { Trophy, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        switch (direction) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        // Check collisions
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setIsGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#22d3ee' : '#0891b2';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#22d3ee';
      
      // Rounded segments
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#f472b6';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#f472b6';
    const foodX = food.x * cellSize + cellSize / 2;
    const foodY = food.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(foodX, foodY, cellSize / 3, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow for other drawings
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)]">
      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-cyan-500/60 font-mono">Score</span>
          <span className="text-3xl font-bold text-cyan-400 font-mono">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest text-pink-500/60 font-mono">High Score</span>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-pink-400" />
            <span className="text-3xl font-bold text-pink-400 font-mono">{highScore}</span>
          </div>
        </div>
      </div>

      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="rounded-xl border-2 border-cyan-500/20 bg-slate-950 shadow-inner"
        />
        
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm rounded-xl transition-all duration-300">
            {isGameOver ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-4xl font-black text-pink-500 mb-6 tracking-tighter uppercase italic">Game Over</h2>
                <button
                  onClick={resetGame}
                  className="flex items-center gap-2 px-8 py-3 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                >
                  <RotateCcw className="w-5 h-5" />
                  Try Again
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-4xl font-black text-cyan-500 mb-6 tracking-tighter uppercase italic">Paused</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-3 bg-cyan-500 text-slate-950 font-bold rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.5)]"
                >
                  Resume
                </button>
                <p className="mt-4 text-cyan-500/50 text-xs font-mono uppercase tracking-widest">Press Space to Start</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 text-cyan-500/40 text-[10px] font-mono uppercase tracking-[0.2em]">
        <span>Arrows to Move</span>
        <span>•</span>
        <span>Space to Pause</span>
      </div>
    </div>
  );
}
