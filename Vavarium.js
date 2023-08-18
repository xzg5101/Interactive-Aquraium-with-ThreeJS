import * as THREE from "three";
import { Fish } from "./fish.js";
import { Tank } from "./tank.js";
import { createLights } from "./createLight.js";
import { Food } from "./food.js";

export default class Vavarium {
  constructor(scene, camera, renderer, mouse) {
    this.item_list = [];
    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.mouse = mouse;
    this.tank = new Tank(150, 150, 250);
    const tank_material = new THREE.LineBasicMaterial({ color: 0xffffff });
    const tank_points = this.tank.get_edges();
    const tank_geo = new THREE.BufferGeometry().setFromPoints(tank_points);
    this.tank_line = new THREE.Line(tank_geo, tank_material);
    //this.tank_line.visible = false;

    this.scene.add(this.tank_line);
    this.fish_cnt = 10;
    this.fish_size = 7;
    this.light = createLights();
    this.scene.add(this.light);
    this.add_fish(this.fish_cnt);
  }

  add_fish(cnt) {
    for (let i = 0; i < this.fish_cnt; i++) {
      const color = new THREE.Color(
        Math.random(),
        Math.random(),
        Math.random()
      );
      const fish = new Fish(this.fish_size, color);
      this.scene.add(fish.get_item());
      this.item_list.push(fish);
    }
  }

  add_food(tank_dim) {
    const food = new Food(tank_dim);
    this.scene.add(food.get_item());
    console.log("added food", food.id, food.get_item().position);
    return food;
  }

  remove_ids(ids) {
    if (ids) {
      console.log("ids to remove", ids);

      this.item_list.forEach((i) => {
        if (ids.includes(i.id)) {
          this.scene.remove(i.item);
        }
      });
      this.item_list = this.item_list.filter((i) => {
        return !ids.includes(i.id);
      });
    }
  }
}
