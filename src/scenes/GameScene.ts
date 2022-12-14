import { Scene, Physics, GameObjects } from 'phaser';
import { Rarity } from '../constants';
import PlayerController from '../controllers/PlayerController';
import { ICustomPlayerSprite, IFish, IGridSquare, IStoreItem } from '../interfaces';
import {
  determineFish,
  determineFishDifficulty,
  determineFishItem,
  determineFishPrice,
  determineItemPositionX,
} from '../utils';

// TODO: move these
let dir: number;
let inventory: any;
let INVENTORY_SIZE: number = 6;
let latestFishId: string = '';
let currentItem: IStoreItem;

export default class GameScene extends Scene {
  playerController!: PlayerController;
  player?: ICustomPlayerSprite;
  fishermanNpc?: Physics.Arcade.Sprite;
  rod?: Physics.Arcade.Sprite;
  slider?: Physics.Arcade.Sprite;
  greenSlider?: Physics.Arcade.Sprite;
  fishingBar?: GameObjects.Sprite;

  currentFish?: IFish;

  // store
  itemStore?: GameObjects.Sprite;
  itemsForSale?: IStoreItem[];
  itemContainer?: GameObjects.Sprite;
  buyButton?: GameObjects.Sprite;

  itemText?: GameObjects.Text;
  storeText?: GameObjects.Text;
  coinText?: GameObjects.Text;
  inventoryGrid?: IGridSquare[] = [];
  canSell?: boolean = false;

  count?: number = 50;

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

    const inventoryPressed = () => {
      !inventory.visible ? inventoryButton.setTint(0xcccccc) : inventoryButton.clearTint();
      inventory.setVisible(!inventory.visible);
      this.inventoryGrid!.forEach((square: IGridSquare) => {
        if (!square.isOpen) square.item!.setVisible(!square.item!.visible);
      });
    };

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

    this.fishermanNpc = this.physics.add.sprite(180, 600, 'fisherman');
    this.fishermanNpc.setSize(30, 22).setOffset(10);
    this.fishermanNpc.setBounce(0.2);
    this.fishermanNpc.setCollideWorldBounds(true);
    // this.fishermanNpc.anims.play({ key: 'man-idle', repeat: -1 });

    // keyboard events
    this.input.keyboard.on('keydown-F', this.fishing, this);
    this.input.keyboard.on('keydown-E', this.store, this);
    this.input.keyboard.on('keydown-R', this.release, this);

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

    // coin count
    let coinCount = this.add
      .sprite(this.cameras.main.centerX - 110, this.cameras.main.centerY - 75, 'coin-count')
      .setScrollFactor(0)
      .setScale(0.75);
    this.coinText = this.add
      .text(coinCount.x - 2, coinCount.y - 3.5, `0.000`, {
        font: '"Press Start 2P"',
        fontSize: '12px',
      })
      .setScrollFactor(0)
      .setScale(0.5);

    // Inventory
    inventory = this.add
      .sprite(this.cameras.main.centerX, this.cameras.main.centerY - 10, 'inventory')
      .setScrollFactor(0);
    inventory.visible = false;

    // store setup
    this.itemStore = this.add
      .sprite(this.fishermanNpc.x - 35, this.fishermanNpc.y - 45, 'store')
      .setVisible(false);

    this.itemContainer = this.add
      .sprite(this.itemStore.x + 40, this.itemStore.y, 'item-container')
      .setVisible(false);

    this.buyButton = this.add
      .sprite(this.itemContainer.x + 13, this.itemContainer.y + 18, 'buy-button')
      .setVisible(false)
      .setScale(0.4)
      .setInteractive();

    this.storeText = this.add
      .text(this.itemContainer.x - 18, this.itemContainer.y - 20, ``, {
        font: '"Press Start 2P"',
        fontSize: '14px',
      })
      .setScale(0.25);

