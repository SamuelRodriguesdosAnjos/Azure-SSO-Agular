import { Injectable, Injector } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LanguageConfig } from '../models/language-config';
import { HttpServiceBase } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

    private langResource: Array<any>;
    private httpBase: HttpServiceBase;
    private baseURL: string;

    private STORAGE_LANGUAGE;
    private STORAGE_KEY_LANGUAGE;
    private PATH_RESOURCE_LANGUAGE;

    constructor(injector: Injector) {

        this.STORAGE_LANGUAGE = 'language';
        this.STORAGE_KEY_LANGUAGE = 'language-resource';
        this.PATH_RESOURCE_LANGUAGE = '/assets/languages/';
        this.httpBase = injector.get(HttpServiceBase);

    }

    public init(options: LanguageConfig): void {

        if (!options.baseUrl) {
            throw new Error('Language Service: baseUrl não pode ser null');
        }

        this.baseURL = options.baseUrl;

        if (options.resourceKey) {
            this.STORAGE_KEY_LANGUAGE = options.resourceKey;
        }

        if (options.pathResource) {
            this.PATH_RESOURCE_LANGUAGE = options.pathResource;
        }

    }

    public translate(key: string): string {

        this.langResource = this.getResource();

        if (this.langResource == null) {
            return;
        }

        const item = this.langResource.find(x => x.key === key);

        if (item) {
            return item.value;
        }

        return key;

    }

    public getLanguage(): string {
        return sessionStorage.getItem(this.STORAGE_LANGUAGE);
    }

    public setLanguage(language: string): void {

        sessionStorage.setItem(this.STORAGE_LANGUAGE, language);
        this.removeResource();
        this.loadLanguage();

    }

    public hasResource(): boolean {
        return sessionStorage.getItem(this.STORAGE_KEY_LANGUAGE) !== null;
    }

    public getResource(): any {

        const resource = sessionStorage.getItem(this.STORAGE_KEY_LANGUAGE);

        if (resource) {
            return JSON.parse(resource);
        }

        return null;

    }

    public setResource(json: string): void {
        sessionStorage.setItem(this.STORAGE_KEY_LANGUAGE, json);
    }

    public removeResource(): void {
        sessionStorage.removeItem(this.STORAGE_KEY_LANGUAGE);
    }

    private loadLanguage(): void {

        if (!this.hasResource()) {

            const url = this.baseURL + this.PATH_RESOURCE_LANGUAGE + 'language-' + this.getLanguage() + '.json';

            this.httpBase.get(url, null, false, true)
                .subscribe((data: any) => {

                    this.langResource = data.result;
                    const result = JSON.stringify(this.langResource);
                    this.setResource(result);
                    window.location.reload();

                }),
                catchError((error: any) => {
                    console.log(error);
                    return throwError(error);
                });

        }

    }

}
