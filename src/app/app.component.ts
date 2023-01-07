import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { fromEvent, interval, merge, switchMap } from 'rxjs';

import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  showMenu = true;
  timerAlmostUp!: boolean;
  duration!: number;
  remainingTime = 0;
  audioPlaying: boolean = false;
  darkTheme: FormControl;
  showCredits = false;
  displayError: boolean = false;

  constructor(
    private themeService: ThemeService,
    private formBuilder: FormBuilder
  ) {
    this.darkTheme = this.formBuilder.control(false);
    this.darkTheme.valueChanges.subscribe((val: boolean) => {
      if (val) {
        this.themeService.toggleDark();
      } else {
        this.themeService.toggleLight();
      }
    });
  }

  ngOnInit(): void {}

  startTimer(duration: string) {
    const regex = /^\d+$/;
    if (!regex.test(duration)) {
      this.displayError = true;
      return;
    }
    this.displayError = false;
    this.showMenu = false;
    this.duration = parseInt(duration) * 60;
    const click$ = fromEvent<MouseEvent>(document, 'click');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const keyPress$ = fromEvent<KeyboardEvent>(document, 'keyup');
    const allEvents = merge(click$, keyPress$, mouseMove$);

    const result = allEvents.pipe(
      switchMap(() => {
        this.remainingTime = this.duration;
        this.timerAlmostUp = false;
        // tick every 1s
        return interval(1000);
      })
    );
    result.subscribe((x) => {
      console.log(`X is ${x}`);
      if (x >= this.duration - 57) {
        this.playAudio();
        this.audioPlaying = true;
        this.timerAlmostUp = true;
      } else {
        this.audioPlaying = false;
      }
      if (this.remainingTime >= 0) {
        this.remainingTime -= 1;
      }
      console.log('remaining time is', this.remainingTime);
    });
  }

  playAudio() {
    if (this.audioPlaying) {
      return;
    }
    const audio = new Audio(
      'https://freewavesamples.com/files/Ensoniq-ZR-76-01-Dope-77.wav'
    );
    audio.play();
  }

  timerToggle(): void {
    this.timerAlmostUp = !this.timerAlmostUp;
  }
  showMenuToggle(): void {
    this.showMenu = !this.showMenu;
  }
  showCreditsToggle(): void {
    this.showCredits = !this.showCredits;
  }
}
