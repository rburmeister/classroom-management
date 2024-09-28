// app/page.js
import IframeEmbed from '@/app/components/classroom/IframeEmbed';
import Timer from '@/app/components/classroom/Timer';
import Dice from '@/app/components/classroom/Dice';
import JournalPrompt from '@/app/components/classroom/JournalPrompt';
import MathProblemGenerator from '@/app/components/classroom/MathProblemGenerator';
import VoiceLevelDetector from '@/app/components/classroom/VoiceLevelDetector';

export default function Dashboard() {
  const canvaUrl = 'https://www.canva.com/design/DAGPLxEJsuI/s204uKm8SiZ9EflN4E7SnQ/view'; // Replace with actual URL

  return (
    <div className="container-fluid h-100">
      <div className="row h-100">
        <div className="col-auto iframe-embed-container p-4 min-vh-100">
          <div className="iframe-embed h-100">
            <IframeEmbed />
          </div>
        </div>
        <div className="col-auto toolbar p-0">
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
