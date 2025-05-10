import React, { useState, useEffect } from "react";
import "./index.css";

const ParallaxMouse = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="parallax-mouse-container">
      <div
        className="layer1"
        style={{
          transform: `translate(${mousePos.x * 0.05}px, ${
            mousePos.y * 0.05
          }px)`,
        }}
      ></div>
      <div
        className="layer2"
        style={{
          transform: `translate(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px)`,
        }}
      ></div>
      <h1
        className="text"
        style={{
          transform: `translate(${mousePos.x * 0.02}px, ${
            mousePos.y * 0.02
          }px)`,
        }}
      >
        Будь внимательна...
      </h1>
    </div>
  );
};

export default ParallaxMouse;
