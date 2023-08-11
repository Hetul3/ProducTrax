import React, { useState, useEffect, useRef } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

export default function TimerComponent() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [remainingTimeSeconds, setRemainingTimeSeconds] = useState(300);
  const [key, setKey] = useState(0);
  const [buttonLabel, setButtonLabel] = useState("Start");
  const [isInputsEnabled, setIsInputsEnabled] = useState(true);
  const countdownRef = useRef(null);

  const renderTime = ({ remainingTime }) => {
    const seconds = remainingTime % 60;
    const minutes = parseInt(remainingTime / 60) % 60;
    const hours = parseInt(remainingTime / 3600);

    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return (
      <div className="inside-timer-container">
        <div className="inside-timer-time">
          {hours}:{formattedMinutes}:{formattedSeconds}
        </div>
      </div>
    );
  };

  const soundPlay = () => {
    const audio = new Audio("/sounds/alarm.mp3");
    audio.play();
  };

  const handleToggleTimer = () => {
    if (isTimerActive) {
      setIsTimerActive(false);
      setIsInputsEnabled(true);
      setButtonLabel("Start");
    } else {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setRemainingTimeSeconds(totalSeconds);
      setIsTimerActive(true);
      setIsInputsEnabled(false);
      setButtonLabel("Pause");
    }
  };

  const handleRestartTimer = () => {
    setIsTimerActive(false);
    setIsInputsEnabled(true);
    setButtonLabel("Start");
    setKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    if (isTimerActive) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      setRemainingTimeSeconds(totalSeconds);
    }
  }, [isTimerActive, hours, minutes, seconds]);

  useEffect(() => {
    if (!isTimerActive) {
      handleRestartTimer();
    }
  }, [hours, minutes, seconds]);

  return (
    <div className="timer-parent-container">
      <div className="circle-timer-container">
        <CountdownCircleTimer
          key={key}
          isPlaying={isTimerActive}
          duration={remainingTimeSeconds}
          colors={["#000000"]}
          size={400}
          trailColor={"transparent"}
          strokeWidth={10}
          onComplete={() => {
            handleRestartTimer();
            soundPlay(); 
          }}
          renderTime={renderTime}
        >
          {renderTime}
        </CountdownCircleTimer>
      </div>
      <div className="timer-interactibles-container">
        <div className="timer-inputs-container">
          <div className="timer-input-container">
            <input
              className="timer-input"
              type="number"
              value={hours}
              min={0}
              max={100}
              onChange={(e) => {
                const inputValue = parseInt(e.target.value);
                setHours(isNaN(inputValue) ? 0 : inputValue);
              }}
              disabled={!isInputsEnabled}
            />
          </div>
          <p className="timer-divider">:</p>
          <div className="timer-input-container">
            <input
              className="timer-input"
              type="number"
              value={minutes}
              min={0}
              max={60}
              onChange={(e) => {
                const inputValue = parseInt(e.target.value);
                setMinutes(isNaN(inputValue) ? 0 : inputValue);
              }}
              disabled={!isInputsEnabled}
            />
          </div>
          <p className="timer-divider">:</p>
          <div className="timer-input-container">
            <input
              className="timer-input"
              type="number"
              value={seconds}
              min={0}
              max={60}
              onChange={(e) => {
                const inputValue = parseInt(e.target.value);
                setSeconds(isNaN(inputValue) ? 0 : inputValue);
              }}
              disabled={!isInputsEnabled}
            />
          </div>
        </div>
        <div className="timer-buttons-container">
          <button className="timer-start-button" onClick={handleToggleTimer}>
            {buttonLabel}
          </button>
          <button className="timer-restart-button" onClick={handleRestartTimer}>
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
