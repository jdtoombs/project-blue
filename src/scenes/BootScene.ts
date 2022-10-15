import { Scene } from 'phaser';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'Boot' });
  }
  preload() {
    // character
    this.load.aseprite({ key: 'blu', textureURL: '/assets/blu.png', atlasURL: '/assets/blu.json' });

    // items
    this.load.image('rod-1', '/assets/rod-1.png');
    
    // sky assets
    this.load.image('stars', '/assets/stars.png');
    this.load.image('white-star', '/assets/white-star.png');
    this.load.aseprite({
      key: 'yellow-star',
      textureURL: '/assets/yellow-star.png',
      atlasURL: '/assets/yellow-star.json',
    });
    
    // fishing mechanic assets
    this.load.image('fishing-bar', '/assets/fishing-bar.png');
    this.load.image('slider', '/assets/slider.png');
    this.load.image('green-slider', '/assets/green-slider.png');

    // level
    this.load.image('base_tiles', '/assets/base_tiles.png');
    this.load.tilemapTiledJSON('tilemap', '/assets/base_tiles.json');
  }

  create() {
    this.anims.createFromAseprite('blu');
    this.anims.createFromAseprite('yellow-star');
    this.scene.start('Game');
  }
}
