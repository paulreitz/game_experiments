import { Injectable } from '@angular/core';

interface AudioItem {
    audio: HTMLAudioElement;
    isMusic: boolean;
    isPlaying: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class AudioService {
    private playSound: boolean = true;
    private playMusic: boolean = true;
    private audioMap: { [key: string]: AudioItem };
    private lastSound: HTMLAudioElement;

    constructor() {
        this.audioMap = {};
        this.audioMap['menu-item'] = {
            audio: new Audio('assets/audio/ui/MenuSwitchSelect.wav'),
            isMusic: false,
            isPlaying: false,
        };
        this.audioMap['ui-open'] = {
            audio: new Audio('assets/audio/ui/UI_Open.wav'),
            isMusic: false,
            isPlaying: false,
        };
        this.audioMap['ui-close'] = {
            audio: new Audio('assets/audio/ui/UI_Close.wav'),
            isMusic: false,
            isPlaying: false,
        };
        this.audioMap['title-theme'] = {
            audio: new Audio('assets/audio/music/The_Last_Harp_03.ogg'),
            isMusic: true,
            isPlaying: false,
        };
    }

    playSfx(key: string): void {
        if (this.lastSound) {
            this.lastSound.pause();
            this.lastSound.currentTime = 0;
        }
        if (this.playSound && this.audioMap[key] && !this.audioMap[key].isMusic) {
            this.lastSound = this.audioMap[key].audio;
            this.lastSound.play();
        }
    }

    playerMusic(key: string, loop: boolean = false): void {
        if (this.playMusic && this.audioMap[key] && this.audioMap[key].isMusic) {
            this.audioMap[key].audio.pause();
            this.audioMap[key].audio.currentTime = 0;
            this.audioMap[key].audio.loop = loop;
            this.audioMap[key].audio.play();
        }
    }
}
