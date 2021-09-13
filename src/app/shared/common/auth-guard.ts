import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthGuard implements CanActivate {

    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    public canActivate(): boolean {

        if (!this.authService.getUser()) {

            this.authService.login();
            return false;

        }

        return true;

    }

}
