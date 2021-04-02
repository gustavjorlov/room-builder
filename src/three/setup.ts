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
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  buildWorld(scene);
  camera.position.z = 3;
  return { scene, camera, renderer };
};

const getCubeMesh = (
  size: number
): Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: 0x333344 });
  return new THREE.Mesh(geometry, material);
};

const getFloor = (): Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> => {
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide })
  );
  floor.receiveShadow = true;
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -1;
  return floor;
};

const buildWorld = (_scene: THREE.Scene) => {
  for (let i = 0; i <= 10; i++) {
    const cube = getCubeMesh(0.1 * Math.random() + 0.1);
    cube.castShadow = true;
    cube.position.set(
      Math.random() * 3 - 1,
      -(1 - 0.05),
      Math.random() * 2 - 1
    );
    _scene.add(cube);
  }

  _scene.add(getFloor());

  const light = new THREE.PointLight(0xffffff, 2, 100);
  // light.shadow.mapSize.width = 512;
  // light.shadow.mapSize.height = 512;
  // light.shadow.camera.near = 0.5;
  // light.shadow.camera.far = 500;
  light.castShadow = true;
  light.position.set(0, 1, 0);
  _scene.add(light);
  const lightCube = new THREE.Mesh(
    new THREE.SphereGeometry(0.03),
    new THREE.MeshBasicMaterial({ color: 0xffffdd })
  );
  lightCube.position.set(0, 1, 0);
  _scene.add(lightCube);
};

type DispatchEventType = "click" | "hover";
type DispatchEvent = {
  type: DispatchEventType;
  id: number | null;
};

const handleInteractions = (
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  width: number,
  height: number,
  dispatch: (e: DispatchEvent) => void
): void => {
  const raycaster = new THREE.Raycaster();

  const _mousePositionInScene = (
    width: number,
    height: number,
    e: MouseEvent
  ) =>
    new THREE.Vector2(
      (e.offsetX / width) * 2 - 1,
      -1 * ((e.offsetY / height) * 2 - 1)
    );

  const _getIntersections = (e: MouseEvent) => {
    raycaster.setFromCamera(_mousePositionInScene(width, height, e), camera);
    return raycaster.intersectObjects(scene.children);
  };
  const _dispatchIfIntersected = (
    type: DispatchEventType,
    intersections: THREE.Intersection[]
  ) => {
    dispatch({
      type,
      id: intersections.length > 0 ? intersections[0].object.id : null,
    });
  };

  const onSelect = (e: MouseEvent) => {
    _dispatchIfIntersected("click", _getIntersections(e));
  };
  const onHover = (e: MouseEvent) => {
    _dispatchIfIntersected("hover", _getIntersections(e));
  };
  renderer.domElement.addEventListener("mousedown", onSelect, false);
  renderer.domElement.addEventListener("mousemove", onHover, false);
};

export const index = (width: number, height: number): THREE.WebGLRenderer => {
  let selectedMesh: THREE.Object3D | null = null;
  let hoveredMesh: THREE.Object3D | null = null;

  const { scene, camera, renderer } = setupScene(width, height);

  console.log(scene);

  // TODO: develop this redux like thing
  const dispatch = (event: DispatchEvent) => {
    if (event.type === "click") {
      if (event.id) selectedMesh = scene.getObjectById(event.id) || null;
      else selectedMesh = null;
    }
    if (event.type === "hover") {
      if (event.id) hoveredMesh = scene.getObjectById(event.id) || null;
      else hoveredMesh = null;
    }
  };

  handleInteractions(renderer, scene, camera, width, height, dispatch);

  const animate = (ms: number) => {
    requestAnimationFrame(animate);
    update(ms);
    renderer.render(scene, camera);
  };

  const update = (timeAlive: number) => {};

  animate(0);
  return renderer;
};
