import "phaser";

export default {
  type: Phaser.AUTO,
  width: 800,
  height: 320,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }
    }
  }
};
