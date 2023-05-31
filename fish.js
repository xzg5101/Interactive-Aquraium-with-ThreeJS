import * as THREE from "three";
import { random_color } from "./utils";
export class Fish {
  constructor(length, color) {
    const d1 = new Date();
    this.id = d1.getTime();
    this.scale = 1;
    this.length = length;
    this.color = color;
    this.angle_step = 0.004;
    this.step = 0.6;
    this.limit = 0.04;
    this.radius = this.length;
    const fin_color = random_color();
    this.fin_color = fin_color;
    this.face = new THREE.Vector3(
      Math.random(),
      Math.random(),
      Math.random()
    ).normalize();
    console.log(this.id);
    // cross section distribution
    const height_list = [
      0.487, 0.75, 1, 1.2, 1.387, 1.55, 1.688, 1.8, 1.887, 1.95, 1.988, 2,
      1.988, 1.95, 1.887, 1.8, 1.688, 1.55, 1.387, 1.2, 1, 0.75, 0.487, 0.487,
      1, 2,
    ];

    const width_list = [
      0.2435, 0.375, 0.5, 0.6, 0.6935, 0.775, 0.844, 0.9, 0.9435, 0.975, 0.994,
      1.0, 0.994, 0.975, 0.9435, 0.9, 0.844, 0.775, 0.6935, 0.6, 0.5, 0.375,
      0.2435, 0.15, 0.1, 0.1,
    ];

    // slices of fish
    const slice_l = this.length / height_list.length;
    const slice_list = height_list.map((x, idx) => {
      const material = new THREE.MeshStandardMaterial({
        color: idx < height_list.length - 2 ? color : fin_color,
      });
      const slice_geo = new THREE.BoxGeometry(
        slice_l * this.scale,
        ((x * length) / 5) * this.scale,
        ((width_list[idx] * length) / 5) * this.scale
      );
      const slice = new THREE.Mesh(slice_geo, material);
      slice.position.set(slice_l * this.scale, 0, 0);
      return slice;
    });
    this.angles = slice_list.map(() => {
      return 0;
    });
    let last_ang = this.limit / 2;
    let sign = 1;
    for (let i = 0; i < slice_list.length - 1; i++) {
      if (
        last_ang + sign * this.angle_step >= this.limit ||
        last_ang + sign * this.angle_step <= -this.limit
      ) {
        sign *= -1;
      }
      last_ang += sign * this.angle_step;
      slice_list[i].rotation.y += last_ang;
      this.angles[i] = last_ang;
      slice_list[i].add(slice_list[i + 1]);
    }
    this.slices = slice_list;

    this.signs = slice_list.map((x, idx) => {
      return 1;
    });
    const fish_geo = new THREE.BoxGeometry(1, 1, 1);

    this.fish = new THREE.Mesh(fish_geo);
    this.fish.material.visible = false;

    const fin_material = new THREE.MeshBasicMaterial({
      color: fin_color,
    });
    const fin_geo = new THREE.BoxGeometry(length / 2, length / 5, 0.1);
    const fin = new THREE.Mesh(fin_geo, fin_material);
    fin.translateY(0.15 * length);
    fin.rotateZ(-Math.PI / 7);
    slice_list[Math.floor(slice_list.length / 2)].add(fin);

    const l_fin_geo = new THREE.BoxGeometry(length / 20, length / 4, 0.1);
    const l_fin = new THREE.Mesh(l_fin_geo, fin_material);
    l_fin.translateY(-0.15 * length);
    l_fin.translateZ(-0.15 * length);
    l_fin.rotateX(Math.PI / 3);
    l_fin.rotateZ(Math.PI / 7);
    slice_list[Math.floor(slice_list.length / 3)].add(l_fin);

    //const r_fin_geo = new THREE.BoxGeometry(1, 5, 0.1);
    const r_fin = new THREE.Mesh(l_fin_geo, fin_material);
    r_fin.translateY(-0.15 * length);
    r_fin.translateZ(0.15 * length);
    r_fin.rotateX(-Math.PI / 3);
    r_fin.rotateZ(Math.PI / 7);
    slice_list[Math.floor(slice_list.length / 3)].add(r_fin);

    const eye_material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("black"),
    });
    const eye_geo = new THREE.SphereGeometry(length / 20);
    const l_eye = new THREE.Mesh(eye_geo, eye_material);
    slice_list[Math.floor(slice_list.length / 6)].add(l_eye);
    l_eye.translateZ(0.04 * length);

    const r_eye = new THREE.Mesh(eye_geo, eye_material);
    slice_list[Math.floor(slice_list.length / 6)].add(r_eye);
    r_eye.translateZ(-0.04 * length);

    slice_list[0].setRotationFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      Math.PI / 2
    );
    slice_list[slice_list.length - 1].color = fin_color;
    this.fish.add(slice_list[0]);
  }

  update_animation() {
    for (let i = 0; i < this.slices.length; i++) {
      this.angles[i] += this.signs[i] * this.angle_step;
      this.slices[i].rotation.y += this.signs[i] * this.angle_step;
      if (this.angles[i] >= this.limit || this.angles[i] <= -this.limit) {
        this.signs[i] *= -1;
        this.angles[i] += this.signs[i] * this.angle_step;
        this.slices[i].rotation.y += this.signs[i] * this.angle_step;
      }
    }
  }

  update_position(tank_dim, fish_list, mouse) {
    //refect on walls
    //console.log(this.fish.position);
    if (
      this.fish.position.x > tank_dim.max_x - this.radius ||
      this.fish.position.x < tank_dim.min_x + this.radius
    ) {
      this.face.reflect(new THREE.Vector3(1, 0, 0));
    }

    if (
      this.fish.position.y > tank_dim.max_y - this.radius ||
      this.fish.position.y < tank_dim.min_y + this.radius
    ) {
      this.face.reflect(new THREE.Vector3(0, 1, 0));
    }

    if (
      this.fish.position.z > tank_dim.max_z - this.radius ||
      this.fish.position.z < tank_dim.min_z + this.radius
    ) {
      this.face.reflect(new THREE.Vector3(0, 0, 1));
    }

    // potential from the wall
    const min_dim = Math.min(tank_dim.max_x, tank_dim.max_y, tank_dim.max_z);
    const wall_factor = 0.5;
    const wall_border_ratio = 0.7;
    const wall_border = wall_border_ratio * min_dim;
    const epsilon = 0.0000001;
    const x_max_dist = tank_dim.max_x - this.fish.position.x;
    const x_min_dist = this.fish.position.x - tank_dim.min_x;
    const y_max_dist = tank_dim.max_y - this.fish.position.y;
    const y_min_dist = this.fish.position.y - tank_dim.min_y;
    const z_max_dist = tank_dim.max_z - this.fish.position.z;
    const z_min_dist = this.fish.position.z - tank_dim.min_z;

    if (x_max_dist < wall_border) {
      this.face.add(
        new THREE.Vector3(-1, 0, 0).multiplyScalar(
          (1 / (x_max_dist + epsilon)) * wall_factor
        )
      );
    } else if (x_min_dist < wall_border) {
      this.face.add(
        new THREE.Vector3(1, 0, 0).multiplyScalar(
          (1 / (x_min_dist + epsilon)) * wall_factor
        )
      );
    }

    if (y_max_dist < wall_border) {
      this.face.add(
        new THREE.Vector3(0, -1, 0).multiplyScalar(
          (1 / (y_max_dist + epsilon)) * wall_factor
        )
      );
    } else if (y_min_dist < wall_border) {
      this.face.add(
        new THREE.Vector3(0, 1, 0).multiplyScalar(
          (1 / (y_min_dist + epsilon)) * wall_factor
        )
      );
    }

    if (z_max_dist < wall_border) {
      this.face.add(
        new THREE.Vector3(0, 0, -1).multiplyScalar(
          (1 / (z_max_dist + epsilon)) * wall_factor
        )
      );
    } else if (z_min_dist < wall_border) {
      this.face.add(
        new THREE.Vector3(0, 0, 1).multiplyScalar(
          (1 / (z_min_dist + epsilon)) * wall_factor
        )
      );
    }

    //peer collision and flocking
    const hard_col_factor = 1;
    const flock_inner_bound = this.length * 2;
    const flock_outer_bound = this.length * 5;
    const flock_repel_factor = 0.00001;
    const flocking_gather_factor = 0.001;
    const direction_factor = 0.001;
    for (let i = 0; i < fish_list.length; i++) {
      if (fish_list[i].id != this.id) {
        //direct collision
        if (
          this.fish.position.distanceTo(fish_list[i].fish.position) <
          this.radius
        ) {
          const col_direct = this.fish.position
            .clone()
            .sub(fish_list[i].fish.position);
          this.face.add(
            col_direct
              .normalize()
              .multiplyScalar(
                hard_col_factor *
                  (1 /
                    (this.fish.position.distanceTo(fish_list[i].fish.position) +
                      epsilon))
              )
          );
        }
        //flocking
        else if (
          this.fish.position.distanceTo(fish_list[i].fish.position) >
          flock_outer_bound
        ) {
          //console.log("too far");
          const flock_direct = fish_list[i].fish.position
            .clone()
            .sub(this.fish.position);
          this.face.add(flock_direct.multiplyScalar(flocking_gather_factor));
        } else if (
          this.fish.position.distanceTo(fish_list[i].fish.position) <
          flock_inner_bound
        ) {
          //console.log("too close");
          const flock_direct = this.fish.position
            .clone()
            .sub(fish_list[i].fish.position);

          this.face.add(
            flock_direct.multiplyScalar(
              flock_repel_factor *
                (1 /
                  (this.fish.position.distanceTo(fish_list[i].fish.position) +
                    epsilon))
            )
          );
        } else {
          //console.log("trying to merge angle");
          const flock_direct = fish_list[i].face.clone();
          this.face.add(flock_direct.multiplyScalar(direction_factor));
        }
      }
    }
    // chase mouse

    const mouse_factor = 0.001;
    const mouse_pos = new THREE.Vector3(
      tank_dim.max_z / 2,
      mouse.y * tank_dim.max_y,
      -mouse.x * tank_dim.max_x
    );
    const mouse_direction = mouse_pos.clone().sub(this.fish.position);
    this.face.add(mouse_direction.multiplyScalar(mouse_factor));

    // update position and direction
    this.face.normalize();
    const next_pos = this.fish.position
      .clone()
      .add(this.face.clone().multiplyScalar(this.step));
    this.fish.lookAt(next_pos);
    this.fish.position.copy(next_pos);
  }

  set_rotation_x(angle) {
    this.fish.rotation.x += angle;
  }

  set_rotation_y(angle) {
    this.fish.rotation.y += angle;
  }

  set_rotation_z(angle) {
    this.fish.rotation.z += angle;
  }

  get_fish() {
    return this.fish;
  }
}
