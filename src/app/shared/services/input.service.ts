import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ControllerType } from '../enums/controller-types';

@Injectable({
    providedIn: 'root',
})
export class InputService implements OnDestroy {
    private _gamePad: Gamepad | undefined;
    private _loop: any;
    private _keyboardUsed: boolean = false;

    controllerType: ControllerType = ControllerType.KEYBOARD;
    private controllerTypeSource = new Subject<ControllerType>();
    controllerType$ = this.controllerTypeSource.asObservable();

    up: boolean = false;
    upPressed: boolean = false;
    upReleased: boolean = false;
    private upPressedSource = new Subject<void>();
    private upReleasedSource = new Subject<void>();
    upPressed$ = this.upPressedSource.asObservable();
    upReleased$ = this.upReleasedSource.asObservable();

    down: boolean = false;
    downPressed: boolean = false;
    downReleased: boolean = false;
    private downPressedSource = new Subject<void>();
    private downReleasedSource = new Subject<void>();
    downPressed$ = this.downPressedSource.asObservable();
    downReleased$ = this.downReleasedSource.asObservable();

    left: boolean = false;
    leftPressed: boolean = false;
    leftReleased: boolean = false;
    private leftPressedSource = new Subject<void>();
    private leftReleasedSource = new Subject<void>();
    leftPressed$ = this.leftPressedSource.asObservable();
    leftReleased$ = this.leftReleasedSource.asObservable();

    right: boolean = false;
    rightPressed: boolean = false;
    rightReleased: boolean = false;
    private rightPressedSource = new Subject<void>();
    private rightReleasedSource = new Subject<void>();
    rightPressed$ = this.rightPressedSource.asObservable();
    rightReleased$ = this.rightReleasedSource.asObservable();

    jump: boolean = false;
    jumpPressed: boolean = false;
    jumpReleased: boolean = false;

    select: boolean = false;
    selectPressed: boolean = false;
    selectReleased: boolean = false;

    private jumpPressedSource = new Subject<void>();
    private jumpReleasedSource = new Subject<void>();
    private selectPressedSource = new Subject<void>();
    private selectReleasedSource = new Subject<void>();
    jumpPressed$ = this.jumpPressedSource.asObservable();
    jumpReleased$ = this.jumpReleasedSource.asObservable();
    selectPressed$ = this.selectPressedSource.asObservable();
    selectReleased$ = this.selectReleasedSource.asObservable();

    back: boolean = false;
    backPressed: boolean = false;
    backReleased: boolean = false;

    private backPressedSource = new Subject<void>();
    private backReleasedSource = new Subject<void>();
    backPressed$ = this.backPressedSource.asObservable();
    backReleased$ = this.backReleasedSource.asObservable();

    currentButton: number = -1;
    private currentButtonSource = new Subject<number>();
    currentButton$ = this.currentButtonSource.asObservable();

    constructor() {
        window.addEventListener('gamepadconnected', this.gamepadConnect);
        window.addEventListener('gamepaddisconnected', this.gamepadDisconnect);
        window.addEventListener('keydown', this.keyDown);
        window.addEventListener('keyup', this.keyUp);
    }

    ngOnDestroy(): void {
        clearInterval(this._loop);
        this._loop = null;
        window.removeEventListener('gamepadconnected', this.gamepadConnect);
        window.removeEventListener('gamepaddisconnected', this.gamepadDisconnect);
        window.removeEventListener('keydown', this.keyDown);
        window.removeEventListener('keyup', this.keyUp);
    }

    get selectIcon(): string {
        if (this.controllerType === ControllerType.XBOX) return 'button_xbox_digital_a_2.png';
        if (this.controllerType === ControllerType.PLAYSTATION) return 'Button-PS_Cross_2.png';
        if (this.controllerType === ControllerType.GENERIC_GAMEPAD) return 'button-generic_2.png';
        return 'Enter';
    }

    get jumpIcon(): string {
        if (this.controllerType === ControllerType.XBOX) return 'button_xbox_digital_a_2.png';
        if (this.controllerType === ControllerType.PLAYSTATION) return 'Button-PS_Cross_2.png';
        if (this.controllerType === ControllerType.GENERIC_GAMEPAD) return 'button-generic_2.png';
        return 'Space';
    }

