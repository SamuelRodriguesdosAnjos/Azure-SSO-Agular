import { ParseHelper } from './parse';

export class StorageHelper {

    private parse: ParseHelper;
    private cacheLocation: string;

    constructor(cacheLocation: string = 'sessionStorage') {

        this.cacheLocation = cacheLocation;
        this.parse = new ParseHelper();

    }

    public getItem(key: string): string {

        let value = null;

        if (this.isSessionStorage()) {
            value = sessionStorage.getItem(key);
        } else {
            value = localStorage.getItem(key);
        }

        if (value) {
            return this.parse.toAtob(value);
        }

        return value;

    }

    public setItem(key: string, value: any): void {

        if (this.isSessionStorage()) {
            sessionStorage.setItem(key, this.parse.toBtoa(value));
        } else {
            localStorage.setItem(key, this.parse.toBtoa(value));
        }

    }

    public removeItem(key: string): void {

        if (this.isSessionStorage()) {
            sessionStorage.removeItem(key);
        } else {
            localStorage.removeItem(key);
        }

    }

    public getAllKeys(): Storage {

        if (this.isSessionStorage()) {
            return sessionStorage;
        } else {
            return localStorage;
        }

    }

    private isSessionStorage(): boolean {
        return this.cacheLocation === 'sessionStorage';
    }

}
