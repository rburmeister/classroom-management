'use client';

import { useState } from 'react';

export default function JournalPrompt() {
  const [inputText, setInputText] = useState('');
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
        body: JSON.stringify({ userInput: inputText || null }),
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
    <div
      className="draggable-container p-0"
      style={{
        height: 'auto',
        width: '100%',
      }}
    >
      <div className="mt-2">
        <div className="d-flex flex-column justify-content-between">
          <div className="d-flex align-items-center w-100">
            <input
              type="text"
              className="form-control rounded-pill w-100"
              placeholder="Journal topic..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={loading}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill w-100 ms-2 mt-3"
            onClick={fetchPrompt}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Journal'}
            <img src="/images/pencil.png" alt="Pencil" className="ms-2" width="24" />
          </button>
        </div>

        {prompt && <div className="h4 position-relative rounded-lg mt-4">"{prompt}"</div>}
      </div>
    </div>
  );
}
