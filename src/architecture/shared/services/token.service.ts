import { Injectable, Injector } from '@angular/core';
import { ParseHelper } from '../helpers/parse';
import { StorageHelper } from '../helpers/storage';
import { TokenResponse } from '../models/token-response';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenConfig } from '../models/token-config';
import { HttpServiceBase } from './http-base.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private parse: ParseHelper;
  private storage: StorageHelper;
  private config: TokenConfig;
  private httpBase: HttpServiceBase;

  constructor(injector: Injector) {

    this.parse = new ParseHelper();
    this.storage = new StorageHelper();
    this.httpBase = injector.get(HttpServiceBase);

  }

  public init(config: TokenConfig): void {
    this.config = config;
  }

  public setToken(token: TokenResponse, expiresAt: number = null): void {

    if (!token) {
        throw new Error('setTokenSession: O token não pode ser null.');
    }

    if (!expiresAt) {
        expiresAt = (token.expires_in * 850) + Date.now();
    }

    if (token.refresh_token) {
      this.storage.setItem('refresh_token', token.refresh_token);
    }

    if (token.token_type) {
      this.storage.setItem('token_type', token.token_type);
    }

    if (!token.access_token) {
      throw new Error('setTokenSession: O access_token não pode ser null.');
    }

    if (!token.expires_in) {
      throw new Error('setTokenSession: O expires_in não pode ser null.');
    }

    this.storage.setItem('access_token', token.access_token);
    this.storage.setItem('expires_in', this.parse.toStringify(token.expires_in));
    this.storage.setItem('expires_at', this.parse.toStringify(expiresAt));
    this.storage.setItem('created_at', new Date().toString());

  }

  public removeToken(): void {

    this.storage.removeItem('access_token');
    this.storage.removeItem('token_type');
    this.storage.removeItem('refresh_token');
    this.storage.removeItem('expires_in');
    this.storage.removeItem('expires_at');
    this.storage.removeItem('created_at');

  }

  public renewToken(): void {
    this.refreshToken().subscribe((response: TokenResponse) => this.setToken(response));
  }

  public refreshToken(): Observable<any> {
    return this.createToken();
  }

  public createToken(): Observable<any> {

    let urlHost = this.config.gatewayConfig.urlHost;
    const gatewayClientId = this.config.gatewayConfig.clientId;
    const gatewayClientSecret = this.config.gatewayConfig.clientSecret;

    if (!urlHost) {
      throw new Error('createToken: A urlHost não pode ser null.');
    }

    if (!gatewayClientId) {
      throw new Error('createToken: O gateway clientId não pode ser null.');
    }

    if (!gatewayClientSecret) {
      throw new Error('createToken: O gateway clientSecret não pode ser null.');
    }

    urlHost += '/oauth/access-token';

    if (!this.config.headers) {

      this.config.headers = new HttpHeaders({
        'Authorization': 'Basic ' + this.parse.toBtoa(gatewayClientId + ':' + gatewayClientSecret),
        'Content-Type': 'application/x-www-form-urlencoded',
      });

    }

    if (!this.config.body) {
      this.config.body = `grant_type=client_credentials`;
    }

    return this.httpBase.post(urlHost, this.config.body, this.config.headers, false, false);

  }

  public getRefreshToken(): string {
    return this.storage.getItem('refresh_token');
  }

}
