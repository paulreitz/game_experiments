import Phaser from 'phaser';
import {
    PlayerAnimationKeys,
    PlayerAnimations,
    PlayerSpritesheetKeys,
    PlayerSpritesheetPath,
} from '../../shared/constants/player-assets';

export const loadPlayerSpritesheets = (scene: Phaser.Scene): void => {
    Object.keys(PlayerSpritesheetKeys).forEach((key: string) => {
        scene.load.spritesheet(PlayerSpritesheetKeys[key], PlayerSpritesheetPath[key], {
            frameWidth: 56,
            frameHeight: 56,
        });
    });
};

export const buildPlayerAnimations = (scene: Phaser.Scene): void => {
    Object.keys(PlayerAnimationKeys).forEach((key: string) => {
        const animationData = PlayerAnimations[key];
        const config: Phaser.Types.Animations.Animation = {
            key: PlayerAnimationKeys[key],
            frames: scene.anims.generateFrameNumbers(PlayerSpritesheetKeys[animationData.spritesheetKey], {
                start: animationData.startFrame,
                end: animationData.endFrame,
                first: 0,
            }),
            frameRate: 12,
            repeat: animationData.loop ?? -1,
        };
        scene.anims.create(config);
    });
};
