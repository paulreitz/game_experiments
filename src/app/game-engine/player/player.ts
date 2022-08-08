import Phaser from 'phaser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlayerAnimationKeys, PlayerSpritesheetKeys } from '../../shared/constants/player-assets';
import { SidescrollerConfig } from '../../shared/interfaces/sidescroller-config';
import { GameService } from '../../shared/services/game.service';
import { InputService } from '../../shared/services/input.service';
import { PlayerStateMachine } from './player-state';

export class Player {
    sprite: Phaser.Physics.Matter.Sprite;
    scene: Phaser.Scene;
    stateMachine: PlayerStateMachine;

    private gameService: GameService;
    private inputService: InputService;

    private ngUnsubscribe$ = new Subject<void>();

    private _speed: number = 8;
    private _jump: number = -10;
    private _currentSpeed: number = 0;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        this.scene = scene;
        this.sprite = this.scene.matter.add.sprite(x, y, PlayerSpritesheetKeys['SHEET_1'], 0);
        this.sprite.setBody({
            type: 'rectangle',
            width: 28,
            height: 56,
        });
        console.log(this.sprite);
        // @ts-ignore
        this.sprite.body.friction = 0.005;
        this.sprite.setFixedRotation();
        this.sprite.play(PlayerAnimationKeys['IDLE']);
        this.stateMachine = new PlayerStateMachine();
        this.gameService = (scene.game.config as unknown as SidescrollerConfig).gameService;
        this.inputService = this.gameService.inputService;
        this.setupInput();
        scene.cameras.main.startFollow(this.sprite);
    }

    setupInput(): void {
        this.inputService.leftPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.sprite.flipX = true;
            this.stateMachine.updateState(this.sprite, { type: 'run' });
            this._currentSpeed = -this._speed;
        });
        this.inputService.leftReleased$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.stateMachine.updateState(this.sprite, { type: 'idle' });
            this._currentSpeed = 0;
        });
        this.inputService.rightPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.sprite.flipX = false;
            this.stateMachine.updateState(this.sprite, { type: 'run' });
            this._currentSpeed = this._speed;
        });
        this.inputService.rightReleased$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.stateMachine.updateState(this.sprite, { type: 'idle' });
            this._currentSpeed = 0;
        });
        this.inputService.jumpPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.stateMachine.updateState(this.sprite, { type: 'jump', velocity: this._jump });
        });

        this.sprite.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => {
            // @ts-ignore
            // console.log(data.collision.tangent);
            if (
                this.stateMachine.currentState &&
                this.stateMachine.currentState.value === 'Jump' &&
                // @ts-ignore
                data.collision.tangent.x < 0
            ) {
                if (this.inputService.left || this.inputService.right) {
                    this.stateMachine.updateState(this.sprite, { type: 'backToRun' });
                } else {
                    this.stateMachine.updateState(this.sprite, { type: 'backToIdle' });
                }
            }
        });
    }

    setPosition(x: number, y: number): void {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    update(): void {
        if (!!this.sprite) {
            this.sprite.setVelocityX(this._currentSpeed);
            if (
                this.sprite.body.velocity.y > 0 &&
                this.stateMachine.currentState &&
                this.stateMachine.currentState.value !== 'Jump'
            ) {
                this.stateMachine.updateState(this.sprite, { type: 'jump', velocity: 0 });
            }
        }
    }

    destroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
