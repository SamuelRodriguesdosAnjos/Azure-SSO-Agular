// Angular
import { Injector } from '@angular/core';

// Services
import { UserService } from './shared/services/user.service';
import { ColorService } from './shared/services/color.service';

// Helpers
import { ParseHelper } from './shared/helpers/parse';
import { StorageHelper } from './shared/helpers/storage';

// Models
import { User } from './shared/models/user';
import { Group } from './shared/models/group';
import { Permission } from './shared/models/permission';

export abstract class AppComponentBase {

  private parse: ParseHelper;
  private storage: StorageHelper;
  private userService: UserService;
  private colorService: ColorService;

  constructor(inject: Injector) {

    this.userService = inject.get(UserService);
    this.colorService = inject.get(ColorService);

    this.parse = new ParseHelper();
    this.storage = new StorageHelper();

  }

  public getUser(): User {
    return this.userService.getUser();
  }

  public getProfile(): string {
    return this.userService.getProfile();
  }

  public getGroups(): Array<Group> {
    return this.userService.getGroups();
  }

  public getPermissions(): Array<Permission> {
    return this.userService.getPermissions();
  }

  public setUser(user: User): void {
    this.userService.setUser(user);
  }

  public setProfile(profile: string): void {
    this.userService.setProfile(profile);
  }

  public setGroups(groups: Array<Group>): void {
    this.userService.setGroups(groups);
  }

  public setPermissions(permisions: Array<Permission>): void {
    this.userService.setPermissions(permisions);
  }

  public storageGetItem(key: string): string {
    return this.storage.getItem(key);
  }

  public storageSetItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  public storageRemoveItem(key: string): void {
    this.storage.removeItem(key);
  }

  public toJSON(value: string): any {
    return this.parse.toJSON(value);
  }

  public toNumber(value: string): number {
    return this.parse.toNumber(value);
  }

  public toStringify(value: any): string {
    return this.parse.toStringify(value);
  }

  public toString(value: any): string {
    return this.parse.toString(value);
  }

  public toFloat(value: any, fractionDigits?: number): number {
    return this.parse.toFloat(value, fractionDigits);
  }

  public toArray(value: any, split: string): Array<string> {
    return this.parse.toArray(value, split);
  }

  public toFile(blob: Blob): Promise<any> {
    return this.parse.toFile(blob);
  }

  public toBase64(file: File): Promise<any> {
    return this.parse.toBase64(file);
  }

  public toRGB(colorName?: string, hex?: string): any {
    return this.parse.toRGB(colorName, hex);
  }

  public toHEX(colorName?: string, rgb?: string): string {
    return this.parse.toHEX(colorName, rgb);
  }

  public getColorRandomlyHex(tries: number = 3): string {
    return this.colorService.randomlyHEX(tries);
  }

}
