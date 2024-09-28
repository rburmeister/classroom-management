'use client';

import { useEffect, useRef, useState } from 'react';

export default function VoiceLevelDetector() {
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioRef = useRef(null); // For the audio file
  const [backgroundColor, setBackgroundColor] = useState('white');

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
          if (volume > highThreshold) {
            setBackgroundColor('eab0b7');
            if (audioRef.current && audioRef.current.paused) {
              audioRef.current.play(); // Play sound at highest threshold
            }
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
  }, []);

  return (
    <div className="p-0" style={{ backgroundColor, transition: 'background-color 0.5s ease' }}>
      <canvas ref={canvasRef} width="600" height="400"></canvas>
      <audio ref={audioRef} src="/audio/shush.mp3" /> {/* Replace with the path to your audio file */}
    </div>
  );
}
