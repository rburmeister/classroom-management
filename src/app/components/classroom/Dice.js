'use client';

import { useState, useRef } from 'react';
import { gsap } from 'gsap';

export default function Dice() {
  const [number, setNumber] = useState(null);
  const diceRef = useRef(null);
  const containerRef = useRef(null);

  const rotationMap = {
    1: { rotationX: 0, rotationY: 0 },
    2: { rotationX: 0, rotationY: -90 },
    3: { rotationX: 0, rotationY: -180 },
    4: { rotationX: 0, rotationY: 90 },
    5: { rotationX: -90, rotationY: 0 },
    6: { rotationX: 90, rotationY: 0 },
  };

  const rollDice = () => {
    const rand = Math.floor(Math.random() * 6) + 1;
    setNumber(null);
    animateDice(rand);
  };

  const animateDice = (rand) => {
    const { rotationX, rotationY } = rotationMap[rand];

    const tl = gsap.timeline({
      onComplete: () => {
        setNumber(rand);
      },
    });

    tl.to(containerRef.current, {
      height: '240px',
      duration: 0.5,
      ease: 'power1.out',
    });

    tl.fromTo(
      diceRef.current,
      {
        scale: 0,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'back.out(1.7)',
      }
    )
      .to(diceRef.current, {
        duration: 2,
        rotationX: `+=${Math.random() * 720 + 360}`,
        rotationY: `+=${Math.random() * 720 + 360}`,
        ease: 'power1.inOut',
      })
      .to(diceRef.current, {
        duration: 2,
        rotationX: rotationX,
        rotationY: rotationY,
        ease: 'power1.out',
      });
  };

  return (

      <div
        className=" p-0 dice-container"
        ref={containerRef}
      >
        <button
          className="btn btn-primary rounded-pill px-3 py-2 w-100"
          onClick={rollDice}
        >
          Roll Dice
          <img src="/images/dice.png" alt="Dice" className="ms-2" width="24" />
        </button>

        <div ref={diceRef} className="dice">
          <div className="face face-1">
            <div className="pip"></div>
          </div>
          <div className="face face-2">
            <div className="pip"></div>
            <div className="pip"></div>
          </div>
          <div className="face face-3">
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
          </div>
          <div className="face face-4">
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
          </div>
          <div className="face face-5">
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
          </div>
          <div className="face face-6">
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
            <div className="pip"></div>
          </div>
        </div>
        </div>
  );
}
