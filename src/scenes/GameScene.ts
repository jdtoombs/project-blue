import { Scene, Physics, GameObjects } from 'phaser';
import { Rarity } from '../constants';
import PlayerController from '../controllers/PlayerController';
import { ICustomPlayerSprite, IFish } from '../interfaces';
import { determineFish, determineFishDifficulty } from '../utils';

let dir: number;

export default class GameScene extends Scene {
  playerController!: PlayerController;
  player?: ICustomPlayerSprite;
  rod?: Physics.Arcade.Sprite;
  slider?: Physics.Arcade.Sprite;
  greenSlider?: Physics.Arcade.Sprite;
  fishingBar?: GameObjects.Sprite;

  currentFish?: IFish;

  count?: number = 0;

  fishOnLine?: boolean;
  actionMessage!: GameObjects.Text;
  notificationText!: GameObjects.Text;

  stars?: GameObjects.Sprite;
  mountains?: GameObjects.TileSprite;

  constructor() {
    super({ key: 'Game' });
  }

  //TODO: Organize this with best practices later
  create() {
    const numberOfYellowStars = Phaser.Math.Between(0, 5);
    const numberOfWhiteStars = Phaser.Math.Between(10, 50);

    // map decelerations and setup
    const map = this.add.tilemap('tilemap');
    const tileset = map.addTilesetImage('standard_tiles', 'base_tiles');
    const platform = map.createLayer('Ground', tileset);
    map.createLayer('Background', tileset);

    // generate random night sky
    for (let i = 0; i < numberOfWhiteStars; i++) {
      this.physics.add
        .sprite(Phaser.Math.Between(0, 450), Phaser.Math.Between(480, 530), 'white-star')
        .setVelocityX(0.25)
        .body.setAllowGravity(false);
    }

    for (let i = 0; i < numberOfYellowStars; i++) {
      let yellowStar = this.physics.add
        .sprite(Phaser.Math.Between(0, 450), Phaser.Math.Between(480, 500), 'yellow-star')
        .setVelocityX(0.35);
      yellowStar.anims.play({ key: 'Glow', repeat: -1 });
      yellowStar.body.setAllowGravity(false);
    }

    // create player
    this.player = this.physics.add.sprite(250, 600, 'blu');
    this.player.setSize(13, 22).setOffset(10);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.playerObjectState = {
      hasRod: false,
      casted: false,
      reeling: false,
      fishCaught: false,
    };
    this.player.inventory = {
      fish: [],
      coins: 0,
    };

    // keyboard events
    this.input.keyboard.on('keydown-F', this.fishing, this);
    this.input.keyboard.on('keydown-E', this.store, this);

    this.actionMessage = this.add.text(220, 500, '', {
      font: '"Press Start 2P"',
      fontSize: '6',
    });

    // default player
    this.playerController = new PlayerController(this.player);
    this.playerController.setState('idle');

    this.rod = this.physics.add.sprite(200, 200, 'rod-1');
    this.rod.setSize(15, 10).setOffset(0, 20);
    this.rod.setCollideWorldBounds(true);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.zoom = 4;

    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.rod, platform);
    platform.setCollisionBetween(0, 15);

