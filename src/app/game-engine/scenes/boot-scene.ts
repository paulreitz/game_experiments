import Phaser from 'phaser';
import { SceneNames } from '../../shared/constants/scenes';

export class BootScene extends Phaser.Scene {
    create(): void {
        this.scene.run(SceneNames.LOAD);
    }
}
