// src/pages/ComingSoon.jsx

import React, { useState, useEffect } from 'react';

const ComingSoon = () => {
  // countdown target: 24 hours from now
  const [targetTime] = useState(() => Date.now() + 24 * 60 * 60 * 1000);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hrs: 0,
    mins: 0,
    secs: 0
  });

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hrs: 0, mins: 0, secs: 0 });
        clearInterval(timerId);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs  = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hrs, mins, secs });
    };

    // update every second
    const timerId = setInterval(tick, 1000);
    // initialize immediately
    tick();

    return () => clearInterval(timerId);
  }, [targetTime]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-black text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold mb-4">Coming Soon</h1>
        <p className="mb-8 text-lg">
          Our new site launches in:
        </p>

        <div className="flex justify-center space-x-4 mb-8 text-center">
          <div>
            <div className="text-4xl font-mono">{timeLeft.days.toString().padStart(2,'0')}</div>
            <div className="uppercase text-sm text-gray-400">Days</div>
          </div>
          <div>
            <div className="text-4xl font-mono">{timeLeft.hrs.toString().padStart(2,'0')}</div>
            <div className="uppercase text-sm text-gray-400">Hours</div>
          </div>
          <div>
            <div className="text-4xl font-mono">{timeLeft.mins.toString().padStart(2,'0')}</div>
            <div className="uppercase text-sm text-gray-400">Minutes</div>
          </div>
          <div>
            <div className="text-4xl font-mono">{timeLeft.secs.toString().padStart(2,'0')}</div>
            <div className="uppercase text-sm text-gray-400">Seconds</div>
          </div>
        </div>

        <form
          className="flex flex-col sm:flex-row gap-2"
          onSubmit={e => {
            e.preventDefault();
            alert('Thanks! We’ll let you know.');
          }}
        >
          <input
            type="email"
            required
            placeholder="Your email"
            className="flex-1 px-4 py-2 rounded text-black"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold"
          >
            Notify Me
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComingSoon;
