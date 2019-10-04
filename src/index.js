import Phaser from "phaser";
import Tiles from "./assets/tiles/arcade_platformerV2-transparent.png";
import TileMap from "./assets/tiles/game.json";
import Dude from "./assets/dude.png";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 320,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);
let player;
let cursors;

function preload() {
  this.load.image("tiles", Tiles);
  this.load.tilemapTiledJSON("map", TileMap);
  this.load.spritesheet("dude", Dude, { frameWidth: 32, frameHeight: 48 });
}

function create() {
  const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
  const tileset = map.addTilesetImage("terrain", "tiles");
  const worldLayer = map.createStaticLayer("world", tileset, 0, 0);
  const treeLayer = map.createStaticLayer("trees", tileset, 0, 0);

  player = this.physics.add.sprite(40, 40, "dude");
  player.body.setGravityY(300);

  //sets collision by property
  worldLayer.setCollisionByProperty({ collide: true });
  this.physics.add.collider(player, worldLayer);
  player.setBounce(0.2);

  this.anims.create({
    key: "left",
    frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: "turn",
    frames: [{ key: "dude", frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: "right",
    frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play("left", true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play("right", true);
  } else {
    player.setVelocityX(0);

    player.anims.play("turn");
  }

  if (cursors.up.isDown && player.body.onFloor()) {
    player.setVelocityY(-300);
  }
}
