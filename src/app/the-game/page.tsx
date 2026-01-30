'use client';

import Link from 'next/link';
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

export default function TheGamePage() {
  const [gradient, setGradient] = useState<string>(gradients[0]);
  const [questions, setQuestions] = useState<QuestionsData>({ safe: [], nsfw: [] });

  useEffect(() => {
    setGradient(gradients[Math.floor(Math.random() * gradients.length)]);

    const fetchQuestions = async () => {
      const res = await fetch('/questions.json');
      const data: QuestionsData = await res.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  return (
    <main
      className={`min-h-screen bg-gradient-to-br ${gradient} text-white p-6`}
      role="main"
      aria-label="About Eli's Icebreakers"
    >
      <div className="max-w-4xl mx-auto mt-16 bg-black/50 backdrop-blur-sm rounded-3xl shadow-2xl p-10">
        {/* Intro */}
        <h1 className="text-5xl font-extrabold mb-6 text-center drop-shadow-lg">
          Eli's Icebreakers
        </h1>

        <p className="text-lg leading-relaxed mb-4">
          <strong>Eli&apos;s Icebreakers</strong> is a conversation starter game built to
          eliminate awkward silence and help people connect naturally.
        </p>

        <p className="text-lg leading-relaxed mb-4">
          Click a button, get a question, and answer it however you want - honestly,
          humorously, deeply, or impulsively. There are no rules beyond participation.
        </p>

        <p className="text-lg leading-relaxed mb-8">
          Use <strong>Lightning mode</strong> for a fast-paced, high-energy experience, or
          enable <strong>Family-friendly mode</strong> to filter out sensitive topics.
        </p>

        {/* CTA */}
        <div className="text-center mb-12">
          <Link
            href="/"
            className="inline-block bg-white text-purple-900 font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:bg-purple-100 hover:scale-105 transition-all duration-300"
          >
            Play the game
          </Link>
        </div>

        {/* All Questions */}
        <div className="mt-20 mb-8">
        <h2 className="text-4xl font-extrabold mb-4 text-center">
            All Questions
        </h2>

        <p className="text-lg text-white/90">
            Here is the full list of all the questions in the game, including both
            family-friendly prompts and more unfiltered conversation starters.
            This is every question you may encounter while playing.
        </p>
        </div>

        {/* Safe Questions */}
        <section className="mb-10">
          <h3 className="text-xl font-bold mb-4 text-green-300">
            Family-friendly questions
          </h3>
          <ul className="space-y-3 list-disc list-inside text-lg">
            {questions.safe.map((q, idx) => (
              <li key={`safe-${idx}`}>{q}</li>
            ))}
          </ul>
        </section>

        {/* NSFW Questions */}
        <section>
          <h3 className="text-xl font-bold mb-4 text-red-300">
            Unfiltered questions
          </h3>
          <ul className="space-y-3 list-disc list-inside text-lg">
            {questions.nsfw.map((q, idx) => (
              <li key={`nsfw-${idx}`}>{q}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
