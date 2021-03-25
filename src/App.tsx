import React, { useEffect, useRef } from "react";
import "./App.css";
import * as THREE from "three";
import { threeRenderer } from "./three/setup";

const App = () => {
  const canvasEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      const renderer = threeRenderer(400, 300);
      canvasEl.current.appendChild(renderer.domElement);
    }
  }, []);
  return (
    <div className="App">
      <p>Graphics!</p>
      <div
        ref={canvasEl}
        style={{
          width: 400,
          height: 300,
          border: "1px solid #ddd",
          margin: "0px auto",
        }}
      ></div>
    </div>
  );
};

export default App;