    get backIcon(): string {
        if (this.controllerType === ControllerType.XBOX) return 'button_xbox_digital_b_2.png';
        if (this.controllerType === ControllerType.PLAYSTATION) return 'Button-PS_Circle_2.png';
        if (this.controllerType === ControllerType.GENERIC_GAMEPAD) return 'button-generic_4.png';
        return 'Backspace';
    }

    get backEscapeIcon(): string {
        if (this.controllerType === ControllerType.XBOX) return 'button_xbox_digital_b_2.png';
        if (this.controllerType === ControllerType.PLAYSTATION) return 'Button-PS_Circle_2.png';
        if (this.controllerType === ControllerType.GENERIC_GAMEPAD) return 'button-generic_4.png';
        return 'Esc';
    }

    private keyDown = (e: KeyboardEvent): void => {
        // console.log(e);
        this._keyboardUsed = true;
        switch (e.key) {
            case 'w':
            case 'ArrowUp':
                this.setUp(true, ControllerType.KEYBOARD);
                break;

            case 's':
            case 'ArrowDown':
                this.setDown(true, ControllerType.KEYBOARD);
                break;

            case 'a':
            case 'ArrowLeft':
                this.setLeft(true, ControllerType.KEYBOARD);
                break;

            case 'd':
            case 'ArrowRight':
                this.setRight(true, ControllerType.KEYBOARD);
                break;

            case 'Enter':
                this.setSelect(true, ControllerType.KEYBOARD);
                break;

            case ' ':
                this.setJump(true, ControllerType.KEYBOARD);
                break;

            case 'Escape':
                this.setBack(true, ControllerType.KEYBOARD);
                break;
        }
    };

    private keyUp = (e: KeyboardEvent): void => {
        switch (e.key) {
            case 'w':
            case 'ArrowUp':
                this.setUp(false, ControllerType.KEYBOARD);
                break;

            case 's':
            case 'ArrowDown':
                this.setDown(false, ControllerType.KEYBOARD);
                break;

            case 'a':
            case 'ArrowLeft':
                this.setLeft(false, ControllerType.KEYBOARD);
                break;

            case 'd':
            case 'ArrowRight':
                this.setRight(false, ControllerType.KEYBOARD);
                break;

            case 'Enter':
                this.setSelect(false, ControllerType.KEYBOARD);
                break;

            case ' ':
                this.setJump(true, ControllerType.KEYBOARD);
                break;

            case 'Escape':
                this.setBack(false, ControllerType.KEYBOARD);
                break;
        }
    };

    private gamepadConnect = (e: GamepadEvent): void => {
        if (!this._gamePad) {
            this._gamePad = e.gamepad;
            // console.log(this._gamePad);
            clearInterval(this._loop);
            this._loop = null;
            this._loop = setInterval(this.loop, 1000 / 12);
        }
    };

    private gamepadDisconnect = (e: GamepadEvent): void => {
        if (!!this._gamePad && e.gamepad.index === this._gamePad!.index) {
            this._gamePad = undefined;
            if (this.controllerType !== ControllerType.KEYBOARD) {
                this.controllerType = ControllerType.KEYBOARD;
                this.controllerTypeSource.next(ControllerType.KEYBOARD);
            }
            clearInterval(this._loop);
            this._loop = null;
        }
    };

    private loop = (): void => {
        if (!this._gamePad) {
            return;
        }
        const index = this._gamePad.index;
        const gamepad = navigator.getGamepads()[index];
        if (!gamepad) return;
        const type = this.getControllerType(gamepad.id);
        const up = gamepad.axes[1] <= -0.5 || gamepad.buttons[12].pressed;
        if (up) {
            this._keyboardUsed = false;
        }
        if (!this._keyboardUsed) {
            this.setUp(up, type);
        }

        const down = gamepad.axes[1] >= 0.5 || gamepad.buttons[13].pressed;
        if (down) {
            this._keyboardUsed = false;
        }
        if (!this._keyboardUsed) {
            this.setDown(down, type);
        }

        const left = gamepad.axes[0] <= -0.5 || gamepad.buttons[14].pressed;
        if (left) {
            this._keyboardUsed = false;
        }
        if (!this._keyboardUsed) {
            this.setLeft(left, type);
        }

        const right = gamepad.axes[0] >= 0.5 || gamepad.buttons[15].pressed;
        if (right) {
            this._keyboardUsed = false;
        }
        if (!this._keyboardUsed) {
            this.setRight(right, type);
        }

        const button0 = gamepad.buttons[0].pressed;
        if (button0) {
            this._keyboardUsed = false;
        }
        if (!this._keyboardUsed) {
            this.setSelect(button0, type);
            this.setJump(button0, type);
        }

        const button1 = gamepad.buttons[1].pressed;
        if (button1) {
            this._keyboardUsed = false;
        }
        if (!this._keyboardUsed) {
            this.setBack(button1, type);
        }

        let currentPressed = -1;
        for (let i = 0; i < gamepad.buttons.length; i++) {
            if (gamepad.buttons[i].pressed) {
                currentPressed = i;
                break;
            }
        }
        if (currentPressed !== this.currentButton) {
            this.currentButton = currentPressed;
            this.currentButtonSource.next(currentPressed);
        }
    };

