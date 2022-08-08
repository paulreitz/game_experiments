import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ControllerType } from '../../shared/enums/controller-types';
import { GameDataService } from '../../shared/services/game-data.service';
import { GameService } from '../../shared/services/game.service';
import { InputService } from '../../shared/services/input.service';
import { CreditsComponent } from '../../modals/credits/credits.component';
import { AudioService } from '../../shared/services/audio.service';

interface MenuItem {
    name: string;
    action?: () => void;
    index: number;
}

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss'],
})
export class TitleComponent implements OnInit, OnDestroy {
    private ngUnsubscribe$ = new Subject<void>();

    menuItems: string[] = ['menu.start', 'menu.settings', 'menu.credits'];
    selectedMenuItem: number = 0;
    usingKeyboard: boolean = true;
    selectIcon: string = '';
    backIcon: string = '';
    dialogOpen: boolean = false;

    upTrigger: boolean = false;
    downTrigger: boolean = false;
    leftTrigger: boolean = false;
    rightTrigger: boolean = false;

    currentButton: string | number = 'None';
    canSerialize: boolean;

    constructor(
        private inputService: InputService,
        private gameDataService: GameDataService,
        private gameService: GameService,
        private audioService: AudioService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        if (this.gameService.onDesktop) {
            this.menuItems.push('menu.quit');
        }
        this.audioService.playerMusic('title-theme', true);
        this.usingKeyboard = this.inputService.controllerType === ControllerType.KEYBOARD;
        this.selectIcon = this.inputService.selectIcon;
        this.backIcon = this.inputService.backIcon;
        this.canSerialize = this.gameDataService.canSerialize;

        this.inputService.upPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            if (this.dialogOpen) return;
            this.upTrigger = true;
            this.selectedMenuItem = this.selectedMenuItem > 0 ? this.selectedMenuItem - 1 : this.menuItems.length - 1;
            this.audioService.playSfx('menu-item');
        });

        this.inputService.downPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            if (this.dialogOpen) return;
            this.downTrigger = true;
            const selected = this.selectedMenuItem + 1;
            this.selectedMenuItem = selected < this.menuItems.length ? selected : 0;
            this.audioService.playSfx('menu-item');
        });

        this.inputService.selectPressed$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            if (this.dialogOpen) return;
            const item = this.menuItems[this.selectedMenuItem];
            switch (item) {
                case 'menu.credits':
                    this.openCredits();
                    break;
            }
        });

        this.inputService.currentButton$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((button: number) => {
            this.currentButton = button === -1 ? 'None' : button;
            // console.log(button);
        });

        this.inputService.controllerType$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((type: ControllerType) => {
            this.usingKeyboard = type === ControllerType.KEYBOARD;
            this.selectIcon = this.inputService.selectIcon;
            this.backIcon = this.inputService.backIcon;
        });

        this.dialog.afterAllClosed.pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
            this.dialogOpen = false;
        });
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe$.next();
        this.ngUnsubscribe$.complete();
    }

    private openCredits(): void {
        this.audioService.playSfx('ui-open');
        this.dialogOpen = true;
        const config = new MatDialogConfig();
        config.height = '80vh';
        config.width = '90vw';
        config.disableClose = true;
        this.dialog.open(CreditsComponent, config);
    }
}
