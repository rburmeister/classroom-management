// components/Dice.js
'use client';

import { useState } from 'react';

export default function Dice() {
  const [number, setNumber] = useState(null);

  const rollDice = () => {
    const rand = Math.floor(Math.random() * 6) + 1;
    setNumber(rand);
  };

  return (
    <div className="border-bottom p-4">
      <button className="btn btn-primary rounded-pill px-3 py-2 w-100" onClick={rollDice}>
        Roll Dice
        <img src="/images/dice.png" alt="Dice" className="ms-2" width="24" />
      </button>
      {number && (
        <div className="alert alert-info rounded-lg mt-4 text-center">
          You rolled a <strong>{number}</strong>!
        </div>
      )}
    </div>
  );
}
