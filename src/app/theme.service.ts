import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export const darkTheme = {
  'primary-color': '#455363',
  'background-color': '#1f2935',
  'text-color': '#fff',
  'credits-background': '#161e27',
  'border-color': '#1e3652',
};

export const lightTheme = {
  'primary-color': '#fff',
  'background-color': '#e5e5e5',
  'text-color': '#2d2d2d',
  'credits-background': '#ddd',
  'border-color': '#bbb',
};

@Injectable()
export class ThemeService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  toggleDark() {
    this.setTheme(darkTheme);
  }

  toggleLight() {
    this.setTheme(lightTheme);
  }

  private setTheme(theme: any) {
    console.log('theme', theme);
    Object.keys(theme).forEach((k) =>
      this.document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
