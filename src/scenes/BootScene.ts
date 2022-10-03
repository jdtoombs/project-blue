import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'Boot' });
  }
  preload() {
    this.load.aseprite({ key: 'blu', textureURL: '/assets/blu.png', atlasURL: '/assets/blu.json' });
    this.load.image('rod-1', '/assets/rod-1.png');

    // level
    this.load.image('base_tiles', '/assets/base_tiles.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/base_tiles.json');
  }

  create() {
    this.anims.createFromAseprite('blu');
    this.scene.start('Game');
  }
}
