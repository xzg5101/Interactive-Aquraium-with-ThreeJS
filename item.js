export class Item {
  constructor(type, level = 1) {
    this.type = type;
    const d1 = new Date();
    this.id = d1.getTime();
    this.level = level;
  }
}
