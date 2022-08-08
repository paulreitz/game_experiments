import Phaser from 'phaser';
import { Level } from '../level/level';
import { Player } from '../player/player';

export class SandboxScene extends Phaser.Scene {
    player: Player;
    level: Level;
    init() {
        this.events.addListener('destroy', this.destroy);
    }

    preload() {
        this.load.image('tiles', 'assets/game/img/tilesheets/1_main_platforms.png');
        this.load.tilemapTiledJSON('tilemap', 'assets/game/maps/sandbox.json');
    }

    create(): void {
        this.level = new Level(this);
        const spawn = this.level.spawnPoint;
        this.player = new Player(this, spawn.x, spawn.y);
    }

    override update(): void {
        this.player.update();
    }

    destroy(): void {
        this.player.destroy();
    }
}
