import { Scene } from 'phaser';
import { FishItems } from '../interfaces';

export default class BootScene extends Scene {
  constructor() {
    super({ key: 'Boot' });
  }
  preload() {
    // character
    this.load.aseprite({ key: 'blu', textureURL: '/assets/blu.png', atlasURL: '/assets/blu.json' });

    // buttons
    this.load.image('inventory-button', '/assets/inventory-button.png');
    this.load.image('character-button', '/assets/character-button.png');
    this.load.image('caught-button', '/assets/caught-button.png');
    this.load.image('inventory', '/assets/inventory.png');
    
    // items
    this.load.image('rod-1', '/assets/rod-1.png');
    this.load.image('fish-inv', '/assets/fish-inv.png');
    this.load.image(FishItems.CommonFish, '/assets/common-fish-inv.png');
    this.load.image(FishItems.UncommonFish, '/assets/uncommon-fish-inv.png');
    this.load.image(FishItems.RareFish, '/assets/rare-fish-inv.png');
    this.load.image(FishItems.LegendaryFish, '/assets/legendary-fish-inv.png');
    
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
