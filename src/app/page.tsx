"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LogOut, Loader2, X, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BalloonProps {
  id: number;
  x: number;
  color: string;
  speed: number;
  onClick: (id: number) => void;
}

const Balloon: React.FC<BalloonProps> = ({ id, x, color, speed, onClick }) => {
  return (
    <motion.div
      className="absolute cursor-pointer hover:scale-110 transition-transform"
      initial={{ bottom: -100, left: `${x}%` }}
      animate={{ bottom: "110vh" }}
      transition={{ duration: speed, ease: "linear" }}
      onClick={() => onClick(id)}
      style={{
        width: "clamp(40px, 8vw, 60px)",
        height: "clamp(50px, 10vw, 80px)",
      }}
      aria-label="Balloon"
      role="button"
    >
      <svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M30 5 C13 5 5 20 5 35 C5 50 15 65 30 65 C45 65 55 50 55 35 C55 20 47 5 30 5 Z"
          fill={color}
          stroke="white"
          strokeWidth="1"
        />
        <path d="M30 65 L35 80 L25 80 Z" fill={color} />
      </svg>
    </motion.div>
  );
};

interface BalloonData {
  id: number;
  x: number;
  color: string;
  speed: number;
}

const getResultMessage = (score: number) => {
  if (score >= 25)
    return { message: "AMAZING!", emoji: "🎯", color: "text-emerald-500" };
  if (score >= 15)
    return { message: "GREAT JOB!", emoji: "👏", color: "text-blue-500" };
  if (score >= 8)
    return { message: "GOOD!", emoji: "👍", color: "text-amber-500" };
  return { message: "KEEP PRACTICING!", emoji: "💪", color: "text-rose-500" };
};

