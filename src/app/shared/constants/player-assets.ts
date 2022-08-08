import { AnimationData } from '../interfaces/animation-data';

export const PlayerSpritesheetKeys: { [key: string]: string } = {
    SHEET_1: 'player_sheet_1',
    SHEET_2: 'player_sheet_1',
};

export const PlayerSpritesheetPath: { [key: string]: string } = {
    SHEET_1: 'assets/game/img/player/char_blue_1.png',
    SHEET_2: 'assets/game/img/player/char_blue_2.png',
};

export const PlayerAnimationKeys: { [key: string]: string } = {
    IDLE: 'idle',
    RUN: 'run',
    JUMP: 'jump',
};

export const PlayerAnimations: { [key: string]: AnimationData } = {
    IDLE: { spritesheetKey: 'SHEET_1', startFrame: 0, endFrame: 5 },
    RUN: { spritesheetKey: 'SHEET_1', startFrame: 16, endFrame: 23 },
    JUMP: { spritesheetKey: 'SHEET_1', startFrame: 24, endFrame: 31, loop: 0 },
};
