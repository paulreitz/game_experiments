import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ControllerType } from '../../shared/enums/controller-types';
import { AudioService } from '../../shared/services/audio.service';
import { InputService } from '../../shared/services/input.service';

@Component({
    selector: 'app-credits',
    templateUrl: './credits.component.html',
    styleUrls: ['./credits.component.scss'],
})
export class CreditsComponent implements OnInit, OnDestroy {
    private ngUnsubscribe$ = new Subject<void>();
    backIcon: string;
    usingKeyboard: boolean;
    constructor(private inputService: InputService, private dialog: MatDialog, private audioService: AudioService) {}

    ngOnInit(): void {
        this.backIcon = this.inputService.backEscapeIcon;
        this.usingKeyboard = this.inputService.controllerType === ControllerType.KEYBOARD;
        this.inputService.controllerType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((type: ControllerType) => {
            this.backIcon = this.inputService.backEscapeIcon;
            this.usingKeyboard = type === ControllerType.KEYBOARD;
        });
        this.inputService.backPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.audioService.playSfx('ui-close');
            this.dialog.closeAll();
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }
}
