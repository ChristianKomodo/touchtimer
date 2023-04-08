import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export const lightTheme = {
  'text-primary': '#a370f2',
  'text-secondary': '#d95fcc',
  'text-tertiary': '#4c0be3',
  'card-bkd': '#eee',
  'background-color': '#e5e5e5',
  'text-color': '#2d2d2d',
  'credits-background': '#ddd',
  'border-color': '#bbb',
  'shadow-color': '#ccc',
};

export const darkTheme = {
  'text-primary': '#73eff0',
  'text-secondary': '#eb21b6',
  'text-tertiary': '#32a1c6',
  'card-bkd': '#eee',
  'background-color': '#1f2935',
  'text-color': '#fff',
  'credits-background': '#161e27',
  'border-color': '#1e3652',
  'shadow-color': '#222',
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

  // The main change I made was to specify the type of the theme parameter as a Record<string, string>. This tells TypeScript that theme is an object with string keys and string values. By doing this, TypeScript will no longer raise the TS2564 error which is related to using an empty object ({}) as a type annotation.
  // I also used the Record utility type instead of an empty object ({}) to provide a more explicit and descriptive type annotation for the theme parameter. This makes it easier for other developers to understand what the expected shape of the theme object should be.
  private setTheme(theme: Record<string, string>) {
    Object.keys(theme).forEach((k) =>
      this.document.documentElement.style.setProperty(`--${k}`, theme[k])
    );
  }
}
