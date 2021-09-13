import { IMenuItem } from '../interfaces/menu-item';

export class MenuItem implements IMenuItem {

    label: string;
    value: string;

    constructor() {

      this.label = '';
      this.value = '';

    }
}
