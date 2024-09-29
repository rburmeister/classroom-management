'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// SHHH Overlay Component
function ShhOverlay({ onClose }) {
  const shhRef = useRef(null);

  useEffect(() => {
    const letters = shhRef.current.querySelectorAll('.letter');

    // Create a timeline for the pop-in animation
    const tl = gsap.timeline({
      onComplete: () => {
        // After pop-in, apply bouncing effect to each letter
        gsap.to(letters, {
          y: -10,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          duration: 1.5,
          stagger: 0.1, // Bounce independently
        });
      },
    });

    // Staggered pop-in animation for each letter
    tl.fromTo(
      letters,
      { opacity: 0, scale: 0, y: 50 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(1.7)' }
    );
  }, []);

  return (
    <div className="overlay">
      <div ref={shhRef} className="shh-container">
        {'SHHHHHHHHH'.split('').map((char, index) => (
          <span key={index} className="letter">
            {char}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function VoiceLevelDetector() {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioRef = useRef(null); // For the audio file
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [isShhVisible, setIsShhVisible] = useState(false); // State to toggle SHHHHHHHHH overlay
  const [cooldown, setCooldown] = useState(false); // Cooldown state to prevent retriggering

  // Volume thresholds
  const lowThreshold = 30;
  const mediumThreshold = 60;
  const highThreshold = 90;

  useEffect(() => {
    let animationId;
    let audioStream;

    const init = async () => {
      try {
        // Request microphone access
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(audioStream);

        // Create an analyser node
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const balls = Array.from({ length: 50 }, () => ({
          x: Math.random() * WIDTH,
          y: Math.random() * HEIGHT,
          vx: 0,
          vy: 0,
          radius: 5 + Math.random() * 10,
        }));

        // Function to calculate volume from frequency data
        const calculateVolume = () => {
          analyserRef.current.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          return sum / bufferLength; // Average volume
        };

        const draw = () => {
          animationId = requestAnimationFrame(draw);
          const volume = calculateVolume();

          // Change background color based on volume thresholds
          if (volume > highThreshold && !cooldown && !isShhVisible) {
            setBackgroundColor('#eab0b7');
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play(); // Play sound at highest threshold
            }
            setIsShhVisible(true); // Show SHHH overlay
            setCooldown(true); // Prevent retriggering

            setTimeout(() => {
              setCooldown(false); // Reset cooldown after 5 seconds
              setIsShhVisible(false); 
            }, 3000); // Cooldown period
          } else if (volume > mediumThreshold) {
            setBackgroundColor('#eab0b7');
          } else if (volume > lowThreshold) {
            setBackgroundColor('#7db1ba');
          } else {
            setBackgroundColor('white');
          }

          // Scale volume for more noticeable ball movement
          const scaledVolume = Math.min(volume / 10, 10); // Cap at a certain level

          ctx.clearRect(0, 0, WIDTH, HEIGHT);

          balls.forEach((ball) => {
            // Update velocity based on the scaled volume
            ball.vx += (Math.random() - 0.5) * scaledVolume * 0.05;
            ball.vy += (Math.random() - 0.5) * scaledVolume * 0.05;

            ball.x += ball.vx;
            ball.y += ball.vy;

            // Bounce off walls
            if (ball.x < 0 || ball.x > WIDTH) ball.vx *= -1;
            if (ball.y < 0 || ball.y > HEIGHT) ball.vy *= -1;

            // Draw the ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgb(152, 210, 220)';
            ctx.fill();
          });
        };

        draw();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    init();

    return () => {
      cancelAnimationFrame(animationId);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isShhVisible, cooldown]);

  return (
    <div className="p-0" style={{ backgroundColor, transition: 'background-color 0.5s ease' }}>
      <canvas ref={canvasRef} width="100%" height="100%"></canvas>
      <audio ref={audioRef} src="/audio/shh.mp3" /> 
      {isShhVisible && <ShhOverlay onClose={() => setIsShhVisible(false)} />}
    </div>
  );
}