    private setUp(isUp: boolean, type: ControllerType): void {
        if (isUp !== this.up) {
            this.setControllerType(type);
            if (isUp) {
                this.upPressed = true;
                this.setDown(false, type);
                this.up = true;
                this.upPressedSource.next();
            } else {
                this.upReleased = true;
                this.up = false;
                this.upReleasedSource.next();
            }
        } else {
            this.upPressed = false;
            this.upReleased = false;
        }
    }

    private setDown(isDown: boolean, type: ControllerType): void {
        if (isDown !== this.down) {
            this.setControllerType(type);
            if (isDown) {
                this.downPressed = true;
                this.setUp(false, type);
                this.down = true;
                this.downPressedSource.next();
            } else {
                this.downReleased = true;
                this.down = false;
                this.downReleasedSource.next();
            }
        } else {
            this.downPressed = false;
            this.downReleased = false;
        }
    }

    private setLeft(isLeft: boolean, type: ControllerType): void {
        if (isLeft !== this.left) {
            this.setControllerType(type);
            if (isLeft) {
                this.leftPressed = true;
                this.setRight(false, type);
                this.left = true;
                this.leftPressedSource.next();
            } else {
                this.leftReleased = true;
                this.left = false;
                this.leftReleasedSource.next();
            }
        } else {
            this.leftPressed = false;
            this.leftReleased = false;
        }
    }

    private setRight(isRight: boolean, type: ControllerType): void {
        if (isRight !== this.right) {
            this.setControllerType(type);
            if (isRight) {
                this.rightPressed = true;
                this.setLeft(false, type);
                this.right = true;
                this.rightPressedSource.next();
            } else {
                this.rightReleased = true;
                this.right = false;
                this.rightReleasedSource.next();
            }
        } else {
            this.rightPressed = false;
            this.rightReleased = false;
        }
    }

    private setJump(isJumping: boolean, type: ControllerType): void {
        if (isJumping !== this.jump) {
            this.setControllerType(type);
            if (isJumping) {
                this.jumpPressed = true;
                this.jump = true;
                this.jumpPressedSource.next();
            } else {
                this.jumpReleased = true;
                this.jump = false;
                this.jumpReleasedSource.next();
            }
        } else {
            this.jumpPressed = false;
            this.jumpReleased = false;
        }
    }

    private setSelect(isSelected: boolean, type: ControllerType): void {
        if (isSelected !== this.select) {
            this.setControllerType(type);
            if (isSelected) {
                this.selectPressed = true;
                this.select = true;
                this.selectPressedSource.next();
            } else {
                this.selectReleased = true;
                this.select = false;
                this.selectReleasedSource.next();
            }
        } else {
            this.selectPressed = false;
            this.selectReleased = false;
        }
    }

    private setBack(isBack: boolean, type: ControllerType): void {
        if (isBack !== this.back) {
            this.setControllerType(type);
            if (isBack) {
                this.backPressed = true;
                this.back = true;
                this.backPressedSource.next();
            } else {
                this.backReleased = true;
                this.back = false;
                this.backReleasedSource.next();
            }
        } else {
            this.backPressed = false;
            this.backReleased = false;
        }
    }

    private setControllerType(type: ControllerType): void {
        if (this.controllerType !== type) {
            this.controllerType = type;
            this.controllerTypeSource.next(type);
        }
    }

    private getControllerType(key: string): ControllerType {
        const keyCheck = key.toLowerCase();
        if (keyCheck.match(/xbox/)) return ControllerType.XBOX;
        if (keyCheck.match(/playstation/)) return ControllerType.PLAYSTATION;
        return ControllerType.PLAYSTATION;
    }
}
