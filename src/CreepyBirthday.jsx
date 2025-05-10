import React, { useState, useEffect, useRef } from "react";
import "./CreepyBirthday.css";
const CreepyBirthday = () => {
  const [text, setText] = useState("");
  const [showEyes, setShowEyes] = useState(false);
  const [noise, setNoise] = useState(false);
  const [counter, setCounter] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [flash, setFlash] = useState(false);
  const eyesRef = useRef(null);
  const fogRef = useRef(null);
  const containerRef = useRef(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const fullText = "С ДНЁМ РОЖДЕНИЯ, ЕКАТЕРИНА...";
  const creepyText = "ОН ВСЕГДА СМОТРИТ...";
  const finalText = "ПУСТЬ ИСПОЛНЯТСЯ ТВОИ САМЫЕ ТЁМНЫЕ ЖЕЛАНИЯ...";
  useEffect(() => {
    if (text === fullText && hasInteracted) {
      const audio = new Audio("./audio/whisper.mp3");
      audio.volume = 0.5;
      audio.play().catch((e) => console.warn("Audio play failed:", e));
    }
  }, [text, hasInteracted]);
  useEffect(() => {
    const enableInteraction = () => setHasInteracted(true);
    window.addEventListener("click", enableInteraction, { once: true });
    window.addEventListener("keydown", enableInteraction, { once: true });

    return () => {
      window.removeEventListener("click", enableInteraction);
      window.removeEventListener("keydown", enableInteraction);
    };
  }, []);
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (fogRef.current) {
        const fogX = (e.clientX / window.innerWidth - 0.5) * 20;
        const fogY = (e.clientY / window.innerHeight - 0.5) * 20;
        fogRef.current.style.transform = `translate(${fogX}px, ${fogY}px)`;
      }

      if (eyesRef.current && showEyes) {
        const eyesRect = eyesRef.current.getBoundingClientRect();
        const eyeCenterX = eyesRect.left + eyesRect.width / 2;
        const eyeCenterY = eyesRect.top + eyesRect.height / 2;

        const angleX = (e.clientX - eyeCenterX) * 0.05;
        const angleY = (e.clientY - eyeCenterY) * 0.05;

        eyesRef.current.style.transform = `translate(${angleX}px, ${angleY}px)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showEyes]);

  useEffect(() => {
    if (text.length < fullText.length) {
      const timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, 150);
      return () => clearTimeout(timer);
    } else {
      const counterTimer = setInterval(
        () => setCounter((prev) => prev + 1),
        1000
      );

      const eyesTimer = setTimeout(() => {
        setShowEyes(true);
      }, 1000);

      const noiseTimer = setTimeout(() => {
        setNoise(true);
        setTimeout(() => setNoise(false), 2000);
      }, 5000);

      return () => {
        clearInterval(counterTimer);
        clearTimeout(noiseTimer);
      };
    }
  }, [text]);
  useEffect(() => {
    if (!showEyes) return;

    const flashInterval = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 100);
    }, 15000);

    return () => clearInterval(flashInterval);
  }, [showEyes]);
  return (
    <div
      className={`creepy-container  ${noise ? "noise-effect" : ""}`}
      ref={containerRef}
    >
      <div className={`fullscreen-flash ${flash ? "active" : ""}`}></div>

      <div className="creepy-content">
        <div className="creepy-text">
          <h1 className="typing-text">{text}</h1>

          {text.length === fullText.length && (
            <>
              <h2 className="flicker-text glitch-text">{creepyText}</h2>
              <p className="hidden-text">{finalText}</p>
            </>
          )}
        </div>

        {showEyes && (
          <>
            <div className="eyes-container" ref={eyesRef}>
              <div className="eyes">
                <div className="eye left-eye"></div>
                <div className="eye right-eye"></div>
              </div>
            </div>

            <div className="blood-drips">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ overflow: "visible" }}
              >
                {[5, 15, 30, 60, 75, 95].map((x, i) => (
                  <path
                    key={i}
                    d={`M${x},0 Q${x + (i % 2 ? -2 : 2)},${
                      20 + i * 5
                    } ${x},100`}
                    stroke={`hsl(0, ${80 + i * 5}%, ${30 + i * 5}%)`}
                    strokeWidth={0.2 + i * 0.1}
                    fill="none"
                    strokeLinecap="round"
                    className="blood-path"
                    style={{
                      animationDelay: `${8 + i * 0.5}s`,
                      strokeDasharray: 1000,
                      strokeDashoffset: 1000,
                    }}
                  />
                ))}
              </svg>
            </div>
            <div ref={fogRef} className="fog-effect">
              <div className="fog-layer fog-layer-1"></div>
              <div className="fog-layer fog-layer-2"></div>
            </div>
          </>
        )}
      </div>

      <div className="counter">Ты смотришь на это уже {counter} секунд...</div>
      <div className="static-overlay"></div>
    </div>
  );
};

export default CreepyBirthday;
