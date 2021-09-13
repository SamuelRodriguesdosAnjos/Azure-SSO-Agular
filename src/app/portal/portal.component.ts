import { Component, OnInit, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { faIdCard } from '@fortawesome/free-regular-svg-icons';
import {
    faUser,
    faGrin,
    faUserAlt,
    faUserTie,
    faChalkboardTeacher,
    faBookReader
} from '@fortawesome/free-solid-svg-icons';

import { AppComponent } from '../app.component';
import { environment } from 'src/environments/environment';
import { Permission } from 'src/architecture/shared/models/permission';
import { Group } from 'src/architecture/shared/models/group';
import { HttpServiceBase } from 'src/architecture/shared/services/http-base.service';

@Component({
    selector: 'app-portal',
    templateUrl: './portal.component.html',
})
export class PortalComponent extends AppComponent implements OnInit {

    public heightViewport = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    public faUser = faUser;
    public faGrin = faGrin;
    public faIdCard = faIdCard;
    public faUserAlt = faUserAlt;
    public faUserTie = faUserTie;
    public faBookReader = faBookReader;
    public faChalkboardTeacher = faChalkboardTeacher;

    public url: SafeResourceUrl;
    public permissions: Array<Permission>;
    public profileDisplayName = '';
    public applicationDisplayName = '';
    public applicationSelected: any;
    public permissionSelected: any;
    public groupsDetails: any;
    public groupsDetailsAD: any;
    public applicationsDetails: any;

    private splitCaracter = ' ';
    private httpBase: HttpServiceBase;

    constructor(inject: Injector, public sanitizer: DomSanitizer, public route: Router) {

        super(inject);

        this.httpBase = inject.get(HttpServiceBase);

        this.url = null;
        this.userGroups = new Array<Group>();
        this.permissions = new Array<Permission>();
        this.groupsDetails = new Array<any>();
        this.groupsDetailsAD = new Array<any>();
        this.applicationsDetails = new Array<any>();
        this.applicationSelected = null;
        this.permissionSelected = null;
        this.applicationDisplayName = '';
        this.profileDisplayName = '';

    }

    public ngOnInit() {

        if (this.isAuthenticated()) {
            this.getUserGroups();
        }

        // Apenas para uso de OAuth2
        // this.httpBase.init();

    }

    private getUserGroups(): void {

        this.startLoad();

        this.getMemberOf().then((groups: any) => {

            this.stopLoad();

            if (groups) {

                this.userGroups = this.mapGroupsPortal(groups);

                if (this.userGroups && this.userGroups.length > 0) {

                    this.startLoad();

                    this.getApplicationsDetails().subscribe((response: any) => {

                        if (response.result) {

                            this.stopLoad();
                            this.createMenuAndPermissions();
                            this.getApplicationsByUser(response.result);

                        }

                    });

                } else {

                    this.stopLoad();
                    this.route.navigateByUrl('sem-acesso');

                }

            }

        });

    }

    private mapGroupsPortal(groups: any): any {

        return groups.map((group: any) => {
            return {
                id: group.id,
                displayName: group.displayName,
                description: group.description
            };
        })
        .filter((x: Group) => {
            return x.description && x.description.indexOf(this.groupKey) > -1;
        });

    }

    private createMenuAndPermissions(): void {

        let i = 0;
        let group = null;
        let label = '';
        let path = '';
        let permission = '';

        for (i = 0; i < this.userGroups.length; i++) {

            group = this.userGroups[i];
            path = group.displayName.trim();
            label = path.split(this.splitCaracter)[1];
            permission = path.split(this.splitCaracter)[2];

            this.permissions.push({ application: label, permission });

        }

        this.setGroups(this.userGroups);
        this.setPermissions(this.permissions);

    }

    private getApplicationsByUser(applications: any): void {

        for (let i = 0; i < applications.length; i++) {

            const app = applications[i];
            const filter = this.permissions.filter(x => x.application === app.key);

            if (filter && filter.length > 0) {
                this.applicationsDetails.push(app);
            }

        }

    }

    private getApplicationsDetails(): Observable<any> {

        const url = environment.portalURL + '/assets/applications/applications.json';
        return this.httpBase.get(url, null, false, true);

    }

    private getGroupsADDetails(app: string): Observable<any> {

        const url = environment.portalURL + '/assets/groups-ad/groups-ad-' + app.toLowerCase() + '.json';
        return this.httpBase.get(url, null, false, true);

    }

    public getProfilesByApplication(app: string): void {

        const filter = this.permissions.filter(x => x.application === app);

        if (filter) {

            for (let i = 0; i < filter.length; i++) {

                const group = this.groupsDetailsAD.find(x => x.key === filter[i].permission);

                if (group) {
                    this.groupsDetails.push(group);
                }
            }
        }

        // Ordem alfabética
        if (this.groupsDetails && this.groupsDetails.length > 0) {
            this.groupsDetails.sort((a: any, b: any) => a.displayName > b.displayName ? 1 : -1);
        }

    }

    public getIconsProfile(key: string): any {

        switch (key) {

            default:
                return this.faUser;

        }

    }

    public clickApplication(app: any): void {

        this.applicationSelected = app;
        this.applicationDisplayName = this.applicationSelected.displayName;

        this.startLoad();

        this.getGroupsADDetails(this.applicationSelected.key).subscribe((response: any) => {

            if (response.result) {

                this.groupsDetailsAD = response.result;
                this.getProfilesByApplication(this.applicationSelected.key);
                this.stopLoad();

            }

        });

    }

    public clickPermission(permission: any): void {

        this.permissionSelected = permission.key;
        this.profileDisplayName = permission.displayName;

        this.setProfile(this.permissionSelected);
        this.loadIframe(this.applicationSelected.path);

    }

    public changeApplication(): void {

        this.url = null;
        this.permissionSelected = null;
        this.applicationSelected = null;
        this.applicationDisplayName = '';

    }

    public changeProfile(): void {

        this.url = null;
        this.permissionSelected = null;
        this.profileDisplayName = '';

    }

    public loadIframe(pathApp: string): void {

        const url = 'URL_Application_Iframe/' + pathApp;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    }

}
