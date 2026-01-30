'use client';

import { useEffect, useState } from 'react';

interface QuestionsData {
  safe: string[];
  nsfw: string[];
}

const gradients = [
  'from-purple-800 via-pink-600 to-red-500',
  'from-blue-800 via-indigo-600 to-purple-500',
  'from-green-700 via-teal-500 to-cyan-400',
  'from-yellow-700 via-orange-500 to-pink-500',
  'from-rose-700 via-fuchsia-600 to-indigo-600',
  'from-sky-700 via-blue-500 to-indigo-400',
  'from-red-700 via-amber-500 to-lime-400',
  'from-emerald-700 via-teal-400 to-cyan-600',
  'from-indigo-800 via-violet-600 to-pink-400',
  'from-orange-700 via-red-500 to-pink-400',
  'from-violet-800 via-purple-600 to-fuchsia-500',
  'from-teal-800 via-green-600 to-lime-500',
  'from-pink-700 via-rose-500 to-orange-400',
  'from-cyan-800 via-blue-600 to-purple-500',
  'from-lime-700 via-yellow-500 to-orange-400',
  'from-fuchsia-800 via-pink-600 to-red-500',
  'from-amber-700 via-yellow-500 to-green-400',
  'from-emerald-800 via-cyan-600 to-blue-500',
  'from-rose-800 via-red-600 to-amber-500',
  'from-indigo-700 via-blue-500 to-cyan-400',
  'from-purple-700 via-violet-500 to-pink-400',
  'from-blue-700 via-cyan-500 to-teal-400',
  'from-green-800 via-emerald-600 to-teal-500',
  'from-red-800 via-rose-600 to-pink-500',
  'from-yellow-800 via-amber-600 to-orange-500',
  'from-violet-700 via-fuchsia-500 to-rose-400',
  'from-slate-700 via-zinc-500 to-gray-400',
  'from-orange-800 via-amber-600 to-yellow-500',
  'from-teal-700 via-cyan-500 to-blue-400',
];

