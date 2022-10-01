import { Scene } from "phaser";

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'Boot' });
  }
  preload() {
    this.load.aseprite({ key: 'blu', textureURL: '/assets/blu.png', atlasURL: '/assets/blu.json' });
  }

  create() {
    this.anims.createFromAseprite('blu');
    this.scene.start('Game');
  }
}
