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
const flocking_gather_factor = 0.00001;
const direction_factor = 0.0001;
const epsilon = 0.0000001;
const wall_factor = 0.5;
const wall_border_ratio = 0.7;
const prey_factor = 0.5;
const mouse_factor = 0;
const turning_factor = 0.05;

const FoodMinYDist = 10;

export function update_gravity_position(
  tank_dim,
  item,
  id,
  step,
  radius,
  length
) {
  if (item.position.y <= tank_dim.min_y + FoodMinYDist) {
    return;
  }

  item.position.y -= step;
}

export function update_object_position(
  tank_dim,
  item,
  id,
  i_type,
  level,
  step,
  radius,
  face,
  length,
  item_list,
  mouse
) {
  // collision and flocking variables
  const flock_inner_bound = length * 3;
  const flock_outer_bound = length * 6;

  // item to remove
  const item_id_to_remove = [];

  //refect on walls
  //console.log(item.position);
  if (
    item.position.x > tank_dim.max_x - radius ||
    item.position.x < tank_dim.min_x + radius
  ) {
    face.reflect(new THREE.Vector3(1, 0, 0));
  }

  if (
    item.position.y > tank_dim.max_y - radius ||
    item.position.y < tank_dim.min_y + radius
  ) {
    face.reflect(new THREE.Vector3(0, 1, 0));
  }

  if (
    item.position.z > tank_dim.max_z - radius ||
    item.position.z < tank_dim.min_z + radius
  ) {
    face.reflect(new THREE.Vector3(0, 0, 1));
  }

  const newFace = new THREE.Vector3(0, 0, 0);
  // potential from the wall
  const min_dim = Math.min(tank_dim.max_x, tank_dim.max_y, tank_dim.max_z);
  const wall_border = wall_border_ratio * min_dim;

  const x_max_dist = tank_dim.max_x - item.position.x;
  const x_min_dist = item.position.x - tank_dim.min_x;
  const y_max_dist = tank_dim.max_y - item.position.y;
  const y_min_dist = item.position.y - tank_dim.min_y;
  const z_max_dist = tank_dim.max_z - item.position.z;
  const z_min_dist = item.position.z - tank_dim.min_z;

  if (x_max_dist < wall_border) {
    newFace.add(
      new THREE.Vector3(-1, 0, 0).multiplyScalar(
        (1 / (x_max_dist + epsilon)) * wall_factor
      )
    );
  } else if (x_min_dist < wall_border) {
    newFace.add(
      new THREE.Vector3(1, 0, 0).multiplyScalar(
        (1 / (x_min_dist + epsilon)) * wall_factor
      )
    );
  }

  if (y_max_dist < wall_border) {
    newFace.add(
      new THREE.Vector3(0, -1, 0).multiplyScalar(
        (1 / (y_max_dist + epsilon)) * wall_factor
      )
    );
  } else if (y_min_dist < wall_border) {
    newFace.add(
      new THREE.Vector3(0, 1, 0).multiplyScalar(
        (1 / (y_min_dist + epsilon)) * wall_factor
      )
    );
  }

  if (z_max_dist < wall_border) {
    newFace.add(
      new THREE.Vector3(0, 0, -1).multiplyScalar(
        (1 / (z_max_dist + epsilon)) * wall_factor
      )
    );
  } else if (z_min_dist < wall_border) {
    newFace.add(
      new THREE.Vector3(0, 0, 1).multiplyScalar(
        (1 / (z_min_dist + epsilon)) * wall_factor
      )
    );
  }

  // inter action with other item in the tank

  let food_flag = false;

  for (let i = 0; i < item_list.length; i++) {
    // lower level items are food
    if (item_list[i].level < level) {
      if (item.position.distanceTo(item_list[i].item.position) < radius) {
        item_id_to_remove.push(item_list[i].id);
      } else {
        food_flag = true;
        const pray_vec = item_list[i].item.position.clone().sub(item.position);
        const pray_direct = pray_vec
          .clone()
          .normalize()
          .multiplyScalar(1000 / pray_vec.lengthSq());
        newFace.add(pray_direct.multiplyScalar(prey_factor));
      }
    }

    // collide with item in same level
    if (item_list[i].id != id && item_list[i].level == level) {
      //direct collision
      if (item.position.distanceTo(item_list[i].item.position) < radius) {
        const col_direct = item.position
          .clone()
          .sub(item_list[i].item.position);
        newFace.add(
          col_direct
            .normalize()
            .multiplyScalar(
              hard_col_factor *
                (1 /
                  (item.position.distanceTo(item_list[i].item.position) +
                    epsilon))
            )
        );
      }
      //flocking with item with same type
      if (item_list[i].type == i_type) {
        if (
          item.position.distanceTo(item_list[i].item.position) >
          flock_outer_bound
        ) {
          //console.log("too far");
          const flock_direct = item_list[i].item.position
            .clone()
            .sub(item.position);
          newFace.add(flock_direct.multiplyScalar(flocking_gather_factor));
        } else if (
          item.position.distanceTo(item_list[i].item.position) <
          flock_inner_bound
        ) {
          //console.log("too close");
          const flock_direct = item.position
            .clone()
            .sub(item_list[i].item.position);

          newFace.add(
            flock_direct.multiplyScalar(
              flock_repel_factor *
                (1 /
                  (item.position.distanceTo(item_list[i].item.position) +
                    epsilon))
            )
          );
        } else {
          //console.log("trying to merge angle");
          const flock_direct = item_list[i].face.clone();
          newFace.add(flock_direct.multiplyScalar(direction_factor));
        }
      }
      // hunt lower level
    }
  }
  // chase mouse

  if (!food_flag) {
    const mouse_pos = new THREE.Vector3(
      tank_dim.max_z / 2,
      mouse.y * tank_dim.max_y,
      -mouse.x * tank_dim.max_x
    );
    const mouse_direction = mouse_pos.clone().sub(item.position);
    newFace.add(mouse_direction.multiplyScalar(mouse_factor));
  }

  // update position and direction
  newFace.normalize();
  face = face.add(newFace.multiplyScalar(turning_factor));
  face.normalize();
  const next_pos = item.position.clone().add(face.clone().multiplyScalar(step));
  item.lookAt(next_pos);
  item.position.copy(next_pos);

  //console.log("\n\n\n utile returning", item_id_to_remove);
  return item_id_to_remove;
}
