// app/page.js
import IframeEmbed from '@/app/components/classroom/IframeEmbed';
import Timer from '@/app/components/classroom/Timer';
import Dice from '@/app/components/classroom/Dice';
import JournalPrompt from '@/app/components/classroom/JournalPrompt';
import MathProblemGenerator from '@/app/components/classroom/MathProblemGenerator';
import VoiceLevelDetector from '@/app/components/classroom/VoiceLevelDetector';

export default function Dashboard() {

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-auto iframe-embed-container p-4 pt-0 min-vh-100position-relative">
          <div className="iframe-embed h-100">
            <IframeEmbed />
          </div>
        </div>
        <div className="col-auto toolbar p-0 shadow-sm min-vh-100 position-relative">
          <div className="p-3 logo-container">
            <div className="d-flex align-items-center">
              <img src="/images/smartclass.png" alt="Math Icon" className="px-4" width="100%" />
              {/* <h1 className="fw-500 ms-2 mb-0 pb-0">SmartClass</h1> */}
              </div>
          </div>
          <Timer />
          <Dice />
          <JournalPrompt />
          <MathProblemGenerator />
          <VoiceLevelDetector />  
        </div>
      </div>
    </div>
  );
}
