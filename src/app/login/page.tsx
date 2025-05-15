/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// Question bank
const TEST_QUESTIONS = [
  {
    question: "What's your name? (say anything)",
    answers: ["*"], // Accepts any answer
    hint: "Just type your name!",
  },
  {
    question: "Who is better? (Ronaldo/Messi/Neymar)",
    answers: ["ronaldo", "messi", "neymar"],
    hint: "Football legends",
  },
  {
    question: "Capital of France?",
    answers: ["paris"],
    hint: "Starts with 'P'",
  },
  {
    question: "2 + 2 = ?",
    answers: ["4", "four"],
    hint: "Basic math",
  },
  {
    question: "Which is a fruit? (Apple/Carrot/Potato)",
    answers: ["apple"],
    hint: "🍎",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["mars"],
    hint: "Fourth planet from the sun",
  },
  {
    question: "How many colors are in a rainbow? (number)",
    answers: ["7", "seven"],
    hint: "ROYGBIV",
  },

  // Fun pop culture questions
  {
    question: "Which company owns Instagram?",
    answers: ["meta", "facebook"],
    hint: "Founded by Mark Zuckerberg",
  },
  {
    question: "Complete this: 'Just ___ it' (Nike slogan)",
    answers: ["do"],
    hint: "Nike's famous phrase",
  },

  // Visual/emoji questions
  {
    question: "Which animal is this? 🐧",
    answers: ["penguin"],
    hint: "Lives in Antarctica",
  },
  {
    question: "What does this emoji mean? ❤️",
    answers: ["love", "heart"],
    hint: "Opposite of hate",
  },

  // Simple logic puzzles
  {
    question: "What comes next? A, B, C, ___",
    answers: ["d"],
    hint: "Alphabet sequence",
  },
  {
    question: "If Tuesday is day 2, what's day 4?",
    answers: ["thursday"],
    hint: "Wednesday is day 3",
  },

  // Fun trick questions
  {
    question: "What is always coming but never arrives?",
    answers: ["tomorrow"],
    hint: "Future concept",
  },
  {
    question: "What gets wetter as it dries?",
    answers: ["towel"],
    hint: "Bathroom item",
  },

  // Fun personal questions
  {
    question: "What's the best day of the week?",
    answers: ["*"], // Accepts any answer
    hint: "Your favorite day!",
  },
  {
    question: "Which is tastier? Pizza/Burger/Sushi",
    answers: ["pizza", "burger", "sushi"],
    hint: "Food preferences",
  },

  // Simple wordplay
  {
    question: "Spell 'me' backwards",
    answers: ["em"],
    hint: "Two letters",
  },
  {
    question: "What word rhymes with 'cake'?",
    answers: ["bake", "make", "rake", "wake"],
    hint: "Many possibilities",
  },
];

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showTestChallenge, setShowTestChallenge] = useState(false);
  const [challengeAnswer, setChallengeAnswer] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<{
    question: string;
    answers: string[];
    hint: string;
  } | null>(null);

  // Set random question when challenge starts
  useEffect(() => {
    if (showTestChallenge) {
      const randomIndex = Math.floor(Math.random() * TEST_QUESTIONS.length);
      setCurrentQuestion(TEST_QUESTIONS[randomIndex]);
    }
  }, [showTestChallenge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/v1/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.data.accessToken);
      localStorage.setItem("userName", res.data.data.user.name);
      router.push("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestChallenge = () => {
    setShowTestChallenge(true);
    setSuccessMessage("");
    setError("");
  };

  const verifyChallenge = () => {
    if (!currentQuestion) return;

    // Check if answer matches any acceptable answers (case insensitive)
    const isCorrect = currentQuestion.answers.some(
      (answer) =>
        answer === "*" || // Free pass question
        challengeAnswer.trim().toLowerCase() === answer.toLowerCase()
    );

    if (isCorrect) {
      setEmail("you@gmail.com");
      setPassword("you@1234");
      setSuccessMessage("Test credentials loaded! Ready to login 🚀");
      setShowTestChallenge(false);

      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(`Try again! Hint: ${currentQuestion.hint}`);
    }
    setChallengeAnswer("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
          <div className="text-center mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 4,
              }}
              className="flex justify-center mb-4"
            >
              <Sparkles className="text-indigo-400" size={40} />
            </motion.div>
            <h1 className="text-3xl font-bold text-indigo-700">
              Welcome back!
            </h1>
            <p className="text-indigo-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-6 p-3 rounded-lg text-sm border ${
                error.includes("Try again")
                  ? "bg-amber-100 text-amber-600 border-amber-200"
                  : "bg-rose-100 text-rose-600 border-rose-200"
              }`}
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 bg-green-50 border border-green-200 text-green-600 p-3 rounded-lg text-center text-sm"
            >
              {successMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div whileHover={{ scale: 1.01 }}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-indigo-900 placeholder-indigo-400"
                required
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.01 }}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-indigo-900 placeholder-indigo-400 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-indigo-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-indigo-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <motion.span
                      initial={{ x: -20, opacity: 0 }}
                      animate={{
                        x: isHovered ? 5 : -20,
                        opacity: isHovered ? 1 : 0,
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="ml-1"
                    >
                      →
                    </motion.span>
                  </>
                )}
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{
                    x: isHovered ? "0%" : "-100%",
                    opacity: isHovered ? 0.2 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-white/20"
                />
              </button>
            </motion.div>

            {!showTestChallenge && !successMessage && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleTestChallenge}
                  className="text-sm text-indigo-500 hover:text-indigo-700 font-medium flex items-center justify-center mx-auto group"
                >
                  <Sparkles
                    className="mr-1 group-hover:animate-pulse"
                    size={14}
                  />
                  Get Test Credentials
                  <Sparkles
                    className="ml-1 group-hover:animate-pulse"
                    size={14}
                  />
                </button>
              </div>
            )}

            {showTestChallenge && currentQuestion && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mt-4"
              >
                <h3 className="text-indigo-700 font-medium mb-3 text-center">
                  Quick Challenge 🧠
                </h3>
                <p className="text-indigo-600 mb-3 text-center">
                  {currentQuestion.question}
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={challengeAnswer}
                    onChange={(e) => setChallengeAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyChallenge()}
                    className="flex-1 px-3 py-2 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-300 outline-none"
                    placeholder="Your answer..."
                    autoFocus
                  />
                  <button
                    onClick={verifyChallenge}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                  >
                    Submit
                  </button>
                </div>
                <p className="text-xs text-indigo-400 mt-2 text-center">
                  Hint: {currentQuestion.hint}
                </p>
              </motion.div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-indigo-100">
            <p className="text-center text-sm text-indigo-700">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-purple-600 font-medium hover:text-purple-700 underline underline-offset-4"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
