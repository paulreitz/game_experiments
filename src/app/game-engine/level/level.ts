import Phaser from 'phaser';
import { LevelData } from '../../shared/interfaces/level-data';
import { SidescrollerConfig } from '../../shared/interfaces/sidescroller-config';
import { GameService } from '../../shared/services/game.service';

export class Level {
    private gameService: GameService;
    private levelData: LevelData;
    private _playerSpawn: { x: number; y: number };

    constructor(scene: Phaser.Scene) {
        this.gameService = (scene.game.config as unknown as SidescrollerConfig).gameService;
        this.levelData = this.gameService.nextMapData;

        const div = document.getElementById('game-canvas');
        div!.style.backgroundColor = this.levelData.backgroundColor;

        const width = scene.scale.width;
        const height = scene.scale.height;
        scene.add
            .tileSprite(0, height * 0.25, width * 4, height, this.levelData.backgroundFar)
            .setScrollFactor(0.25, 0.1);
        scene.add
            .tileSprite(0, height * 0.3, width * 4, height, this.levelData.backgroundNear)
            .setScrollFactor(0.5, 0.15);

        const map = scene.make.tilemap({ key: this.levelData.tileMapKey });
        const tileset = map.addTilesetImage(this.levelData.tileSetName, this.levelData.tileImageKey);
        const platforms = map.createLayer('Platforms', tileset);
        platforms.setCollisionByProperty({ collides: true });
        const objects = map.getObjectLayer('objects');
        objects.objects.forEach((obj: Phaser.Types.Tilemaps.TiledObject) => {
            if (obj.name === 'playerSpawn') {
                const { x, y } = obj;
                this._playerSpawn = { x: x ?? 0, y: y ?? 0 };
            }
        });
        scene.matter.world.convertTilemapLayer(platforms);
    }

    get spawnPoint(): { x: number; y: number } {
        return this._playerSpawn || { x: 0, y: 0 };
    }
}
