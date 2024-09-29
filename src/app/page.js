'use client';

import { useState } from 'react';
import IframeEmbed from '@/app/components/classroom/IframeEmbed';
import Timer from '@/app/components/classroom/Timer';
import Dice from '@/app/components/classroom/Dice';
import JournalPrompt from '@/app/components/classroom/JournalPrompt';
import MathProblemGenerator from '@/app/components/classroom/MathProblemGenerator';
import VoiceLevelDetector from '@/app/components/classroom/VoiceLevelDetector';
import ResizableDraggableWidget from '@/app/components/classroom/ResizableDraggableWidget';

export default function Dashboard() {
  const [showTimer, setShowTimer] = useState(false);
  const [showDice, setShowDice] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showMath, setShowMath] = useState(false);
  const [showVoiceDetector, setShowVoiceDetector] = useState(false);

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-12 iframe-embed-container p-4 pt-0 position-relative">
          <div className="iframe-embed h-100">
            <IframeEmbed />
          </div>
        </div>

        {/* Toolbar for buttons */}
        <div className="toolbar px-4 shadow-sm bg-white rounded-5 d-flex align-items-center z-2">
          <div className="logo-container me-3">
            <div className="d-flex align-items-center h-100">
              <img src="/images/smartclass.png" alt="Math Icon" className="px-0" width="200" />
            </div>
          </div>

          {/* Buttons to open components */}
          <button className="btn btn-primary rounded-pill" onClick={() => setShowTimer(true)}>
            <img src="/images/timer.png" alt="Timer" className="" height="30" />
          </button>
          <button className="btn btn-primary rounded-pill" onClick={() => setShowDice(true)}>
            <img src="/images/dice.png" alt="Dice" className="" height="26" />
          </button>
          <button className="btn btn-primary rounded-pill" onClick={() => setShowJournal(true)}>
            <img src="/images/pencil.png" alt="Journal" className="" height="26" />
          </button>
          <button className="btn btn-primary rounded-pill" onClick={() => setShowMath(true)}>
            <img src="/images/math.png" alt="Math" className="" height="26" />
          </button>
          <button className="btn btn-primary rounded-pill" onClick={() => setShowVoiceDetector(true)}>
            Voice Level
          </button>
        </div>

        <div className="col-12 h-100 position-absolute min-vh-100 top-0 start-0">
          <div className="position-relative w-100 h-100 min-vh-100">
            
            {/* Draggable components */}
            {showTimer && (
              <ResizableDraggableWidget
                initialPosition={{ x: 100, y: 100 }}
                initialSize={{ width: 300, height: 200 }}
                onClose={() => setShowTimer(false)}
              >
                <Timer />
              </ResizableDraggableWidget>
            )}

            {showDice && (
              <ResizableDraggableWidget
                initialPosition={{ x: 200, y: 200 }}
                initialSize={{ width: 300, height: 200 }}
                onClose={() => setShowDice(false)}
              >
                <Dice />
              </ResizableDraggableWidget>
            )}

            {showJournal && (
              <ResizableDraggableWidget
                initialPosition={{ x: 300, y: 300 }}
                initialSize={{ width: 300, height: 200 }}
                onClose={() => setShowJournal(false)}
              >
                <JournalPrompt />
              </ResizableDraggableWidget>
            )}

            {showMath && (
              <ResizableDraggableWidget
                initialPosition={{ x: 400, y: 400 }}
                initialSize={{ width: 300, height: 200 }}
                onClose={() => setShowMath(false)}
              >
                <MathProblemGenerator />
              </ResizableDraggableWidget>
            )}

            {showVoiceDetector && (
              <ResizableDraggableWidget
                initialPosition={{ x: 500, y: 500 }}
                initialSize={{ width: 300, height: 200 }}
                onClose={() => setShowVoiceDetector(false)}
              >
                <VoiceLevelDetector />
              </ResizableDraggableWidget>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
