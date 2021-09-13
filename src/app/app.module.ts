/* Angular */
import {NgModule} from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';

/* Modules */
import {AppRoutes} from './app.routes';

/* General */
import {BlockUIModule} from 'ng-block-ui';
import {environment} from 'src/environments/environment';

/* Azure SSO */
import {
    MsalGuard,
    MsalInterceptor,
    MsalBroadcastService,
    MsalInterceptorConfiguration,
    MsalModule,
    MsalService,
    MSAL_GUARD_CONFIG,
    MSAL_INSTANCE,
    MSAL_INTERCEPTOR_CONFIG,
    MsalGuardConfiguration,
    MsalRedirectComponent
} from '@azure/msal-angular';
import {
    IPublicClientApplication,
    PublicClientApplication,
    InteractionType,
    BrowserCacheLocation,
    LogLevel
} from '@azure/msal-browser';

/* FontAwesome */
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

/* Services */
import { AuthService } from './shared/services/auth.service';
import { AuthGuard } from './shared/common/auth-guard';

/* Components */
import {AppComponent} from './app.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './app.footer.component';
import {AppProfileComponent} from './app.profile.component';
import {PortalComponent} from './portal/portal.component';
import {SemAcessoComponent} from './sem-acesso/sem-acesso.component';

import { HttpServiceBase } from 'src/architecture/shared/services/http-base.service';
import { UserService } from 'src/architecture/shared/services/user.service';
import { ColorService } from 'src/architecture/shared/services/color.service';
import { LanguageService } from 'src/architecture/shared/services/language.service';

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function loggerCallback(logLevel: LogLevel, message: string) {
    console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {

    return new PublicClientApplication({
        auth: {
            clientId: environment.clientId,
            authority: environment.endpoints.loginApiUri,
            redirectUri: environment.portalURL,
            postLogoutRedirectUri: environment.portalURL,
            navigateToLoginRequestUrl : true
        },
        cache: {
            cacheLocation: BrowserCacheLocation.LocalStorage,
            storeAuthStateInCookie: isIE, // set to true for IE 11
        },
      system: {
        loggerOptions: {
          loggerCallback,
          logLevel: LogLevel.Info,
          piiLoggingEnabled: false
        }
      }
    });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {

    const protectedResourceMap = new Map<string, Array<string>>();
    protectedResourceMap.set(environment.endpoints.loginApiUri + '/v1.0/me', environment.consentScopes);

    return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap
    };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
    return {
      interactionType: InteractionType.Redirect,
      authRequest: {
        scopes: []
      }
    };
}

@NgModule({
    imports: [
        HttpClientModule,
        BrowserModule,
        AppRoutes,
        FontAwesomeModule,
        BlockUIModule.forRoot(),
        MsalModule
    ],
    declarations: [
        AppComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppProfileComponent,
        SemAcessoComponent,
        PortalComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: MsalInterceptor,
            multi: true
        },
        {
            provide: MSAL_INSTANCE,
            useFactory: MSALInstanceFactory
        },
        {
            provide: MSAL_GUARD_CONFIG,
            useFactory: MSALGuardConfigFactory
        },
        {
            provide: MSAL_INTERCEPTOR_CONFIG,
            useFactory: MSALInterceptorConfigFactory
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
        AuthGuard,
        AuthService,
        HttpServiceBase,
        UserService,
        ColorService,
        LanguageService
    ],
    bootstrap: [AppComponent, MsalRedirectComponent]
})
export class AppModule { }
