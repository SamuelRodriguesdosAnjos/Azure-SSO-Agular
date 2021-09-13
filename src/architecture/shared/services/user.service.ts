import { Injectable } from '@angular/core';
import { ParseHelper } from '../helpers/parse';
import { StorageHelper } from '../helpers/storage';
import { User } from '../models/user';
import { Group } from '../models/group';
import { Permission } from '../models/permission';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private parse: ParseHelper;
  private storage: StorageHelper;

  constructor() {

    this.parse = new ParseHelper();
    this.storage = new StorageHelper();

  }

  public setUser(user: User): void {
    this.storage.setItem('user.info', this.parse.toStringify(user));
  }

  public setProfile(profile: string): void {
    this.storage.setItem('user.profile', profile);
  }

  public setGroups(groups: Array<Group>): void {
    this.storage.setItem('user.groups', this.parse.toStringify(groups));
  }

  public setPermissions(permisions: Array<Permission>): void {
    this.storage.setItem('user.permissions', this.parse.toStringify(permisions));
  }

  public getUser(): User {

    const user = this.storage.getItem('user.info');

    if (!user) {
      return null;
    }

    return this.parse.toJSON(user);

  }

  public getGroups(): Array<Group> {

    const groups = this.storage.getItem('user.groups');

    if (!groups) {
      return null;
    }

    return this.parse.toJSON(groups);

  }

  public getPermissions(): Array<Permission> {

    const permissions = this.storage.getItem('user.permissions');

    if (!permissions) {
      return null;
    }

    return this.parse.toJSON(permissions);

  }

  public getProfile(): string {

    const profile = this.storage.getItem('user.profile');

    if (!profile) {
      return null;
    }

    return profile;

  }

  public removeUserSession(): Promise<any> {

    return new Promise((resolve, reject) => {

      try {

        let key = '';
        const storage = this.storage.getAllKeys();

        for (let i = 0; i < storage.length; i++) {

          key = storage.key(i);

          if (key) {

            // MSAL é a session do login da microsoft, por isso nunca removemos
            if (key.indexOf('msal') === -1) {
              this.storage.removeItem(key);
            }

          }

        }

        resolve(true);

      } catch (error) {
        reject(error);
      }

    });

  }

}
