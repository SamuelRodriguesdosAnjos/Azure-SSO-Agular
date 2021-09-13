import { IPermission } from '../interfaces/permission';

export class Permission implements IPermission {

    public application: string;
    public permission: string;

    constructor() {

      this.application = '';
      this.permission = '';

    }
}
