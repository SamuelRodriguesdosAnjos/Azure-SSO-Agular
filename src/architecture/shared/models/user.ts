import { IUser } from '../interfaces/user';

export class User implements IUser {

    public displayName: string;
    public email: string;
    public avatar: any;
    public timeZone!: string;

    constructor(graphUser: any = null) {

      this.displayName = '';
      this.email = '';
      this.timeZone = '';

      if (graphUser) {
        this.mapGraphUserToUser(graphUser);
      }
    }

    private mapGraphUserToUser(graphUser: any): void {

        this.displayName = graphUser.displayName || graphUser.name;
        this.email = graphUser.mail || graphUser.userPrincipalName;
    }
}
