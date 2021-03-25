import React, { useEffect, useRef } from "react";
import "./App.css";
import * as THREE from "three";
import { setupScene, getCubeMesh } from "./three/setup";

const App = () => {
  const canvasEl = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (canvasEl && canvasEl.current) {
      const { scene, camera, renderer } = setupScene(400, 300);
      canvasEl.current.appendChild(renderer.domElement);
      const cube = getCubeMesh(1);
      const cube2 = getCubeMesh(0.4);
      cube2.position.x = 1.5;
      scene.add(cube);
      scene.add(cube2);

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      const onMouseMove = (e: MouseEvent) => {
        mouse.x = (e.offsetX / 400) * 2 - 1;
        mouse.y = (e.offsetY / 300) * 2 - 1;
      };
      canvasEl.current.addEventListener("mousemove", onMouseMove, false);

      document.addEventListener("keypress", (e) => {
        switch (e.key) {
          case "r":
            camera.position.y += 0.1;
            break;
          case "f":
            camera.position.y -= 0.1;
            break;
          case "w":
            cube.position.z -= 0.1;
            break;
          case "s":
            cube.position.z += 0.1;
            break;
          case "a":
            cube.position.x -= 0.1;
            break;
          case "d":
            cube.position.x += 0.1;
            break;
        }
      });

      const light = new THREE.HemisphereLight(0xffffbb, 0x080820);
      scene.add(light);

      camera.position.z = 2;

      console.log(scene);

      const animate = () => {
        requestAnimationFrame(animate);
        raycaster.setFromCamera(mouse, camera);
        const intersects: THREE.Intersection[] = raycaster.intersectObjects(
          scene.children
        );

        if (intersects.length > 0) {
          const obj = intersects[0].object as THREE.Mesh;
          const mat = obj.material as THREE.MeshStandardMaterial;
          mat.color.set(0xff0000);
        } else {
          cube.material.color.set(0x00ff00);
        }
        renderer.render(scene, camera);
      };
      animate();
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
