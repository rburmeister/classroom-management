'use client';

import { useState } from 'react';

export default function JournalPrompt() {
  const [inputText, setInputText] = useState(''); // State for input text
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPrompt = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/journal-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: inputText || null }), // Send inputText, or null if empty
      });
      const data = await res.json();
      if (res.ok) {
        setPrompt(data.prompt);
      } else {
        console.error(data.error);
        setPrompt('Failed to fetch prompt.');
      }
    } catch (error) {
      console.error(error);
      setPrompt('An error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border-bottom">
            <div className="d-flex justify-content-between">
        <div className=" d-flex align-items-center w-100">
      <input
        type="text"
        className="form-control rounded-pill w-100 d-flex flex-grow-1"
        placeholder="Journal topic..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)} // Update inputText state when typing
        disabled={loading}
      />
      </div>
      <button
        className="btn btn-primary rounded-pill w-100 ms-2"
        onClick={fetchPrompt}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Journal'}
        <img src="/images/pencil.png" alt="Pencil" className="ms-2" width="24" />
      </button>
      </div>
      {prompt && <div className="alert alert-info rounded-lg mt-4">{prompt}</div>}
    </div>

  );
}
