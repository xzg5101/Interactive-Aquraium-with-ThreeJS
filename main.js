import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Fish } from "./fish.js";
import { Tank } from "./tank.js";
import { createLights } from "./createLight.js";
//set up scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(200, 0, 0);
//camera.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 4);
camera.lookAt(0, 0, 0);

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();

  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;

  return renderer;
}

const renderer = createRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// setup tank
const tank = new Tank(150, 150, 250);
//const tank = new Tank(100, 100, 100);
const tank_material = new THREE.LineBasicMaterial({ color: 0xffffff });
const tank_points = tank.get_edges();
const tank_geo = new THREE.BufferGeometry().setFromPoints(tank_points);
const tank_line = new THREE.Line(tank_geo, tank_material);
//tank_line.visible = false;
scene.add(tank_line);
const fish_cnt = 10;
const fish_size = 7;
const light = createLights();

scene.add(light);

// functions

function add_fish(cnt) {
  let fish_list = [];
  for (let i = 0; i < fish_cnt; i++) {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const fish = new Fish(fish_size, color);
    scene.add(fish.get_fish());
    fish_list.push(fish);
  }
  return fish_list;
}

function init_mouse() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
}

function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < fish_list.length; i++) {
    fish_list[i].update_animation();
    fish_list[i].update_position(tank.get_dimensions(), fish_list, mouse);
  }
  //console.log("ani", mouse.x, mouse.y);
  renderer.render(scene, camera);
}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  console.log(mouse.x, mouse.y);
}

let fish_list = add_fish(fish_cnt);
//fish_list[0].set_rotation_z(Math.PI / 2);
//fish_list[0].set_rotation_y(Math.PI / 2);

var mouse, raycaster;

init_mouse();

animate();

window.addEventListener("mousemove", onMouseMove, false);
