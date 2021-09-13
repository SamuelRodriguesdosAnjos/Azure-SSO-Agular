import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PaginationModel } from '../models/pagination-model';

@Injectable({
    providedIn: 'root'
})
export class HttpServiceBase {

    private http: HttpClient;
    private accessToken: string;
    private gatewayClientId: string;

    constructor(injector: Injector) {
        this.http = injector.get(HttpClient);
    }

    public init(accessToken: string, gatewayClientId: string): void {

        this.accessToken = accessToken;
        this.gatewayClientId = gatewayClientId;

    }

    public get(url: string, headers: HttpHeaders = null, useToken: boolean = false, jsonRequest: boolean = true): Observable<any> {

        const options = this.headersWithToken(useToken, headers, jsonRequest);

        return this.http.get(url, { observe: 'response', headers: options })
            .pipe(map((response: HttpResponse<any>) => {

                response = response || null;
                const objectResponse = {
                    result: response.body.result == null ? response.body : response.body.result,
                    pagination: this.getPaginationResponse(response.headers),
                    totalItems: response.body.total
                };
                return objectResponse;

            }),
            catchError(error => this.handleError(error)));
    }

    public post(url: string, body: any, headers: HttpHeaders = null, useToken: boolean = false, jsonRequest: boolean = true): Observable<any> {

        const options = this.headersWithToken(useToken, headers, jsonRequest);

        return this.http.post(url, jsonRequest ? JSON.stringify(body) : body, { headers: options })
            .pipe(map((response: any) =>
                response != null ? response : null),
            catchError(error => this.handleError(error)));

    }

    public put(url: string, body: any, headers: HttpHeaders = null, useToken: boolean = false, jsonRequest: boolean = true): Observable<any> {

        const options = this.headersWithToken(useToken, headers, jsonRequest);

        return this.http.put(url, jsonRequest ? JSON.stringify(body) : body, { headers: options })
            .pipe(map((response: any) =>
                response != null ? response : null),
            catchError(error => this.handleError(error)));
    }

    public patch(url: string, body: any, headers: HttpHeaders = null, useToken: boolean = false, jsonRequest: boolean = true): Observable<any> {

        const options = this.headersWithToken(useToken, headers, jsonRequest);

        return this.http.patch(url, jsonRequest ? JSON.stringify(body) : body, { headers: options })
            .pipe(map((response: any) =>
                response != null ? response : null),
            catchError(error => this.handleError(error)));
    }

    public delete(url: string, body: any = null, headers: HttpHeaders = null, useToken: boolean = false, jsonRequest: boolean = true): Observable<any> {

        const options: any = {};

        if (body) {
            options.body = jsonRequest ? JSON.stringify(body) : body;
        }

        options.headers = this.headersWithToken(useToken, headers, jsonRequest);

        return this.http.delete(url, options)
            .pipe(map((response: any) =>
                response != null ? response : null),
            catchError(error => this.handleError(error)));
    }

    private headersWithToken(useToken: boolean = true, headers: HttpHeaders = null, jsonRequest: boolean = true): HttpHeaders {

        let httpHeaders = new HttpHeaders();

        if (headers) {
            httpHeaders = headers;
        }

        if (jsonRequest) {
            httpHeaders = httpHeaders.append('Content-Type', 'application/json');
        }

        if (useToken) {

            httpHeaders = httpHeaders.append('access_token', this.getToken());
            httpHeaders = httpHeaders.append('client_id', this.getClientId());

        }

        return httpHeaders;
    }

    private getToken(): string {

        if (!this.accessToken) {
            // throw new Error('Base Service: accessToken não pode ser null');
        }

        return this.accessToken;

    }

    private getClientId(): any {

        if (!this.gatewayClientId) {
            // throw new Error('Base Service: gatewayClientId não pode ser null');
        }

        return this.gatewayClientId;

    }

    private getPaginationResponse(headers: HttpHeaders) {

        const pagination: PaginationModel = new PaginationModel();
        pagination.pageNumber = JSON.parse(headers.get('Pagination.PageNumber'));
        pagination.pageSize = JSON.parse(headers.get('Pagination.PageSize'));
        pagination.totalPages = JSON.parse(headers.get('Pagination.TotalPages'));
        pagination.totalRows = JSON.parse(headers.get('Pagination.TotalRows'));
        return pagination;

    }

    private handleError(error: any): Observable<any> {
        return throwError(error);
    }

}
