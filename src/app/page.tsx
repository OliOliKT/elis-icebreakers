'use client';

import { useEffect, useState } from 'react';

interface QuestionsData {
  safe: string[];
  nsfw: string[];
}

const gradients = [
  'from-purple-700 via-pink-500 to-red-400',
  'from-blue-700 via-indigo-500 to-purple-400',
  'from-green-600 via-teal-400 to-cyan-300',
  'from-yellow-600 via-orange-400 to-pink-400',
  'from-rose-600 via-fuchsia-500 to-indigo-500',
  'from-sky-600 via-blue-400 to-indigo-300',
  'from-red-600 via-amber-400 to-lime-300',
  'from-emerald-600 via-teal-300 to-cyan-500',
  'from-indigo-700 via-violet-500 to-pink-300',
];

export default function Home() {
  const [questionsData, setQuestionsData] = useState<QuestionsData>({ safe: [], nsfw: [] });
  const [safeMode, setSafeMode] = useState<boolean>(true);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [gradient, setGradient] = useState<string>(gradients[0]);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/questions.json');
      const data: QuestionsData = await res.json();
      setQuestionsData(data);
    };

    setGradient(gradients[Math.floor(Math.random() * gradients.length)]);
    fetchQuestions();
  }, []);

  const getRandomQuestion = () => {
    const availableQuestions = safeMode ? questionsData.safe : [...questionsData.safe, ...questionsData.nsfw];
    if (availableQuestions.length === 0) return;
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    setCurrentQuestion(availableQuestions[randomIndex]);
  };

  const toggleSafeMode = () => {
    setSafeMode(!safeMode);
    // Clear current question when switching modes
    setCurrentQuestion(null);
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${gradient} text-white p-6 relative`}
    >
      {/* Rules Tooltip Icon */}
      <button
        className="absolute top-6 right-6 text-white text-xl font-bold bg-white/30 backdrop-blur-sm w-12 h-12 rounded-full hover:bg-white/50 transition cursor-pointer shadow-lg border border-white/50 flex items-center justify-center"
        onClick={() => setShowRules(!showRules)}
        aria-label="Show rules"
      >
        ?
      </button>

      {/* Safe Mode Toggle */}
      <div className="absolute top-6 left-6 flex items-center space-x-3 bg-white/30 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg border border-white/50">
        <button
          onClick={toggleSafeMode}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer ${
            safeMode ? 'bg-green-400' : 'bg-red-400'
          }`}
          aria-label={`Turn ${safeMode ? 'off' : 'on'} safe mode`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
              safeMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-sm font-medium whitespace-nowrap">
          {safeMode ? 'Family-friendly mode' : 'Uncensored mode'}
        </span>
      </div>

      {/* Rules Tooltip */}
      {showRules && (
        <div className="absolute top-20 right-6 bg-white text-gray-800 p-4 rounded-xl shadow-xl w-80 text-sm z-10">
          <h2 className="font-bold mb-2">How to play</h2>
          <p>
            This game is called <strong>Eli's Icebreakers</strong>. Just click the button and answer the
            question that pops up - honestly, weirdly, or with flair.
          </p>
          <p className="mt-2">
            Great for road trips, parties, awkward silences, or getting to know people better. Some
            questions are deep, some are dumb, and some may get you canceled. Use responsibly.
          </p>
          <p className="mt-3 text-xs text-gray-600 border-t pt-2">
            <strong>Safe Mode:</strong> When enabled, only family-friendly questions are shown. 
            Turn it off to include all questions, including NSFW content.
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
        className="bg-white text-purple-900 font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl hover:bg-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer"
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