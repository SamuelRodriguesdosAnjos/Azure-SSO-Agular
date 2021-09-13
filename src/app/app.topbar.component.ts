import {Component, Injector, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import {
    faSignInAlt,
    faUser,
    faQuestionCircle,
    faUserFriends,
    faRetweet
} from '@fortawesome/free-solid-svg-icons';

import { User } from 'src/architecture/shared/models/user';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent extends AppComponent implements OnInit {

    @Input() profileDisplayName = '';
    @Input() applicationDisplayName = '';
    @Input() showMenuItems = false;
    @Input() showMenuItemApplication = false;
    @Input() showMenuItemProfile = false;

    @Output() eventChangeApplication: EventEmitter<any> = new EventEmitter();
    @Output() eventChangeProfile: EventEmitter<any> = new EventEmitter();

    public faSignInAlt = faSignInAlt;
    public faUser = faUser;
    public faQuestionCircle = faQuestionCircle;
    public faUserFriends = faUserFriends;
    public faRetweet = faRetweet;

    public userInfo: User;
    public topMenuClass = false;

    private defaultAvatar = 'assets/layout/images/avatar6.png';

    constructor(inject: Injector) {
        super(inject);
    }

    public ngOnInit() {

        this.userInfo = new User();

        if (this.isAuthenticated()) {

            this.setDefaultAvatar();

            if (!this.userInfo.email) {
                this.getUserInfo();
            }

        }

    }

    private getUserInfo(): void {

        this.getUserMsal().then((user: User) => {

            if (user) {

                this.userInfo.email = user.email;
                this.userInfo.timeZone = user.timeZone;

                this.setDisplayName(user.displayName);
                this.setUser(this.userInfo);

            }

        });

        this.getUserPhoto().then((photo: any) => {

            if (photo) {

                this.toFile(photo).then(result => {
                    this.userInfo.avatar = result.data;
                }).catch(() => {
                    this.setDefaultAvatar();
                });

            } else {
                this.setDefaultAvatar();
            }

        });

    }

    private setDefaultAvatar(): void {
        this.userInfo.avatar = this.defaultAvatar;
    }

    private setDisplayName(displayName: string): void {

        const name = displayName.split(' ');

        if (name && name.length > 1) {

            const maxLength = name.length - 1;
            this.userInfo.displayName = name[0] + ' ' + name[maxLength];

        } else {
            this.userInfo.displayName = name[0];
        }

    }

    public showOrHideTopMenu(): void {

        this.topMenuClass = !this.topMenuClass;

        if (this.topMenuClass) {

            // Fecha automaticamente depois de 10000 ms
            setTimeout(() => {
                this.topMenuClass = false;
            }, 50000);

        }

    }

    public changeApplication(): void {

        this.applicationDisplayName = '';
        this.eventChangeApplication.emit();

    }

    public changeProfile(): void {
        
        this.profileDisplayName = '';
        this.eventChangeProfile.emit();

    }

    public openHelpURL(): void {
        window.open(environment.helpURL, '_blank');
    }

}
