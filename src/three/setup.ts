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
  buildWorld(scene);
  camera.position.z = 3;
  return { scene, camera, renderer };
};

const getCubeMesh = (
  size: number
): Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> => {
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: 0xdddddd });
  return new THREE.Mesh(geometry, material);
};

const buildWorld = (_scene: THREE.Scene) => {
  for (let i = 0; i <= 4; i++) {
    const cube = getCubeMesh(Math.random());
    cube.position.set(Math.random(), Math.random(), Math.random());
    cube.rotation.set(Math.random(), Math.random(), Math.random());
    _scene.add(cube);
  }
  const light = new THREE.PointLight(0xff0000, 1, 100);
  light.position.set(1, 0, 2);
  _scene.add(light);

  const light2 = new THREE.PointLight(0x00ff00, 1, 100);
  light2.position.set(-1, 0, 0);
  _scene.add(light2);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide })
  );
  floor.rotation.x = Math.PI / 2;
  floor.position.y = -1;
  _scene.add(floor);
  _scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820));
  _scene.add(new THREE.DirectionalLight(0xff0000, 1));
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

export const threeRenderer = (
  width: number,
  height: number
): THREE.WebGLRenderer => {
  let selectedMesh: THREE.Object3D | null = null;
  let hoveredMesh: THREE.Object3D | null = null;

  const { scene, camera, renderer } = setupScene(width, height);

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

  const update = (timeAlive: number) => {
    if (hoveredMesh) {
      ((hoveredMesh as THREE.Mesh)
        .material as THREE.MeshStandardMaterial).color.set(0xdddddd);
    } else {
      scene.children
        .filter((c) => c.type === "Mesh")
        .forEach((c) => {
          ((c as THREE.Mesh).material as THREE.MeshStandardMaterial).color.set(
            0x888888
          );
        });
    }
    if (selectedMesh) {
      selectedMesh.position.y += 0.01 * Math.sin(timeAlive / 1000);
      selectedMesh.position.x += 0.01 * Math.sin(1.57 + timeAlive / 1000);
      selectedMesh.rotation.y += 0.02;
    }
  };

  animate(0);
  return renderer;
};
