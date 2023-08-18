import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Fish } from "./fish.js";
import { Tank } from "./tank.js";
import { createLights } from "./createLight.js";
import { Food } from "./food.js";
import Vavarium from "./Vavarium.js";
// functions

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.useLegacyLights = false;
  return renderer;
}

function init_mouse(mouse, raycaster) {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  return mouse;
}

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < v.item_list.length; i++) {
    v.item_list[i].update_animation();
    const to_rmv = v.item_list[i].update_position(
      v.tank.get_dimensions(),
      v.item_list,
      v.mouse
    );
    console.log("id to remove out side", to_rmv);
    v.remove_ids(to_rmv);
  }

  renderer.render(scene, camera);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  v.mouse = mouse;
}

function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 70) {
    console.log("food?");
    let food = v.add_food(v.tank.get_dimensions());
    v.item_list.push(food);
  }
}

function preventZoom(e) {
  if (e.ctrlKey) {
    e.preventDefault();
  }
}

document.addEventListener("wheel", preventZoom, { passive: false });

// Prevent zooming with Ctrl + + or Ctrl + -
document.addEventListener("keydown", function (e) {
  if (e.ctrlKey && (e.key === "+" || e.key === "-" || e.key === "=")) {
    e.preventDefault();
  }
});

//set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(200, 0, 0);
camera.lookAt(0, 0, 0);
const renderer = createRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.addEventListener("keydown", onDocumentKeyDown, false);
window.addEventListener("mousemove", onMouseMove, false);
// setup tank
let mouse, raycaster;
mouse = init_mouse(mouse, raycaster);
let v = new Vavarium(scene, camera, renderer, mouse);

animate();
//window.addEventListener("mousemove", onMouseMove, false);
