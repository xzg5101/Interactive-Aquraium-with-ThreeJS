import * as THREE from "three";
import { random_color } from "./utils";
import { update_gravity_position } from "./utils";
import { Item } from "./item";

export class Food extends Item {
  constructor(tank_dim) {
    super("food", 0);
    this.step = 0.2;
    this.radius = 2;
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("red"),
    });
    const food_geo = new THREE.BoxGeometry(
      this.radius / 2,
      this.radius / 2,
      this.radius / 2
    );
    this.item = new THREE.Mesh(food_geo, material);

    this.item.position.set(
      (Math.random() * 0.5 + 0.25) * tank_dim.max_x * 2 - tank_dim.max_x,
      tank_dim.max_y,
      (Math.random() * 0.5 + 0.25) * tank_dim.max_z * 2 - tank_dim.max_z
    );
  }

  update_animation() {}

  update_position(tank_dim) {
    update_gravity_position(
      tank_dim,
      this.item,
      this.id,
      this.step,
      this.radius,
      this.length
    );
  }

  get_item() {
    return this.item;
  }
}
