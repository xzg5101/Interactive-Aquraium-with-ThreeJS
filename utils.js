import * as THREE from "three";
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function random_color() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

// collision and flocking constants
const hard_col_factor = 1;
const flock_repel_factor = 0.00001;
const flocking_gather_factor = 0.001;
const direction_factor = 0.001;
const epsilon = 0.0000001;
const wall_factor = 0.5;
const wall_border_ratio = 0.7;
const mouse_factor = 0.001;

export function update_object_position(
  tank_dim,
  fish,
  id,
  step,
  radius,
  face,
  length,
  fish_list,
  mouse
) {
  // collision and flocking variables
  const flock_inner_bound = length * 2;
  const flock_outer_bound = length * 5;

  //refect on walls
  //console.log(fish.position);
  if (
    fish.position.x > tank_dim.max_x - radius ||
    fish.position.x < tank_dim.min_x + radius
  ) {
    face.reflect(new THREE.Vector3(1, 0, 0));
  }

  if (
    fish.position.y > tank_dim.max_y - radius ||
    fish.position.y < tank_dim.min_y + radius
  ) {
    face.reflect(new THREE.Vector3(0, 1, 0));
  }

  if (
    fish.position.z > tank_dim.max_z - radius ||
    fish.position.z < tank_dim.min_z + radius
  ) {
    face.reflect(new THREE.Vector3(0, 0, 1));
  }

  // potential from the wall
  const min_dim = Math.min(tank_dim.max_x, tank_dim.max_y, tank_dim.max_z);
  const wall_border = wall_border_ratio * min_dim;

  const x_max_dist = tank_dim.max_x - fish.position.x;
  const x_min_dist = fish.position.x - tank_dim.min_x;
  const y_max_dist = tank_dim.max_y - fish.position.y;
  const y_min_dist = fish.position.y - tank_dim.min_y;
  const z_max_dist = tank_dim.max_z - fish.position.z;
  const z_min_dist = fish.position.z - tank_dim.min_z;

  if (x_max_dist < wall_border) {
    face.add(
      new THREE.Vector3(-1, 0, 0).multiplyScalar(
        (1 / (x_max_dist + epsilon)) * wall_factor
      )
    );
  } else if (x_min_dist < wall_border) {
    face.add(
      new THREE.Vector3(1, 0, 0).multiplyScalar(
        (1 / (x_min_dist + epsilon)) * wall_factor
      )
    );
  }

  if (y_max_dist < wall_border) {
    face.add(
      new THREE.Vector3(0, -1, 0).multiplyScalar(
        (1 / (y_max_dist + epsilon)) * wall_factor
      )
    );
  } else if (y_min_dist < wall_border) {
    face.add(
      new THREE.Vector3(0, 1, 0).multiplyScalar(
        (1 / (y_min_dist + epsilon)) * wall_factor
      )
    );
  }

  if (z_max_dist < wall_border) {
    face.add(
      new THREE.Vector3(0, 0, -1).multiplyScalar(
        (1 / (z_max_dist + epsilon)) * wall_factor
      )
    );
  } else if (z_min_dist < wall_border) {
    face.add(
      new THREE.Vector3(0, 0, 1).multiplyScalar(
        (1 / (z_min_dist + epsilon)) * wall_factor
      )
    );
  }

  for (let i = 0; i < fish_list.length; i++) {
    if (fish_list[i].id != id) {
      //direct collision
      if (fish.position.distanceTo(fish_list[i].fish.position) < radius) {
        const col_direct = fish.position
          .clone()
          .sub(fish_list[i].fish.position);
        face.add(
          col_direct
            .normalize()
            .multiplyScalar(
              hard_col_factor *
                (1 /
                  (fish.position.distanceTo(fish_list[i].fish.position) +
                    epsilon))
            )
        );
      }
      //flocking
      else if (
        fish.position.distanceTo(fish_list[i].fish.position) > flock_outer_bound
      ) {
        //console.log("too far");
        const flock_direct = fish_list[i].fish.position
          .clone()
          .sub(fish.position);
        face.add(flock_direct.multiplyScalar(flocking_gather_factor));
      } else if (
        fish.position.distanceTo(fish_list[i].fish.position) < flock_inner_bound
      ) {
        //console.log("too close");
        const flock_direct = fish.position
          .clone()
          .sub(fish_list[i].fish.position);

        face.add(
          flock_direct.multiplyScalar(
            flock_repel_factor *
              (1 /
                (fish.position.distanceTo(fish_list[i].fish.position) +
                  epsilon))
          )
        );
      } else {
        //console.log("trying to merge angle");
        const flock_direct = fish_list[i].face.clone();
        face.add(flock_direct.multiplyScalar(direction_factor));
      }
    }
  }
  // chase mouse

  const mouse_pos = new THREE.Vector3(
    tank_dim.max_z / 2,
    mouse.y * tank_dim.max_y,
    -mouse.x * tank_dim.max_x
  );
  const mouse_direction = mouse_pos.clone().sub(fish.position);
  face.add(mouse_direction.multiplyScalar(mouse_factor));

  // update position and direction
  face.normalize();
  const next_pos = fish.position.clone().add(face.clone().multiplyScalar(step));
  fish.lookAt(next_pos);
  fish.position.copy(next_pos);
}
