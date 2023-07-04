import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [displayTime, setDisplayTime] = useState('00:00');
  const [isDraggingSecondHand, setIsDraggingSecondHand] = useState(false);
  const [isDraggingMinuteHand, setIsDraggingMinuteHand] = useState(false);
  const clockRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (!isDraggingSecondHand && !isDraggingMinuteHand) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => (prevSeconds + 1) % 60);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isDraggingSecondHand, isDraggingMinuteHand]);

  useEffect(() => {
    console.log(seconds);
    const updatedMinutes = parseInt(seconds / 59);
    console.log(updatedMinutes);
    setMinutes(updatedMinutes);

    const updatedDisplayTime = `${String(updatedMinutes).padStart(2, '0')}:${String(
      seconds % 60
    ).padStart(2, '0')}`;
    setDisplayTime(updatedDisplayTime);
  }, [seconds]);

  const handleSecondHandMouseDown = () => {
    setIsDraggingSecondHand(true);
  };

  const handleMinuteHandMouseDown = () => {
    setIsDraggingMinuteHand(true);
  };

  const handleMouseMove = (event) => {
    const clock = clockRef.current;
    const clockRect = clock.getBoundingClientRect();
    const clockCenterX = clockRect.left + clockRect.width / 2;
    const clockCenterY = clockRect.top + clockRect.height / 2;
    const angle = Math.atan2(event.clientY - clockCenterY, event.clientX - clockCenterX);
    const degrees = (angle * 180) / Math.PI;
    const normalizedDegrees = degrees >= 0 ? degrees : degrees + 360;

    if (isDraggingSecondHand) {
      const updatedSeconds = Math.round((normalizedDegrees / 360) * 60) % 60;
      setSeconds(updatedSeconds);
    }

    if (isDraggingMinuteHand) {
      const updatedMinutes = Math.round((normalizedDegrees / 360) * 60) % 60;
      setMinutes(updatedMinutes);
      setSeconds(updatedMinutes * 60);
    }
  };

  const handleMouseUp = () => {
    setIsDraggingSecondHand(false);
    setIsDraggingMinuteHand(false);
  };

  const handleDisplayTimeChange = (event) => {
    const inputTime = event.target.value;
    const [inputMinutes, inputSeconds] = inputTime.split(':').map((part) => parseInt(part));

    if (!isNaN(inputMinutes) && !isNaN(inputSeconds)) {
      const clampedMinutes = Math.max(0, Math.min(inputMinutes, 59));
      const clampedSeconds = Math.max(0, Math.min(inputSeconds, 59));

      setMinutes(clampedMinutes);
      setSeconds(clampedMinutes * 60 + clampedSeconds);
    }
  };

  return (
    <div className="clock" ref={clockRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div
        className={`hand second-hand${isDraggingSecondHand ? ' dragging' : ''}`}
        style={{ transform: `rotate(${(seconds / 60) * 360}deg)` }}
        onMouseDown={handleSecondHandMouseDown}
      ></div>
      <div
        className={`hand minute-hand${isDraggingMinuteHand ? ' dragging' : ''}`}
        style={{ transform: `rotate(${(minutes / 60) * 360}deg)` }}
        onMouseDown={handleMinuteHandMouseDown}
      ></div>
      <div className="display">
        <input type="text" value={displayTime} onChange={handleDisplayTimeChange} />
      </div>
    </div>
  );
};

export default App;