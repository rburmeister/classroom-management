'use client';

import { useState } from 'react';

export default function MathProblemGenerator() {
  const [operation, setOperation] = useState('multiplication');
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/math-problem?operation=${operation}`);
      const data = await res.json();
      if (res.ok) {
        setProblem(data.mathProblem);
      } else {
        console.error('Error:', data.error);
        setProblem('Failed to fetch problem.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setProblem('An error occurred.');
    }
    setLoading(false);
  };

  return (
    <div className="p-0">
      <div className=" d-flex flex-column align-items-center w-100">
        <div className="flex-grow-1 d-flex align-items-center w-100">
          <select
            className="form-select rounded-pill"
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            disabled={loading}
          >
            <option value="addition">Addition</option>
            <option value="division">Division</option>
            <option value="multiplication">Multiplication</option>
            <option value="subtraction">Subtraction</option>
          </select>
        </div>
        <button className="btn btn-primary rounded-pill ms-2 mt-3" onClick={fetchProblem} disabled={loading}>
          {loading ? 'Generating...' : 'Create'}
          <img src="/images/math.png" alt="Math Icon" className="ms-2" width="24" />
        </button>
      </div>
      {problem && <div className="h4 position-relative rounded-lg mt-4">"{problem}"</div>}
    </div>
  );
}
