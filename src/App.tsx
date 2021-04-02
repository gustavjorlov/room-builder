import React, { useEffect, useRef } from "react";
import "./App.css";
import { threeRenderer } from "./three/setup";

const App = () => {
  const canvasEl = useRef<HTMLDivElement>(null);
  const height = window.innerHeight - 100;
  const width = window.innerWidth - 50;
  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      const renderer = threeRenderer(width, height);
      canvasEl.current.appendChild(renderer.domElement);
    }
  }, []);
  return (
    <div
      className="App"
      style={{
        background: "#ddd",
        height: "100vh",
        marginTop: "-16px",
        paddingTop: "16px",
      }}
    >
      <p style={{ color: "#000" }}>Graphics!</p>
      <div
        ref={canvasEl}
        style={{
          width: width,
          height: height,
          boxShadow: "2px 3px 10px #333333",
          borderRadius: "4px",
          overflow: "hidden",
          margin: "0px auto",
        }}
      ></div>
    </div>
  );
};

export default App;
