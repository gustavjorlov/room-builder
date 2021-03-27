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
  cube2.position.x = 0.8;
  _scene.add(cube1);
  _scene.add(cube2);
};

type DispatchEvent = {
  type: string;
  id: number | null;
};

const handleInteractions = (
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  selectedMesh: THREE.Object3D | null,
  camera: THREE.Camera,
  width: number,
  height: number,
  dispatch: (e: DispatchEvent) => void
): void => {
  const raycaster = new THREE.Raycaster();
  // const onMouseMove = (e: MouseEvent) => {
  //   mouse.x = (e.offsetX / width) * 2 - 1;
  //   mouse.y = (e.offsetY / height) * 2 - 1;
  // };
  const onSelect = (e: MouseEvent) => {
    const mousePositionInScene = (
      width: number,
      height: number,
      e: MouseEvent
    ) =>
      new THREE.Vector2(
        (e.offsetX / width) * 2 - 1,
        (e.offsetY / height) * 2 - 1
      );
    raycaster.setFromCamera(mousePositionInScene(width, height, e), camera);
    const intersected = raycaster.intersectObjects(scene.children);
    console.log("onSelect", intersected);
    if (intersected.length > 0) {
      selectedMesh = raycaster.intersectObjects(scene.children)[0].object;
      dispatch({ type: "click", id: selectedMesh.id });
    } else {
      dispatch({ type: "click", id: null });
      selectedMesh = null;
    }
  };
  // renderer.domElement.addEventListener("mousemove", onMouseMove, false);
  renderer.domElement.addEventListener("mousedown", onSelect, false);
};

export const threeRenderer = (
  width: number,
  height: number
): THREE.WebGLRenderer => {
  const { scene, camera, renderer } = setupScene(width, height);
  let selectedMesh: THREE.Object3D | null = null;

  buildWorld(scene);

  const dispatch = (event: DispatchEvent) => {
    console.log("dispath", event);
    // console.log(scene.getObjectById(event.id));
    if (event.id) selectedMesh = scene.getObjectById(event.id) || null;
    else selectedMesh = null;
  };

  handleInteractions(
    renderer,
    scene,
    selectedMesh,
    camera,
    width,
    height,
    dispatch
  );

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
    if (selectedMesh) {
      selectedMesh.rotation.x += 0.02;
      selectedMesh.rotation.y += 0.02;
      selectedMesh.rotation.z += 0.02;
    }
    // selectedMesh?.rotation.x += 0.01;
    // selectedMesh?.rotation.y += 0.01;
    // raycaster.setFromCamera(mouse, camera);
    // const intersects: THREE.Intersection[] = raycaster.intersectObjects(
    //   scene.children
    // );
    // if (intersects.length > 0) {
    //   const obj = intersects[0].object as THREE.Mesh;
    //   const mat = obj.material as THREE.MeshStandardMaterial;
    //   mat.color.set(0xff0000);
    // }
  };

  animate();
  return renderer;
};
