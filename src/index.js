import Phaser from "phaser";
import Tiles from "./assets/tiles/arcade_platformerV2-transparent.png";
import Spikes from "./assets/tiles/spikes.png";
import TileMap from "./assets/tiles/game.json";
import Dude from "./assets/dude.png";
import Star from "./assets/star.png";

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

// variables
let player;
let cursors;
let stars;
let score = 0;
let scoreText;
let gameOverText;
let restartButton;

// loads assets
function preload() {
  this.load.image("tiles", Tiles);
  this.load.image("spikes", Spikes);
  this.load.image("star", Star);
  this.load.tilemapTiledJSON("map", TileMap);
  this.load.spritesheet("dude", Dude, { frameWidth: 32, frameHeight: 48 });
}

// creates all assets
function create() {
  const map = this.make.tilemap({ key: "map", tileWidth: 16, tileHeight: 16 });
  const tileset = map.addTilesetImage("terrain", "tiles");
  const spikeset = map.addTilesetImage("spikes", "spikes");
  const worldLayer = map.createStaticLayer("world", tileset, 0, 0);
  const treeLayer = map.createStaticLayer("trees", tileset, 0, 0);
  const spikes = map.createStaticLayer("spikes", spikeset, 0, 0);

  player = this.physics.add.sprite(40, 40, "dude");
  player.body.setGravityY(300);

  //sets collision by property
  worldLayer.setCollisionByProperty({ collide: true });
  spikes.setCollisionByProperty({ collide: true });
  this.physics.add.collider(player, worldLayer);
  this.physics.add.collider(player, spikes, hitFire, null, this);
  player.setBounce(0.2);

  // makes stars collectable & not fall off map
  stars = this.physics.add.group({
    key: "star",
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });
  this.physics.add.collider(stars, worldLayer);
  this.physics.add.overlap(player, stars, collectStar, null, this);

  function collectStar(player, star) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText("Score: " + score);
  }

  // Make player lose when touching fire
  function hitFire(player, spikes) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    gameOverText = this.add.text(300, 150, "GAME OVER", {
      fontSize: "32px",
      color: "red",
      strokeThickness: 2,
      backgroundColor: "black",
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
      }
    });
    gameOverText.setScrollFactor(0);

    // restarts game if clicked
    restartButton = this.add.text(320, 200, "RESTART", {
      fontSize: "32px",
      color: "red",
      strokeThickness: 2,
      backgroundColor: "black",
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5
      }
    });
    restartButton.setScrollFactor(0);
    restartButton.setInteractive();
    restartButton.on("pointerdown", () => {
      this.scene.restart();
    });
  }

  scoreText = this.add.text(16, 16, "score: 0", {
    fontSize: "16px",
    fill: "#000"
  });
  scoreText.setScrollFactor(0);

  this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  this.cameras.main.startFollow(player);

  // creates walking animations
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

// updates when players move
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
