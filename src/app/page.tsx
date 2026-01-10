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
  const [safeMode, setSafeMode] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [gradient, setGradient] = useState<string>(gradients[0]);
  const [showRules, setShowRules] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch('/questions.json');
      const data: QuestionsData = await res.json();
      setQuestionsData(data);
    };

    setGradient(gradients[Math.floor(Math.random() * gradients.length)]);
    fetchQuestions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showRules) {
        // Check if the click was not on the question mark button or the rules tooltip
        const target = event.target as HTMLElement;
        if (!target.closest('[data-rules-button]') && !target.closest('[data-rules-tooltip]')) {
          setShowRules(false);
        }
      }
    };

    if (showRules) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRules]);

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
    
    // Update recent questions list (keep last 25)
    setRecentQuestions(prev => {
      const updated = [selectedQuestion, ...prev];
      return updated.slice(0, 25); // Keep only the last 25 questions
    });
  };

  const toggleSafeMode = () => {
    setSafeMode(!safeMode);
    // Clear current question when switching modes
    setCurrentQuestion(null);
    // Clear recent questions when switching modes to avoid cross-mode conflicts
    setRecentQuestions([]);
  };

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
        className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${gradient} text-white p-6 relative`}
        role="main"
        aria-label="Eli's Icebreakers Game"
      >
      {/* Rules Tooltip Icon */}
      <button
        data-rules-button
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
            <strong>Safe Mode:</strong> When enabled, only family-friendly questions are shown. 
            Turn it off to include all questions, including NSFW content.
          </p>
        </div>
      )}

      {/* Title */}
      <header className="text-center">
        <h1 className="text-5xl font-extrabold mb-8 drop-shadow-lg animate-pulse">
          Eli's Icebreakers
        </h1>
      </header>

      {/* Ask Question Button */}
      <section className="text-center">
        <button
          onClick={getRandomQuestion}
          className="bg-white text-purple-900 font-bold py-4 px-8 rounded-2xl text-xl shadow-2xl hover:bg-purple-100 hover:scale-105 transition-all duration-300 cursor-pointer"
          aria-describedby="question-count"
        >
        Ask a question
      </button>
      <p id="question-count" className="mt-2 text-sm opacity-75">
        {safeMode 
          ? `${questionsData.safe.length} family-friendly questions available`
          : `${questionsData.safe.length + questionsData.nsfw.length} total questions available`
        }
      </p>
      </section>

      {/* Question Output */}
      {currentQuestion && (
        <section 
          className="mt-12 max-w-3xl text-center text-2xl bg-white/90 text-purple-900 p-8 rounded-3xl shadow-2xl backdrop-blur-sm animate-fade-in"
          aria-live="polite"
          aria-label="Current question"
        >
          <h2 className="sr-only">Question:</h2>
          {currentQuestion}
        </section>
      )}
    </main>
    </>
  );
}