import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { Fish } from "./fish.js";
import { Tank } from "./tank.js";
import { createLights } from "./createLight.js";
import { Food } from "./food.js";
// functions

function createRenderer() {
  const renderer = new THREE.WebGLRenderer();
  renderer.useLegacyLights = false;
  return renderer;
}

function add_fish(cnt) {
  let fish_list = [];
  for (let i = 0; i < fish_cnt; i++) {
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const fish = new Fish(fish_size, color);
    scene.add(fish.get_item());
    fish_list.push(fish);
  }
  return fish_list;
}

function add_food(tank_dim) {
  const food = new Food(tank_dim);
  scene.add(food.get_item());
  console.log("added food", food.id, food.get_item().position);
  return food;
}

function init_mouse() {
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
}

function animate() {
  requestAnimationFrame(animate);

  for (let i = 0; i < item_list.length; i++) {
    item_list[i].update_animation();
    item_list[i].update_position(tank.get_dimensions(), item_list, mouse);
  }

  // for (let i = 0; i < item_list.length; i++) {
  //   item_list[i].update_position(tank.get_dimensions());
  // }

  renderer.render(scene, camera);
}

function onMouseMove(event) {
  // calculate mouse position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //console.log(mouse.x, mouse.y);
}

function onDocumentKeyDown(event) {
  var keyCode = event.which;
  if (keyCode == 70) {
    console.log("food？");
    let food = add_food(tank.get_dimensions());
    //item_list.push(food);
  }
}

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
f;

const renderer = createRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.addEventListener("keydown", onDocumentKeyDown, false);
// setup tank
const tank = new Tank(150, 150, 250);
//const tank = new Tank(100, 100, 100);
const tank_material = new THREE.LineBasicMaterial({ color: 0xffffff });
const tank_points = tank.get_edges();
const tank_geo = new THREE.BufferGeometry().setFromPoints(tank_points);
const tank_line = new THREE.Line(tank_geo, tank_material);
tank_line.visible = false;
scene.add(tank_line);
const fish_cnt = 10;
const fish_size = 7;
const light = createLights();

scene.add(light);

let item_list = [];
item_list = item_list.concat(add_fish(fish_cnt));

//fish_list[0].set_rotation_z(Math.PI / 2);
//fish_list[0].set_rotation_y(Math.PI / 2);

var mouse, raycaster;

init_mouse();

animate();

window.addEventListener("mousemove", onMouseMove, false);
