import {Routes, RouterModule} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {MsalGuard} from '@azure/msal-angular';

import {PortalComponent} from './portal/portal.component';
import {SemAcessoComponent} from './sem-acesso/sem-acesso.component';

export const routes: Routes = [
    {
        path: '',
        component: PortalComponent,
        canActivate: [MsalGuard]
    },
    {
        path: 'portal',
        component: PortalComponent,
        canActivate: [MsalGuard]
    },
    {
        path: 'sem-acesso',
        component: SemAcessoComponent
    }
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'});
