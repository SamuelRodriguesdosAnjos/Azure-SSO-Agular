import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() {
  }

  public randomlyHEX(tries: number = 3): string {

    let color = '';
    let count = 0;

    while (color.length < 7 || count <= tries) {

      count += 1 ;
      color = '#' + ((1 << 24) * Math.random() | 0).toString(16).slice(-6);

    }

    return color;

  }

}
