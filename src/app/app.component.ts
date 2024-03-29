import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { fromEvent, interval, merge, Subscription, switchMap } from 'rxjs';

import { ThemeService } from './theme.service';

export interface AudioModel {
  audioTitle: string;
  audioPath: string;
}

export interface GifModel {
  id: number;
  gifTitle: string;
  gifPath: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title!: string;
  subscription!: Subscription;
  showMenu = true;
  timerAlmostUp!: boolean;
  duration!: number;
  remainingTime = 0;
  remainingPercent = 100;
  audioPlaying: boolean = false;
  darkTheme: FormControl;
  showCredits = false;
  audioSelections: AudioModel[] = [];
  audioSelection!: AudioModel;
  audio: HTMLAudioElement = new Audio();
  gifSelections!: GifModel[];
  gifSelection!: GifModel;
  error!: string;

  constructor(
    private themeService: ThemeService,
    private formBuilder: FormBuilder
  ) {
    // Set up the theme and CSS Variables
    this.darkTheme = this.formBuilder.control(false);
    this.darkTheme.valueChanges.subscribe((val: boolean) => {
      val ? this.themeService.toggleDark() : this.themeService.toggleLight();
    });
  }

  ngOnInit(): void {
    this.title = 'TouchTimer.net';
    this.prepareAudio();
    this.prepareGif();
  }

  prepareAudio(): void {
    // Name and audio source for any sounds you want to play for the alert
    this.audioSelections = [
      {
        audioTitle: 'No Audio (Silent)',
        audioPath: '',
      },
      {
        audioTitle: 'Birds Chirping',
        audioPath: 'https://freewavesamples.com/files/Chirping-Birds-2.wav',
      },
      {
        audioTitle: 'Vaporwave Music',
        audioPath: '/assets/audio/23220143_vaporwave_by_bransboynd_preview.mp3',
      },
      {
        audioTitle: 'Drum Beat',
        audioPath: 'https://freewavesamples.com/files/Casio-MT-45-16-Beat.wav',
      },
    ];
    // Use the first option as the default
    this.audioSelection = this.audioSelections[0];
    // Instantiate the audio object
    this.audio = new Audio(this.audioSelection.audioPath);
  }

  prepareGif(): void {
    // Animated gif to display for the alert
    this.gifSelections = [
      {
        id: 0,
        gifTitle: 'Vaporwave 80s',
        gifPath:
          'https://gifdb.com/images/high/vaporwave-80s-city-mxa15mtookmrjlyk.webp',
      },
      {
        id: 1,
        gifTitle: 'Vapor Flight 747',
        gifPath:
          'https://gifdb.com/images/high/vaporwave-aircraft-monitor-glitch-3rqtgaycdwwapz4i.webp',
      },
      {
        id: 2,
        gifTitle: 'Bunny Gong',
        gifPath:
          'https://gifdb.com/images/high/bunny-wake-up-gong-ywvit3j8auv8abgu.webp',
      },
      {
        id: 3,
        gifTitle: 'Vapor Mountain',
        gifPath:
          'https://gifdb.com/images/file/vaporwave-mountain-peak-moon-1yg3i0ccfu1bkli1.gif',
      },
      {
        id: 4,
        gifTitle: 'Vaporwave Dancer',
        gifPath:
          'https://gifdb.com/images/high/vaporwave-model-dancing-zzootpk2etvlmknu.webp',
      },
      {
        id: 5,
        gifTitle: 'Vapor Squares',
        gifPath:
          'https://gifdb.com/images/file/vaporwave-checkered-pyramid-yi9jnegowvbjsshz.gif',
      },
    ];
    // Use the first option as the default
    this.gifSelection = this.gifSelections[0];
  }

  onSelectAudio(value: string): void {
    this.stopAudio();
    const audioSelection = this.audioSelections.find(
      (a: { audioTitle: string }) => a.audioTitle == value
    );
    if (audioSelection) {
      this.audioSelection = audioSelection;
      this.playAudio();
    } else {
      console.log('onSelectAudio() Error: audioSelection not found');
    }
  }

  stopAudio(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audioPlaying = false;
  }

  playAudio(): void {
    if (!this.audioPlaying && this.audioSelection.audioPath != '') {
      this.audio = new Audio(this.audioSelection.audioPath);
      this.audio.play();
      this.audioPlaying = true;
    } else {
      console.log(
        'playAudio() Error: audio already playing or audio path is empty.'
      );
    }
  }

  onSelectGif(gifIdx: number): void {
    this.gifSelection = this.gifSelections[gifIdx];
  }

  startTimer(duration: string) {
    this.stopAudio();
    this.error = '';
    if (!duration || duration == '' || isNaN(Number(duration))) {
      this.error = 'Only use numbers for "minutes"!';
      return;
    }
    this.showMenu = false;
    this.duration = parseInt(duration) * 60;
    const click$ = fromEvent<MouseEvent>(document, 'click');
    const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
    const keyPress$ = fromEvent<KeyboardEvent>(document, 'keyup');
    const allEvents$ = merge(click$, keyPress$, mouseMove$);

    const result = allEvents$.pipe(
      // When any event happens:
      switchMap(() => {
        this.remainingPercent = 100;
        this.remainingTime = this.duration;
        this.timerAlmostUp = false;
        this.stopAudio();
        // tick every 1s
        return interval(1000); // intervalTick
      })
    );

    // Clear out any previous subscription each time you start/restart
    this.subscription && this.subscription.unsubscribe();

    this.subscription = result.subscribe((intervalTick) => {
      if (intervalTick == this.duration - 11) {
        // Timer is almost up at 10 seconds before duration
        this.playAudio();
        this.timerAlmostUp = true;
      }
      if (this.remainingTime > 0) {
        this.remainingTime -= 1;
        this.remainingPercent = Math.round(
          (this.remainingTime / this.duration) * 100
        );
      } else {
        this.remainingPercent = 100;
      }
    });
  }

  stopTimer(): void {
    this.stopAudio();
    this.subscription.unsubscribe();
    this.showMenu = true;
  }

  showCreditsToggle(): void {
    this.showCredits = !this.showCredits;
  }
}
