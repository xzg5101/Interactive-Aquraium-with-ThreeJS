import * as THREE from "three";
export class Tank {
  constructor(l, w, h) {
    this.l = l;
    this.w = w;
    this.h = h;
    this.edges = this.compute_edges();
  }

  compute_edges() {
    return [
      new THREE.Vector3(this.get_max_x(), this.get_max_y(), this.get_max_z()),
      new THREE.Vector3(this.get_max_x(), this.get_max_y(), this.get_min_z()),

      new THREE.Vector3(this.get_max_x(), this.get_min_y(), this.get_min_z()),
      new THREE.Vector3(this.get_max_x(), this.get_min_y(), this.get_max_z()),

      new THREE.Vector3(this.get_max_x(), this.get_max_y(), this.get_max_z()),
      new THREE.Vector3(this.get_min_x(), this.get_max_y(), this.get_max_z()),

      new THREE.Vector3(this.get_min_x(), this.get_max_y(), this.get_min_z()),
      new THREE.Vector3(this.get_max_x(), this.get_max_y(), this.get_min_z()),

      new THREE.Vector3(this.get_min_x(), this.get_max_y(), this.get_min_z()),
      new THREE.Vector3(this.get_min_x(), this.get_min_y(), this.get_min_z()),

      new THREE.Vector3(this.get_max_x(), this.get_min_y(), this.get_min_z()),
      new THREE.Vector3(this.get_min_x(), this.get_min_y(), this.get_min_z()),

      new THREE.Vector3(this.get_min_x(), this.get_min_y(), this.get_max_z()),
      new THREE.Vector3(this.get_max_x(), this.get_min_y(), this.get_max_z()),

      new THREE.Vector3(this.get_min_x(), this.get_min_y(), this.get_max_z()),
      new THREE.Vector3(this.get_min_x(), this.get_max_y(), this.get_max_z()),
    ];
  }

  get_dimensions() {
    return {
      max_x: this.l / 2,
      min_x: -this.l / 2,
      max_y: this.w / 2,
      min_y: -this.w / 2,
      max_z: this.h / 2,
      min_z: -this.h / 2,
    };
  }

  get_edges() {
    return this.edges;
  }

  get_corner_cores() {
    const radius = Math.min(
      this.get_max_x(),
      this.get_max_y(),
      this.get_max_z()
    );

    c_max_x = this.get_max_x() - radius;
    c_min_x = this.get_min_x() + radius;
    c_max_y = this.get_max_y() - radius;
    c_min_y = this.get_min_y() + radius;
    c_max_z = this.get_max_z() - radius;
    c_min_z = this.get_min_z() + radius;

    let core_list = [
      new THREE.Vector3(c_max_x, c_max_y, c_max_z),
      new THREE.Vector3(c_max_x, c_max_y, c_min_z),
      new THREE.Vector3(c_max_x, c_min_y, c_max_z),
      new THREE.Vector3(c_max_x, c_min_y, c_min_z),
      new THREE.Vector3(c_min_x, c_max_y, c_max_z),
      new THREE.Vector3(c_min_x, c_min_y, c_max_z),
      new THREE.Vector3(c_min_x, c_max_y, c_min_z),
      new THREE.Vector3(c_min_x, c_min_y, c_min_z),
    ];
    return core_list;
  }

  get_min_x() {
    return -this.l / 2;
  }
  get_max_x() {
    return this.l / 2;
  }
  get_min_y() {
    return -this.w / 2;
  }
  get_max_y() {
    return this.w / 2;
  }
  get_min_z() {
    return -this.h / 2;
  }
  get_max_z() {
    return this.h / 2;
  }
}
