import { useEffect, useRef, useState } from 'react';
import { Rnd } from 'react-rnd';

export default function ResizableDraggableWidget({ children, onClose, initialPosition, initialSize }) {
  const [containerHeight, setContainerHeight] = useState(initialSize.height);
  const containerRef = useRef(null);

  // Adjust container height dynamically when content changes
  useEffect(() => {
    if (containerRef.current) {
      const contentHeight = containerRef.current.scrollHeight;
      if (contentHeight > containerHeight) {
        setContainerHeight(contentHeight + 20); // Add padding for a smoother look
      }
    }
  }, [children]);

  return (
    <Rnd
      bounds="parent"
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: initialSize.width,
        height: containerHeight,
      }}
      minWidth={200}
      minHeight={150}
      maxWidth={600}
      enableResizing={{ bottom: true, right: true, bottomRight: true }}
    >
      <div
        className="resizable-draggable-container p-4 border-bottom"
        ref={containerRef}
        style={{
          background: '#f9f9f9',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          width: '100%',
          height: 'auto',
          overflow: 'auto', // Handle overflow
        }}
      >
        <button className="btn btn-close-widget bg-transparent position-absolute p-0 top-0 start-0" onClick={onClose}>
          <img src="/images/close.png" alt="close" className="" height="16" />
        </button>
        {children}
      </div>
    </Rnd>
  );
}