    this.physics.add.overlap(this.player, this.rod, this.collectRod);
  }

  // TODO: Set up animations for running left/right/jump, player can currently jump infinitely
  update() {
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (!!this.slider && !!this.fishingBar && this.player!.playerObjectState!.reeling) {
      if (this.input.mousePointer.isDown) {
        this.slider.setVelocityX(15);
      } else {
        this.slider.setVelocityX(-15);
      }

      // decrease count when slider is not over green slider
      if (
        !!this.greenSlider &&
        !(
          Math.floor(this.slider.x) >= Math.floor(this.greenSlider!.x - 5) &&
          Math.floor(this.slider.x) <= Math.floor(this.greenSlider!.x + 5)
        )
      ) {
        this.count = this.count! - 0.35;
      }

      // slider oob
      if (
        Math.floor(this.slider.x) === Math.floor(this.fishingBar!.x - 30) ||
        Math.floor(this.slider.x) === Math.floor(this.fishingBar!.x + 30)
      ) {
        this.actionMessage.setX(this.player!.body.x + 5);
        this.actionMessage.setY(this.player!.body.y - 5);
        this.actionMessage.setText('Fish lost');
        setTimeout(() => this.actionMessage.setText(''), 2000);
        this.player!.playerObjectState!.reeling = false;

        // reset bar and slider
        this.fishingBarReset();
      }
    }

    if (!!this.currentFish) {
      if (this.count! >= determineFishDifficulty(this.currentFish!.rarity, 300)) {
        this.actionMessage.setText(`You caught a ${this.currentFish!.rarity} fish!`);
        setTimeout(() => this.actionMessage.setText(''), 2000);
        this.player!.playerObjectState!.reeling = false;
        this.count = 0;

        // reset bar and slider
        this.fishingBarReset();

        this.player!.playerObjectState!.fishCaught = true;
      }
    }

    /** Control State */
    if (keyA.isDown) {
      this.player!.playerObjectState!.casted = false;
      this.playerController.setState('moveLeft');
    } else if (keyD.isDown) {
      this.player!.playerObjectState!.casted = false;
      this.playerController.setState('moveRight');
    } else if (keyW.isDown) {
      this.playerController.setState('jump');
    } else if (this.player!.playerObjectState!.casted && !this.player!.playerObjectState!.reeling) {
      this.playerController.setState('cast');
    } else if (this.player!.playerObjectState!.reeling) {
      this.player!.playerObjectState!.casted = false;
      this.playerController.setState('reel');
      this.greenSliderMovement();
    } else if (this.player?.playerObjectState?.fishCaught) {
      this.playerController.setState('idleFish');
    } else {
      this.playerController.setState('idle');
    }
  }
  // figure out typings later, expected ArcadePhysicsCallback; however, need Arcade.Physics.Sprite for rod.disableBody???
  collectRod = (player: any, rod: any) => {
    rod.disableBody(true, true);
    this.player!.playerObjectState!.hasRod = true;
  };

  // TODO: Cancel when move
  fishing = () => {
    /** Random amount of time for fish to bite */
    if (this.player!.playerObjectState!.hasRod) {
      this.player!.playerObjectState!.casted = true;
      // must click mouse to hook fish

      const rng = Phaser.Math.Between(2, 10);
      const numberOfMovements = Phaser.Math.Between(1, 3);

      this.time.delayedCall(rng * 1000, this.reel, [numberOfMovements]);
    } else {
      this.actionMessage.setX(this.player?.body.x);
      this.actionMessage.setY(this.player?.body.y);
      this.actionMessage.setText('You need a rod to fish!');
    }
  };

  store = () => {
    if (this.player!.playerObjectState!.fishCaught) {
      this.player!.inventory!.fish.push(this.currentFish!);
      this.actionMessage.setText('');
      this.player!.playerObjectState!.fishCaught = false;
      console.log(this.player!.inventory!.fish);
    }
  };

  reel = (numberOfMovements: number) => {
    /** Indicate when fish on the line. */
    this.currentFish = determineFish(this.currentFish!);
    this.actionMessage.setX(this.player!.body.x + 5);
    this.actionMessage.setY(this.player!.body.y - 5);
    this.actionMessage.setText('Reel!');
    this.player!.playerObjectState!.reeling = true;
    this.fishingBar = this.add.sprite(
      this.player!.body.x + 15,
      this.player!.body.y - 10,
      'fishing-bar',
    );
    if (!this.slider) {
      this.slider = this.physics.add.sprite(this.fishingBar.x, this.fishingBar.y - 1, 'slider');
      (this.slider.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      this.greenSlider = this.physics.add.sprite(
        this.fishingBar.x,
        this.fishingBar.y,
        'green-slider',
      );
      (this.greenSlider.body as Phaser.Physics.Arcade.Body).allowGravity = false;
      this.physics.add.overlap(this.greenSlider, this.slider, this.reelingStatus);
    } else {
      this.slider.setVisible(true);
      this.greenSlider!.setVisible(true);
      this.slider.setVisible(true);
    }
    this.slider.setDepth(2);
    this.greenSlider!.setDepth(1);


  };

  greenSliderMovement = () => {
    const frontEnd = this.fishingBar!.x + 25;
    const backEnd = this.fishingBar!.x - 25;


    // randomize movement based on fish rarity
    const endPoint =
      this.currentFish?.rarity === Rarity.Common
        ? Math.floor(backEnd)
        : Math.floor(Phaser.Math.Between(backEnd, this.fishingBar!.x));

    const startPoint =
      this.currentFish!.rarity === Rarity.Common
        ? Math.floor(frontEnd)
        : Math.floor(Phaser.Math.Between(this.fishingBar!.x, frontEnd));

    const velocity = determineFishDifficulty(this.currentFish!.rarity, 10);

    if (Math.floor(this.greenSlider!.x) === endPoint) {
      dir = 1;
    } else if (Math.floor(this.greenSlider!.x) === startPoint) {
      dir = -1;
    }
    this.greenSlider!.setVelocityX(!!dir ? velocity * dir : velocity);
  };

  reelingStatus = () => {
    if (this.greenSlider?.visible) this.count! += 1;
  };

  fishingBarReset = () => {
        this.fishingBar?.setVisible(false);
        this.slider!.setVelocityX(0);
        this.slider!.setVisible(false);
        this.greenSlider!.setVisible(false);
        this.greenSlider!.setVelocityX(0);
        this.greenSlider!.setX(this.fishingBar!.x);
        this.slider!.x = this.fishingBar!.x;
        this.slider!.y = this.fishingBar!.y - 1;
  }
}