export default function Home() {
  const [questionsData, setQuestionsData] = useState<QuestionsData>({ safe: [], nsfw: [] });
  const [safeMode, setSafeMode] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [gradient, setGradient] = useState<string>(gradients[0]);
  const [showRules, setShowRules] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);
  const [isLightningMode, setIsLightningMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isMounted, setIsMounted] = useState(false);
  const [showMobileToggles, setShowMobileToggles] = useState(false);
  const [intermissionCount, setIntermissionCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/questions.json');
      const data: QuestionsData = await res.json();
      setQuestionsData(data);
    };

    setGradient(gradients[Math.floor(Math.random() * gradients.length)]);
    fetchQuestions();
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Handle rules tooltip
      if (showRules) {
        if (!target.closest('[data-rules-button]') && !target.closest('[data-rules-tooltip]')) {
          setShowRules(false);
        }
      }
      
      // Handle mobile toggles
      if (showMobileToggles) {
        if (!target.closest('[data-mobile-toggles-button]') && !target.closest('[data-mobile-toggles-panel]')) {
          setShowMobileToggles(false);
        }
      }
    };

    if (showRules || showMobileToggles) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRules, showMobileToggles]);

  // Lightning mode timer effect
  useEffect(() => {
  let timer: NodeJS.Timeout;

  // Normal lightning countdown
  if (isLightningMode && timeLeft > 0 && currentQuestion && intermissionCount === null) {
    timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
  }

  // When main timer hits 0 → start intermission
  else if (isLightningMode && timeLeft === 0 && currentQuestion && intermissionCount === null) {
    setIntermissionCount(3);
  }

  // Intermission countdown
  else if (isLightningMode && intermissionCount !== null && intermissionCount > 0) {
    timer = setTimeout(() => {
      setIntermissionCount(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
  }

  // Intermission finished → next question
  else if (isLightningMode && intermissionCount === 0) {
    setIntermissionCount(null);
    setTimeLeft(20);
    getRandomQuestion();
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [isLightningMode, timeLeft, currentQuestion, intermissionCount]);


  const getRandomQuestion = () => {
    const allAvailableQuestions = safeMode ? questionsData.safe : [...questionsData.safe, ...questionsData.nsfw];
    if (allAvailableQuestions.length === 0) return;
    
    // Filter out recent questions to avoid repetition
    let availableQuestions = allAvailableQuestions.filter(question => !recentQuestions.includes(question));
    
    // If we've exhausted all non-recent questions, reset and use all questions
    if (availableQuestions.length === 0) {
      availableQuestions = allAvailableQuestions;
      setRecentQuestions([]); // Clear the recent questions list
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    setCurrentQuestion(selectedQuestion);
    
    // Reset timer for lightning mode
    if (isLightningMode) {
      setTimeLeft(20);
    }
    
    // Update recent questions list (keep last 45)
    setRecentQuestions(prev => {
      const updated = [selectedQuestion, ...prev];
      return updated.slice(0, 45); // Keep only the last 45 questions
    });
  };

  const toggleSafeMode = () => {
    setSafeMode(!safeMode);
    // Clear current question when switching modes
    setCurrentQuestion(null);
    // Clear recent questions when switching modes to avoid cross-mode conflicts
    setRecentQuestions([]);
  };

  // Handle lightning mode toggle
  useEffect(() => {
    if (isLightningMode) {
      setTimeLeft(20);
      if (!currentQuestion) {
        getRandomQuestion();
      }
    } else {
      setCurrentQuestion(null);
      setTimeLeft(20);
    }
  }, [isLightningMode]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Eli's Icebreakers",
            "description": "Interactive question game for breaking the ice at parties, road trips, and social gatherings",
            "url": "https://elis-icebreakers.vercel.app",
            "applicationCategory": "Game",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "author": {
              "@type": "Person",
              "name": "Eli"
            },
            "keywords": "icebreaker, questions, party games, conversation starters, social games"
          })
        }}
      />
      <main
        className={`min-h-screen flex flex-col items-center justify-start bg-gradient-to-br ${gradient} text-white p-6 relative`}
        role="main"
        aria-label="Eli's Icebreakers Game"
        style={{ paddingTop: 'max(30vh, 180px)' }}
      >
      {/* Rules Tooltip Icon */}
      <button
        data-rules-button
        className="absolute top-6 right-6 text-white text-xl font-bold bg-black/50 backdrop-blur-sm w-12 h-12 rounded-full hover:bg-black/60 transition cursor-pointer shadow-lg border border-white/40 flex items-center justify-center"
        onClick={() => setShowRules(!showRules)}
        aria-label="Show rules"
      >
        ?
      </button>

      {/* Mobile Toggle Button (only on small screens) */}
      {isMounted && (
        <button
          data-mobile-toggles-button
          className="sm:hidden absolute top-6 left-6 text-white text-xl font-bold bg-black/50 backdrop-blur-sm w-12 h-12 rounded-full hover:bg-black/60 transition cursor-pointer shadow-lg border border-white/40 flex items-center justify-center"
          onClick={() => setShowMobileToggles(!showMobileToggles)}
          aria-label="Toggle settings"
        >
          ☰
        </button>
      )}

      {/* Desktop Toggles (hidden on small screens) */}
      {isMounted && (
        <div className="hidden sm:flex absolute top-6 left-6 items-center space-x-6 bg-black/50 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-white/40">
          {/* Safe Mode */}
          <div className="flex items-center space-x-3">
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
              Family-friendly mode {safeMode ? '(ON)' : '(OFF)'}
            </span>
          </div>
          
          {/* Lightning Mode */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsLightningMode(!isLightningMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer ${
                isLightningMode ? 'bg-green-400' : 'bg-red-400'
              }`}
              aria-label={`Turn ${isLightningMode ? 'off' : 'on'} lightning mode`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isLightningMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium whitespace-nowrap">
              {isLightningMode ? `⚡ Lightning mode (ON)` : '⚡ Lightning mode (OFF)'}
            </span>
          </div>
        </div>
      )}

      {/* Mobile Toggles Panel */}
      {isMounted && showMobileToggles && (
        <div 
          data-mobile-toggles-panel 
          className="sm:hidden absolute top-20 left-6 bg-white text-gray-800 p-4 rounded-xl shadow-xl w-72 text-sm z-10"
        >
          <h3 className="font-bold mb-3">Settings</h3>
          
          {/* Safe Mode */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <div>
              <div className="font-medium">Family-friendly mode</div>
              <div className="text-xs text-gray-600">Filter inappropriate content</div>
            </div>
            <button
              onClick={toggleSafeMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer ${
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
          </div>
          
          {/* Lightning Mode */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">⚡ Lightning mode</div>
              <div className="text-xs text-gray-600">
                {isLightningMode ? `Fast-paced mode` : 'Fast-paced 20-second timers'}
              </div>
            </div>
            <button
              onClick={() => setIsLightningMode(!isLightningMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer ${
                isLightningMode ? 'bg-green-400' : 'bg-red-400'
              }`}
              aria-label={`Turn ${isLightningMode ? 'off' : 'on'} lightning mode`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  isLightningMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Rules Tooltip */}
      {showRules && (
        <div data-rules-tooltip className="absolute top-20 right-6 bg-white text-gray-800 p-4 rounded-xl shadow-xl w-80 text-sm z-10">
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
            <strong>Family-friendly mode:</strong> When enabled, only family-friendly questions are shown. 
            Turn it off to include all questions, including NSFW content.
          </p>
          <p className="mt-2 text-xs text-gray-600 border-t pt-2">
            <strong>⚡ Lightning mode:</strong> Fast-paced question game with 20-second timers. 
            Questions auto-advance when time runs out. Perfect for high-energy party moments!
          </p>
        </div>
      )}

      {/* Fixed Header Section */}
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Title */}
        <header className="text-center">
          <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg animate-pulse">
            Eli's Icebreakers
          </h1>
        </header>

        {/* Ask Question Button */}
        <section className="text-center">
          {!isLightningMode ? (
            <button
              onClick={getRandomQuestion}
              className="bg-white text-purple-900 font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl hover:bg-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer"
              aria-describedby="question-count"
            >
              Ask a question
            </button>
          ) : (
            <button
              onClick={getRandomQuestion}
              className="bg-yellow-400 text-black font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300 cursor-pointer"
              aria-describedby="question-count"
            >
              Next Question ⚡
            </button>
          )}
        <p id="question-count" className="mt-2 text-sm opacity-75">
          {safeMode 
            ? `${questionsData.safe.length} family-friendly questions available`
            : `${questionsData.safe.length + questionsData.nsfw.length} total questions available`
          }
        </p>
        </section>

        {/* Question Output - positioned to grow downward only */}
        {currentQuestion && (
          <section 
            className={`mt-12 w-full max-w-3xl text-center text-2xl ${
              isLightningMode
                ? 'bg-yellow-100/90 text-yellow-900 pt-14 pb-8 px-8'
                : 'bg-white/90 text-purple-900 p-8'
            } rounded-3xl shadow-2xl backdrop-blur-sm animate-fade-in relative`}
          >
            {isMounted && isLightningMode && (
              <div
                className={`absolute top-4 left-1/2 -translate-x-1/2 text-xl font-extrabold tracking-wide ${
                  timeLeft <= 3 && intermissionCount === null
                    ? 'text-red-600 animate-pulse'
                    : 'text-yellow-700'
                }`}
              >
                {intermissionCount !== null
                  ? 'Next question in…'
                  : `${timeLeft} ${timeLeft === 1 ? 'second' : 'seconds'}`}
              </div>
            )}

            <h2 className="sr-only">Question:</h2>
            {intermissionCount !== null ? (
              <span className="text-3xl font-extrabold">
                {intermissionCount}
              </span>
            ) : (
              currentQuestion
            )}
          </section>
        )}
      </div>
    </main>
    </>
  );
}