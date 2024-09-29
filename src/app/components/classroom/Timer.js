'use client';

import { useState, useEffect, useRef } from 'react';

export default function Timer() {
  const [minutes, setMinutes] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0); // To track the initial total seconds
  const [isPaused, setIsPaused] = useState(false); // Track if the timer is paused
  const [isRunning, setIsRunning] = useState(false); // Track if the timer is running
  const timerIdRef = useRef(null); // Reference to store the interval ID

  // Start the timer
  const handleStart = () => {
    const total = parseInt(minutes, 10) * 60;
    setTotalSeconds(total);
    setSecondsLeft(total);
    setIsRunning(true);
    setIsPaused(false); // Ensure we are not paused when starting
  };

  // Pause the timer
  const handlePause = () => {
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current); // Stop the interval
    }
    setIsPaused(true);
  };

  // Resume the timer
  const handleResume = () => {
    setIsPaused(false);
  };

  // Cancel the timer
  const handleCancel = () => {
    clearInterval(timerIdRef.current); // Stop the timer
    setSecondsLeft(0); // Reset the time
    setIsRunning(false); // Reset running state
    setIsPaused(false); // Reset paused state
    setMinutes(''); // Clear minutes input
  };

  // Effect to handle the countdown
  useEffect(() => {
    if (secondsLeft > 0 && isRunning && !isPaused) {
      timerIdRef.current = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(timerIdRef.current); // Clear interval when paused or finished
    }

    // Cleanup interval when the component unmounts or on re-render
    return () => clearInterval(timerIdRef.current);
  }, [secondsLeft, isPaused, isRunning]);

  // Format the time for display
  const formatTime = () => {
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate the progress bar width as a percentage of time left
  const getProgressWidth = () => {
    if (totalSeconds === 0) return '100%';
    return `${(secondsLeft / totalSeconds) * 100}%`;
  };

  return (
    <div className="p-4 border-bottom">
      <div className="flex-grow-1 d-flex align-items-center">
        {/* Input and Start/Cancel button */}
        <input
          type="number"
          className="form-control rounded-pill py-3"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="Enter minutes"
          disabled={isRunning} // Disable input when timer is running
        />

        {/* Conditionally render Start/Cancel buttons */}
        {!isRunning ? (
          <button className="btn btn-primary rounded-pill ms-2" onClick={handleStart}>
            Start
            <img src="/images/timer.png" alt="Timer" className="ms-2" width="24" />
          </button>
        ) : (
          <button className="btn btn-danger rounded-pill ms-2" onClick={handleCancel}>
            Cancel
            <img src="/images/timer.png" alt="Cancel" className="ms-2" width="24" />
          </button>
        )}
      </div>

      {/* Countdown and Progress Bar */}
      {secondsLeft > 0 && (
        <>
          <div className="d-flex justify-content-center align-items-center mt-4">
        


          <button className="btn bg-transparent border-0" onClick={handlePause}>
                <img src="/images/pause.png" alt="pause" className="" width="24" />
              </button>


              <h1 className="text-center timer-text fw-bold px-3">{formatTime()}</h1>

              <button className="btn bg-transparent border-0" onClick={handleResume}>
              <img src="/images/play.png" alt="play" className="" width="30" />
              </button>


 
          </div>

          {/* Progress bar container */}
          <div className="progress-container mt-4 rounded-pill">
            {/* Dynamic progress bar width */}
            <div
              className="progress-bar ms-auto rounded-pill"
              style={{ width: getProgressWidth(), transition: 'width 1s linear' }}
            />
          </div>
        </>
      )}
    </div>
  );
}
