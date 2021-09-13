import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalCustomNavigationClient
} from '@azure/msal-angular';

import {
  AuthenticationResult,
  InteractionStatus,
  PopupRequest,
  SilentRequest,
  RedirectRequest
} from '@azure/msal-browser';

import { Client } from '@microsoft/microsoft-graph-client';
// import { AuthCodeMSALBrowserAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/authCodeMsalBrowser';
// import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

import { environment } from 'src/environments/environment';
import { User } from 'src/architecture/shared/models/user';
import { StorageHelper } from 'src/architecture/shared/helpers/storage';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  public authenticated: boolean;
  public storage: StorageHelper;

  private graphClient: Client;

  private popUpRequest: PopupRequest = {
    scopes: environment.graphConsentScopes
  };

  private silentUpRequest: SilentRequest = {
    scopes: environment.graphConsentScopes
  };

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router,
    private location: Location
  ) {

    this.init();
  }

  private init(): void {

    this.storage = new StorageHelper();

    const customNavigationClient = new MsalCustomNavigationClient(this.msalService, this.router, this.location);
    this.msalService.instance.setNavigationClient(customNavigationClient);

    this.isAuthenticated();

    this.msalBroadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.isAuthenticated();
      this.checkAndSetActiveAccount();
    });

    this.msalService.handleRedirectObservable().subscribe((response) => {

      if (response) {
        console.log('Redirect Success: ', response);
      }

    }, (error) => {
      console.error('Redirect Error: ', error.errorMessage);
    });

     if (environment.name === '' || environment.name === 'desenvolvimento') {
       this.enableLoggerMSAL();
     }

  }

  public login(): void {

    if (!environment.popUp) {
      this.onLoginRedirect();
    } else {
      this.onLoginPopup();
    }

  }

  public logout(): void {

    this.user = new User();
    this.authenticated = false;
    this.removeUserSession();
    this.onLogout(environment.popUp);

    // Testar
    this.destroy();

  }

  public async getUser(): Promise<User> {

    if (!this.authenticated) {
        return null;
    }

    try {

      const accounts = this.msalService.instance.getAllAccounts();
      const account = accounts[0];

      const user = new User();
      user.displayName = account.name;
      user.email = account.username;

      return user;

    } catch (error) {
      // console.log(error);
    }

  }

  public async getUserByEmail(email: string): Promise<User> {

    if (!this.authenticated) {
        return null;
    }

    try {

      this.graphClient = this.getClient();
      const graphUser = await this.graphClient.api('/users/' + email).get();
      return new User(graphUser);

    } catch (error) {
      // console.log(error);
    }

  }

  public async getUserPhoto(): Promise<any> {

    if (!this.authenticated) {
        return null;
    }

    try {

      this.graphClient = this.getClient();
      const graphUserPhoto = await this.graphClient.api('/me/photo/$value').get();
      return graphUserPhoto;

    } catch (error) {
      // console.log(error);
    }

  }

  public async getMemberOf(alias: string = ''): Promise<any> {

    if (!this.authenticated) {
        return null;
    }

    try {

      this.graphClient = this.getClient();
      const path = (alias ? '/users/' + alias : '/me') + '/memberOf';

      let result = await this.graphClient.api(path).get();
      let values: any[] = result.value;

      while (result['@odata.nextLink']) {

        const nextPage = path + '?' + result['@odata.nextLink'].split('?')[1];
        result = await this.graphClient.api(nextPage).get();

        result.value.forEach(element => {
          values.push(element);
        });

      }

      return values;

    } catch (error) {
      // console.log(error);
    }

  }

  public enableLoggerMSAL(): void {

    // this.msalService.setLogger(new Logger((logLevel, message, piiEnabled) => {
    //   console.log('MSAL Logging: ', message);
    // }, {
    //   correlationId: CryptoUtils.createNewGuid(),
    //   piiLoggingEnabled: false
    // }));

  }

  public removeUserSession(): void {

    try {

      let key = '';
      const storage = this.storage.getAllKeys();

      for (let i = 0; i < storage.length; i++) {

        key = storage.key(i);

        if (key) {

          if (this.iskeyValidToRemove(key)) {
            this.storage.removeItem(key);
          }

        }

      }


    } catch (error) {
      // console.log(error);
    }

  }

  public destroy(): void {

    this._destroying$.next(null);
    this._destroying$.complete();

  }

  private onLoginRedirect(): void {

    if (this.msalGuardConfig.authRequest) {
      this.msalService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.msalService.loginRedirect();
    }

  }

  private onLoginPopup(): void {

    if (this.msalGuardConfig.authRequest) {

      this.msalService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
        .subscribe((response: AuthenticationResult) => {
          this.msalService.instance.setActiveAccount(response.account);
        });

      } else {

        this.msalService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this.msalService.instance.setActiveAccount(response.account);
          });

    }

  }

  private onLogout(popup?: boolean): void  {

    if (popup) {

      this.msalService.logoutPopup({
        mainWindowRedirectUri: '/'
      });

    } else {
      this.msalService.logoutRedirect();
    }

  }

  private isAuthenticated(): void {
    this.authenticated = this.msalService.instance.getAllAccounts().length > 0;
  }

  private checkAndSetActiveAccount(): void {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    const activeAccount = this.msalService.instance.getActiveAccount();

    if (!activeAccount && this.msalService.instance.getAllAccounts().length > 0) {
      const accounts = this.msalService.instance.getAllAccounts();
      this.msalService.instance.setActiveAccount(accounts[0]);
      this.authenticated = true;
    }
  }

  private getAccessToken(): Observable<AuthenticationResult> {

    if (!environment.popUp) {
      return this.msalService.acquireTokenSilent(this.silentUpRequest);
    }

    return  this.msalService.acquireTokenPopup(this.popUpRequest);
  }

  private getClient(): Client {

    return Client.init({

      baseUrl: environment.endpoints.graphApiUri,
      defaultVersion: 'v1.0',
      authProvider: async (done) => {

        this.getAccessToken()
          .subscribe((response: AuthenticationResult) => {

            if (response) {
              done(null, response.accessToken);
            } else {
              done('Client: Não foi possível obter o accessToken', null);
            }

          }, (error) => {
            console.log(error);
            done(error, null);
          });
      }

    });

  }

  private iskeyValidToRemove(key: string): boolean {

    let result = true;
    const keysNotRemoved = ['msal', 'authority', 'language', '-resource'];

    for (let i = 0; i < keysNotRemoved.length; i++) {

      const item = keysNotRemoved[i];

      if (key.indexOf(item) > -1) {
        result = false;
        break;
      }

    }

    return result;

  }

}
