// components/Timer.js
'use client';

import { useState, useEffect } from 'react';

export default function Timer() {
  const [minutes, setMinutes] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  const handleStart = () => {
    setSecondsLeft(parseInt(minutes, 10) * 60);
  };

  useEffect(() => {
    if (secondsLeft > 0) {
      const timerId = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [secondsLeft]);

  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 border-bottom">
      <div className="flex-grow-1 d-flex align-items-center">
        <input
          type="number"
          className="form-control rounded-pill py-3"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Enter minutes"
        />
        <button className="btn btn-primary rounded-pill ms-2" onClick={handleStart}>
          Start
          <img src="/images/timer.png" alt="Dice" className="ms-2" width="24" />
        </button>
      </div>
      {secondsLeft > 0 && (
        <h1 className="text-center timer-text mt-4 fw-bold">{formatTime()}</h1>
      )}
    </div>
  );
}
