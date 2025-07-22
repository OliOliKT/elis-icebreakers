'use client';

import { useEffect, useState } from 'react';

const gradients = [
  'from-purple-700 via-pink-500 to-red-400',
  'from-blue-700 via-indigo-500 to-purple-400',
  'from-green-600 via-teal-400 to-cyan-300',
  'from-yellow-600 via-orange-400 to-pink-400',
  'from-rose-600 via-fuchsia-500 to-indigo-500',
];

export default function Home() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [gradient, setGradient] = useState<string>(gradients[0]);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/questions.json');
      const data = await res.json();
      setQuestions(data);
    };

    setGradient(gradients[Math.floor(Math.random() * gradients.length)]);
    fetchQuestions();
  }, []);

  const getRandomQuestion = () => {
    if (questions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * questions.length);
    setCurrentQuestion(questions[randomIndex]);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${gradient} text-white p-6 relative`}
    >
      {/* Rules Tooltip Icon */}
      <button
        className="absolute top-6 right-6 text-white text-2xl font-bold bg-white/20 p-2 rounded-full hover:bg-white/30 transition cursor-pointer"
        onClick={() => setShowRules(!showRules)}
        aria-label="Show rules"
      >
        ?
      </button>

      {/* Rules Tooltip */}
      {showRules && (
        <div className="absolute top-20 right-6 bg-white text-gray-800 p-4 rounded-xl shadow-xl w-80 text-sm z-10">
          <h2 className="font-bold mb-2">How to play</h2>
          <p>
            This game is called <strong>Eli’s Icebreakers</strong>. Just click the button and answer the
            question that pops up - honestly, weirdly, or with flair.
          </p>
          <p className="mt-2">
            Great for road trips, parties, awkward silences, or getting to know people better. Some
            questions are deep, some are dumb, and some may get you canceled. Use responsibly.
          </p>
        </div>
      )}

      {/* Title */}
      <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg text-center animate-pulse">
        Eli's Icebreakers
      </h1>

      {/* Ask Question Button */}
      <button
        onClick={getRandomQuestion}
        className="bg-white text-purple-700 font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl hover:bg-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer"
      >
        Ask a question
      </button>

      {/* Question Output */}
      {currentQuestion && (
        <div className="mt-12 max-w-3xl text-center text-2xl bg-white/90 text-purple-900 p-8 rounded-3xl shadow-2xl backdrop-blur-sm animate-fade-in">
          {currentQuestion}
        </div>
      )}
    </main>
  );
}