import * as THREE from "three";
import { Mesh } from "three";

export const setupScene = (
  width: number,
  height: number
): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
} => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, 400 / 300, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(400, 300);
  return { scene, camera, renderer };
};

export const getCubeMesh = (
  size: number
): Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: 0x7e31eb });
  return new THREE.Mesh(geometry, material);
};

export const threeRenderer = (
  width: number,
  height: number
): THREE.WebGLRenderer => {
  const { scene, camera, renderer } = setupScene(width, height);
  const cube = getCubeMesh(1);
  const cube2 = getCubeMesh(0.4);
  cube2.position.x = 1.5;
  scene.add(cube);
  scene.add(cube2);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.offsetX / width) * 2 - 1;
    mouse.y = (e.offsetY / height) * 2 - 1;
  };

  renderer.domElement.addEventListener("mousemove", onMouseMove, false);

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
  return renderer;
};
