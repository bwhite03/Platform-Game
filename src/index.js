import "phaser";
import config from "./config/config";
import LevelOne from "./scenes/LevelOne";

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add("Game", LevelOne);
    this.scene.start("Game");
  }
}

window.game = new Game();
