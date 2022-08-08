import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControllerType } from '../../shared/enums/controller-types';
import { InputService } from '../../shared/services/input.service';

@Component({
    selector: 'app-hud',
    templateUrl: './hud.component.html',
    styleUrls: ['./hud.component.scss'],
})
export class HudComponent implements OnInit, OnDestroy {
    jumpIcon: string;
    usingKeyboard: boolean;

    private ngUnsubscribe$ = new Subject<void>();

    constructor(private inputService: InputService) {}

    ngOnInit(): void {
        this.jumpIcon = this.inputService.jumpIcon;
        this.usingKeyboard = this.inputService.controllerType === ControllerType.KEYBOARD;
        this.inputService.controllerType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((type: ControllerType) => {
            this.jumpIcon = this.inputService.selectIcon;
            this.usingKeyboard = type === ControllerType.KEYBOARD;
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
