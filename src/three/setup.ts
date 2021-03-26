import * as THREE from "three";
import { Mesh } from "three";

const setupScene = (
  width: number,
  height: number
): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
} => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  return { scene, camera, renderer };
};

const getCubeMesh = (
  size: number
): Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: 0x7e31eb });
  return new THREE.Mesh(geometry, material);
};

const buildWorld = (_scene: THREE.Scene) => {
  const cube1 = getCubeMesh(1);
  const cube2 = getCubeMesh(0.4);
  cube1.rotation.x = 1.57 / 2;
  cube2.rotation.x = 1.57 / 3;
  cube2.rotation.y = 1.57 / 3;
  cube2.position.x = 1.4;
  _scene.add(cube1);
  _scene.add(cube2);
};

export const threeRenderer = (
  width: number,
  height: number
): THREE.WebGLRenderer => {
  const { scene, camera, renderer } = setupScene(width, height);
  let selectedMesh: THREE.Mesh | null = null;

  buildWorld(scene);

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const onMouseMove = (e: MouseEvent) => {
    mouse.x = (e.offsetX / width) * 2 - 1;
    mouse.y = (e.offsetY / height) * 2 - 1;
  };
  const onSelect = () => {};
  renderer.domElement.addEventListener("mousemove", onMouseMove, false);
  renderer.domElement.addEventListener("mousedown", onSelect, false);

  const light = new THREE.HemisphereLight(0xffffbb, 0x080820);
  scene.add(light);

  camera.position.z = 2;

  console.log(scene);

  const animate = () => {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
  };

  const update = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersects: THREE.Intersection[] = raycaster.intersectObjects(
      scene.children
    );

    if (intersects.length > 0) {
      const obj = intersects[0].object as THREE.Mesh;
      const mat = obj.material as THREE.MeshStandardMaterial;
      mat.color.set(0xff0000);
    }
  };

  animate();
  return renderer;
};
