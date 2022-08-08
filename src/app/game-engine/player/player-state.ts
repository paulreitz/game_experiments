import Phaser from 'phaser';
import { createMachine } from 'xstate';
import { PlayerAnimationKeys } from '../../shared/constants/player-assets';
import { PlayerStateEvent } from './player-state-event';

export class PlayerStateMachine {
    playerStates: any;
    currentState: any;

    constructor() {
        this.setupStateMachine();
        this.currentState = this.playerStates.states.initial;
    }

    get stateName(): string {
        return this.currentState.value;
    }

    updateState(player: Phaser.Physics.Matter.Sprite, event: PlayerStateEvent): void {
        const newState = this.playerStates.transition(this.currentState, event.type);
        newState.actions.forEach((action: any) => {
            action.exec(player, event);
        });
        this.currentState = newState;
    }

    setupStateMachine(): void {
        this.playerStates = createMachine(
            {
                id: 'player-state',
                initial: 'Idle',
                states: {
                    Idle: {
                        entry: ['idle'],
                        on: {
                            run: 'Run',
                            jump: 'Jump',
                        },
                    },
                    Run: {
                        entry: ['running'],
                        on: {
                            idle: 'Idle',
                            jump: 'Jump',
                        },
                    },
                    Jump: {
                        entry: ['jumping'],
                        on: {
                            backToRun: 'Run',
                            backToIdle: 'Idle',
                        },
                    },
                },
            },
            {
                actions: {
                    idle: (player: Phaser.Physics.Matter.Sprite, event: PlayerStateEvent): void => {
                        player.anims.play(PlayerAnimationKeys['IDLE']);
                    },
                    running: (player: Phaser.Physics.Matter.Sprite, event: PlayerStateEvent): void => {
                        player.anims.play(PlayerAnimationKeys['RUN']);
                    },
                    jumping: (player: Phaser.Physics.Matter.Sprite, event: PlayerStateEvent): void => {
                        player.setVelocityY(event.velocity!);
                        player.anims.play(PlayerAnimationKeys['JUMP']);
                    },
                },
            }
        );
    }
}