    this.itemsForSale = [
      {
        name: 'Lure',
        price: 200,
        description: 'Increase luck by 20%\nAllow possibility of catching\nmythical fish\nLasts 60 mins',
        button: this.add
          .sprite(this.itemStore.x, this.itemStore.y - 14, 'lure-1-button')
          .setVisible(false)
          .setScale(0.3)
          .setInteractive(),
      },
      {
        name: 'Magic Stick',
        price: 10000,
        description: 'Cast your line further\nChance of catching bigger fish\nAllow possibility of catching\nmythical fish',
        button: this.add
          .sprite(this.itemStore.x, this.itemStore.y, 'magic-stick-button')
          .setVisible(false)
          .setScale(0.3)
          .setInteractive(),
      },
      {
        name: 'Running Shoes',
        description: 'Increase speed by 25%',
        price: 1000,
        button: this.add
          .sprite(this.itemStore.x, this.itemStore.y + 14, 'running-shoes-button')
          .setVisible(false)
          .setScale(0.3)
          .setInteractive(),
      },
    ];
    // let itemContainer
    this.itemsForSale.forEach((item, index) => {
      item.button.on('pointerover', () => {
        item.button.setTint(0xcccccc);
      });
      item.button.on('pointerout', () => {
        item.button.clearTint();
      });
      item.button.on('pointerdown', () => {
        this.itemContainer?.setVisible(true);
        this.buyButton?.setVisible(true);
        this.storeText?.setText(`${item.name}\nPrice: ${item.price} coins\n${item.description}`);
        console.log('clicked');
      });
    });

    this.input.keyboard.on('keydown-I', () => inventoryPressed());

    this.itemText = this.add
      .text(inventory.x - 120, inventory.y, ``, { font: '"Press Start 2P"', fontSize: '8px' })
      .setScrollFactor(0);
    this.itemText.x = Math.round(this.itemText.x);

    for (let i = 0; i < INVENTORY_SIZE; i++) {
      this.inventoryGrid?.push({
        x: determineItemPositionX(i, 3, 13, inventory.x),
        y: i < 3 ? inventory.y - 7 : inventory.y + 7,
        isOpen: true,
        item: undefined,
        itemDetails: undefined,
      });
    }

    // make constants for numeric values, calculate rather than hardcode
    const inventoryButton = this.add
      .sprite(
        this.cameras.main.centerX + 120.95,
        this.cameras.main.centerY - 77.25,
        'inventory-button',
      )
      .setScale(0.25)
      .setScrollFactor(0)
      .setInteractive();
    this.add
      .image(
        this.cameras.main.centerX + 120.95,
        this.cameras.main.centerY - 69.25,
        'character-button',
      )
      .setScale(0.25)
      .setScrollFactor(0)
      .setInteractive();
    this.add
      .image(this.cameras.main.centerX + 120.95, this.cameras.main.centerY - 61.25, 'caught-button')
      .setScale(0.25)
      .setScrollFactor(0)
      .setInteractive();

