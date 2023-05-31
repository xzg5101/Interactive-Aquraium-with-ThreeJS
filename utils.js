import * as THREE from "three";
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function random_color() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}
