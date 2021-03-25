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
