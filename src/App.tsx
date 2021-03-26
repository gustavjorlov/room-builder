import React, { useEffect, useRef } from "react";
import "./App.css";
import { threeRenderer } from "./three/setup";

const App = () => {
  const canvasEl = useRef<HTMLDivElement>(null);
  const height = 350;
  const width = 400;
  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      const renderer = threeRenderer(width, height);
      canvasEl.current.appendChild(renderer.domElement);
    }
  }, []);
  return (
    <div className="App">
      <p>Graphics!</p>
      <div
        ref={canvasEl}
        style={{
          width: width,
          height: height,
          border: "1px solid #ddd",
          margin: "0px auto",
        }}
      ></div>
    </div>
  );
};

export default App;