    inventoryButton.on('pointerover', () => {
      inventoryButton.setTint(0xcccccc);
    });
    inventoryButton.on('pointerout', () => {
      inventoryButton.clearTint();
    });
    inventoryButton.on('pointerdown', () => {
      inventoryPressed();
    });

    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.rod, platform);
    this.physics.add.collider(this.fishermanNpc, platform);
    platform.setCollisionBetween(0, 15);

    this.physics.add.overlap(this.player, this.rod, this.collectRod);
  }

  // TODO: Set up animations for running left/right/jump, player can currently jump infinitely
  update() {
    let keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    let keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

    if (
      !!this.player!.inventory!.fish[this.player!.inventory!.fish.length - 1] &&
      this.player!.inventory!.fish[this.player!.inventory!.fish.length - 1].id !== latestFishId
    ) {
      latestFishId = this.player!.inventory!.fish[this.player!.inventory!.fish.length - 1].id;
    }

    if (
      this.inventoryGrid!.findIndex((square) => square.itemDetails?.id === latestFishId) === -1 &&
      this.player!.inventory!.fish.length > 0
    ) {
      // find first open slot in inventory
      latestFishId = this.player!.inventory!.fish[this.player!.inventory!.fish.length - 1].id;
      let openSlot = this.inventoryGrid!.findIndex((square: IGridSquare) => square.isOpen === true);
      if (openSlot !== -1) {
        this.inventoryGrid![openSlot] = {
          ...this.inventoryGrid![openSlot],
          isOpen: false,
          item: this.add
            .sprite(
              this.inventoryGrid![openSlot].x,
              this.inventoryGrid![openSlot].y,
              determineFishItem(
                this.player?.inventory?.fish[this.player.inventory.fish.length - 1]!,
              ),
            )
            .setScrollFactor(0)
            .setVisible(false)
            .setInteractive(),
          itemDetails: this.player?.inventory?.fish[this.player.inventory.fish.length - 1],
        };
      }

      this.inventoryGrid!.forEach((square: IGridSquare, index: number) => {
        if (square.isOpen === false) {
          square.item!.on('pointerover', () => {
            square.item!.setTint(0xcccccc);
            this.itemText!.setText(
              `Rarity: ${square.itemDetails?.rarity} \nWeight: ${square.itemDetails?.weight}`,
            );
          });
          square.item!.on('pointerout', () => {
            square.item!.clearTint();
            this.itemText!.setText('');
          });
          square.item!.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // can add destroy option here later if needed (left button down)
            if (pointer.rightButtonDown() && this.canSell) {
              this.player?.inventory?.fish?.splice(
                this.player.inventory.fish.findIndex((fish) => fish.id === square.itemDetails?.id),
                1,
              );
              this.itemText!.setText('');
              this.player!.inventory!.coins += determineFishPrice(square.itemDetails!);
              this.coinText!.setText(String(this.player?.inventory?.coins));
              this.inventoryGrid![index] = {
                ...square,
                isOpen: true,
                itemDetails: undefined,
              };
              square.item?.destroy();
            }
          });
        }
      });
    }

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

    this.checkSliderBounds();

    if (!!this.currentFish) {
      const totalNeeded = determineFishDifficulty(this.currentFish!.rarity, 300);
      if (this.count! >= totalNeeded) {
        this.actionMessage.setText(`You caught a ${this.currentFish!.rarity} fish!`);
        setTimeout(() => this.actionMessage.setText(''), 2000);
        this.player!.playerObjectState!.reeling = false;
        this.count = 50;

        // reset bar and slider
        this.fishingBarReset();

        this.player!.playerObjectState!.fishCaught = true;
      }

      if (this.count && Math.floor(this.count) <= 0) {
        this.actionMessage.setText(`You lost a ${this.currentFish!.rarity} fish!`);
        setTimeout(() => this.actionMessage.setText(''), 2000);
        this.player!.playerObjectState!.reeling = false;
        this.count = 50;
        // reset bar and slider
        this.fishingBarReset();
      }
    }

    this.sellToFisherman();

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

      this.time.delayedCall(rng * 1000, this.reel);
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
    }
  };

  release = () => {
    if (this.player!.playerObjectState!.fishCaught) {
      this.actionMessage.setText('');
      this.player!.playerObjectState!.fishCaught = false;
    }
  };

  reel = () => {
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
  };

  checkSliderBounds = () => {
    if (this.player?.playerObjectState?.reeling) {
      if (this.slider!.x <= this.greenSlider!.x - 7 || this.slider!.x >= this.greenSlider!.x + 7) {
        this.count = this.count! - 1;
      }
    }
  };

  sellToFisherman = () => {
    if (this.player!.x > this.fishermanNpc!.x && this.player!.x < this.fishermanNpc!.x + 30) {
      this.fishermanNpc!.anims.play('sell', true);
      this.itemStore?.setVisible(true);
      this.itemsForSale?.forEach((item) => {
        item.button.setVisible(true);
      });
      this.canSell = true;
    } else {
      this.fishermanNpc!.anims.play('man-idle', true);
      this.itemStore?.setVisible(false);
      this.itemContainer?.setVisible(false);
      this.itemsForSale?.forEach((item) => {
        item.button.setVisible(false);
      });
      this.storeText?.setText('');
      this.buyButton?.setVisible(false);
      this.canSell = false;
    }
  };
}
