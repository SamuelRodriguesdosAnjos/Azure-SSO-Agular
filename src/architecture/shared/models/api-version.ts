import { IApiVersion } from '../interfaces/api-version';

export class ApiVersion implements IApiVersion {

    public key: string;
    public version: string;

    constructor() {

      this.key = 'api-version';
      this.version = '1.0';

    }

    public setKey(newKey: string): void {
        this.key = newKey;
    }

    public setVersion(newVersion: string): void {
        this.version = newVersion;
    }

    public getVersion(): string {
        return this.key + '=' + this.version;
    }

}