export default function BalloonPopGame() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState<BalloonData[]>([]);
  const [gameTime, setGameTime] = useState(10);
  const [showResult, setShowResult] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [showWithdrawMessage, setShowWithdrawMessage] = useState(false);
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const maxBalloons = useRef(50);

  const balloonColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D",
    "#1A535C",
    "#FF9F1C",
    "#6A0572",
    "#AB83A1",
    "#F15BB5",
    "#9B5DE5",
    "#00BBF9",
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const name = localStorage.getItem("userName");
      setUserName(name || "Player");
      setLoading(false);
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [router]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameTime(10);
    setBalloons([]);
    setShowResult(false);
    setShowWithdrawMessage(false);

    gameIntervalRef.current = setInterval(() => {
      if (balloons.length < maxBalloons.current) {
        const newBalloon: BalloonData = {
          id: Date.now(),
          x: Math.random() * 90,
          color:
            balloonColors[Math.floor(Math.random() * balloonColors.length)],
          speed: Math.random() * 5 + 3,
        };
        setBalloons((prev) => [
          ...prev.slice(-maxBalloons.current),
          newBalloon,
        ]);
      }
    }, 700);

    timerIntervalRef.current = setInterval(() => {
      setGameTime((prevTime) => {
        if (prevTime <= 1) {
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setGameStarted(false);
    setShowResult(true);

    // Calculate earnings (100 USD per point)
    const newEarnings = score * 100;
    setTotalEarnings((prev) => prev + newEarnings);
  };

  const popBalloon = (id: number) => {
    setBalloons((prev) => prev.filter((balloon) => balloon.id !== id));
    setScore((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    router.push("/login");
  };

  const handleWithdrawClick = () => {
    setShowWithdrawMessage(true);
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex flex-col items-center"
        >
          <Loader2 className="text-indigo-400 h-12 w-12" />
          <p className="mt-4 text-indigo-800 font-medium">Loading game...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8 relative overflow-hidden">
      {/* Game Header */}
      <header className="max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <Sparkles className="text-indigo-500" />
          <h1 className="text-xl font-bold text-indigo-800">
            Balloon Pop Frenzy
          </h1>
        </motion.div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:bg-white transition"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Game Area */}
      <main className="max-w-4xl mx-auto">
        {/* Player Welcome */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2">
            Hello, <span className="text-purple-600">{userName}!</span>
          </h2>
          <p className="text-indigo-600 max-w-lg mx-auto">
            Test your reflexes in this fast-paced balloon popping challenge!
          </p>
        </motion.section>

        {/* Earnings Display */}
        {totalEarnings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-center shadow-sm"
          >
            <p className="text-sm text-amber-600 mb-1">Your Total Earnings</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-3xl font-bold text-amber-700">
                {formatUSD(totalEarnings)}
              </p>
              <button
                onClick={handleWithdrawClick}
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-medium transition"
              >
                Withdraw
              </button>
            </div>
          </motion.div>
        )}

        {/* Game Controls */}
        <section className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-indigo-500 mb-1">Current Score</p>
              <p className="text-4xl font-bold text-indigo-700">{score}</p>
            </div>

            <div className="text-center">
              <p className="text-sm text-indigo-500 mb-1">Time Remaining</p>
              <p className="text-4xl font-bold text-indigo-700">{gameTime}s</p>
            </div>

            {!gameStarted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-8 rounded-full font-bold text-lg shadow-lg"
                onClick={startGame}
              >
                {score > 0 ? "Play Again" : "Start Game"}
              </motion.button>
            )}
          </div>

          {gameStarted && (
            <p className="text-center text-indigo-600 font-medium">
              Click the balloons as fast as you can!
            </p>
          )}
        </section>

        {/* Game Instructions */}
        {!gameStarted && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-indigo-50 rounded-xl p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              How to Play
            </h3>
            <ul className="space-y-2 text-indigo-600">
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Pop as many balloons as you can in 10 seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Each balloon gives you 1 point (worth $100!)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Try to beat your personal best!</span>
              </li>
            </ul>
          </motion.section>
        )}
      </main>

      {/* Balloon Game Area */}
      {gameStarted && (
        <div className="fixed inset-0 pointer-events-auto overflow-hidden">
          {balloons.map((balloon) => (
            <Balloon
              key={balloon.id}
              id={balloon.id}
              x={balloon.x}
              color={balloon.color}
              speed={balloon.speed}
              onClick={popBalloon}
            />
          ))}
        </div>
      )}

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowResult(false)}
                className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-800 mb-2">
                  Game Over!
                </h3>
                <p className="text-indigo-600 mb-6">Your final score:</p>

                <div className="text-6xl font-bold mb-6">
                  <span className={getResultMessage(score).color}>{score}</span>
                </div>

                <div className="text-3xl mb-6">
                  <span className={getResultMessage(score).color}>
                    {getResultMessage(score).message}{" "}
                    {getResultMessage(score).emoji}
                  </span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-amber-600 mb-1">You earned:</p>
                  <p className="text-2xl font-bold text-amber-700">
                    {formatUSD(score * 100)}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">
                    (Total: {formatUSD(totalEarnings + score * 100)})
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-8 rounded-full font-bold text-lg shadow-lg"
                  onClick={startGame}
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdraw Message Modal */}
      <AnimatePresence>
        {showWithdrawMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowWithdrawMessage(false)}
                className="absolute top-4 right-4 text-indigo-400 hover:text-indigo-600"
              >
                <X size={24} />
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                  Surprise! 🎉
                </h3>

                <div className="space-y-4 mb-6">
                  <p className="text-indigo-600">
                    Just kidding! You won&#39;t get a single penny of that{" "}
                    {formatUSD(totalEarnings)}. 😅
                  </p>
                  <p className="text-indigo-600">
                    But hey, how about a virtual coffee instead?
                  </p>
                </div>

                <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-indigo-500 mb-2">
                    Let&#39;s connect and chat about:
                  </p>
                  <ul className="text-xs text-indigo-600 space-y-1">
                    <li>• This fun game you just played</li>
                    <li>• Web development ideas</li>
                    <li>• Or just life in general</li>
                  </ul>
                </div>

                <a
                  href="https://www.linkedin.com/in/akash08akter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white py-3 px-6 rounded-full font-medium transition"
                >
                  <Linkedin size={20} />
                  Let&#39;s Connect on LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
