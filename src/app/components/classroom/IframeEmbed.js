// components/GeneralEmbed.js

'use client';

import { useState } from 'react';
import DOMPurify from 'dompurify';

export default function GeneralEmbed() {
  const [showInput, setShowInput] = useState(false);
  const [embedCode, setEmbedCode] = useState('');
  const [sanitizedEmbedCode, setSanitizedEmbedCode] = useState('');

  const handlePlusClick = () => {
    setShowInput(true);
  };

  const handleCloseClick = () => {
    setShowInput(false);
  };

  const handleInputChange = (e) => {
    setEmbedCode(e.target.value);
  };

  const handleAddClick = () => {
    const sanitizedCode = DOMPurify.sanitize(embedCode, {
      ALLOWED_TAGS: ['iframe', 'div'],
      ALLOWED_ATTR: [
        'src',
        'width',
        'height',
        'style',
        'allow',
        'frameborder',
        'allowfullscreen',
        'title',
        'name',
        'scrolling',
      ],
    });
    setSanitizedEmbedCode(sanitizedCode);
    setShowInput(false);
    setEmbedCode('');
  };

  return (
    <div className="position-relative h-100">
      <div className="d-flex align-items-center flex-wrap">
        <h2 className="mb-0 mt-3">Add Content</h2>
        <button
          className="btn btn-primary rounded-pill ms-3 px-3 py-1 mt-3 d-flex align-self-start w-auto"
          onClick={handlePlusClick}
        >   <img src="/images/plus.png" alt="plus" className="" width="24" /></button>
      </div>
      {showInput && (
        <div className="mt-2 position-absolute top-0 mt-5 z-2 p-4 bg-white shadow-sm w-100 rounded-4">
          <textarea
            className="form-control rounded-4"
            rows="4"
            placeholder="Paste your embed HTML code here"
            value={embedCode}
            onChange={handleInputChange}
          />
          <div className="d-flex">
          <button
            className="btn btn-primary rounded-pill mt-3"
            onClick={handleCloseClick}
          >
            Close
          </button>
          <button
            className="btn btn-primary rounded-pill mt-3 ms-3"
            onClick={handleAddClick}
          >
            Save
          </button>
          </div>
        </div>
      )}
      {sanitizedEmbedCode && (
        <div
          className="mt-3 position-relative h-100"
          dangerouslySetInnerHTML={{ __html: sanitizedEmbedCode }}
        />
      )}
    </div>
  );
}
