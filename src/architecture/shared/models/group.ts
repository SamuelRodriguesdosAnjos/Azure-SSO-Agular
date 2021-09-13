import { IGroup } from '../interfaces/group';

export class Group implements IGroup {

    public id: string;
    public displayName: string;
    public description: string;

    constructor() {

      this.id = '';
      this.displayName = '';
      this.description = '';

    }
}
