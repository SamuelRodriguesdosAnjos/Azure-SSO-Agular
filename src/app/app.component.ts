import { Component, Injector, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

import { AppComponentBase } from 'src/architecture/app.component.base';
import { Group } from 'src/architecture/shared/models/group';
import { User } from 'src/architecture/shared/models/user';
import { LanguageService } from 'src/architecture/shared/services/language.service';
import { LanguageConfig } from 'src/architecture/shared/models/language-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent extends AppComponentBase implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  private authService: AuthService;

  private languageConfig: LanguageConfig 
  private languageService: LanguageService;

  // Filtra os grupos do AD que irão aparecer no portal
  public groupKey = 'Grupo de membros do Perfi';

  public userGroups: Array<Group>;

  constructor(inject: Injector) {

    super(inject);

    this.authService = inject.get(AuthService);
    this.languageService = inject.get(LanguageService);

    this.languageConfig = new LanguageConfig();
    this.languageConfig.baseUrl = environment.portalURL;
    this.languageConfig.resourceKey = 'resource-language-portal';
    this.languageConfig.pathResource = '/assets/languages/';

    this.languageService.init(this.languageConfig);
    
  }

  public ngOnInit(): void {

    if (!this.languageService.hasResource()) {
      this.languageService.setLanguage('pt-BR');
    }

  }

  public isAuthenticated(): boolean {
    return this.authService.authenticated;
  }

  public logout(): void {
    this.authService.logout();
  }

  public async getUserMsal(): Promise<User> {
    return this.authService.getUser();
  }

  public async getUserByEmail(email: string): Promise<User> {
    return this.authService.getUserByEmail(email);
  }

  public async getUserPhoto(): Promise<any> {
    return this.authService.getUserPhoto();
  }

  public async getMemberOf(): Promise<any> {
    return this.authService.getMemberOf();
  }

  public loadLanguage(language: string): void {
    this.languageService.setLanguage(language);
  }

  public translate(key: string): string {    
    return this.languageService.translate(key);
  }

  private removeSessionLanguage(): void {

    for (let i = 0; i < sessionStorage.length; i++) {

      let key = sessionStorage.key(i);

      if (key) {

        if (key.indexOf('language-') > -1 || key.indexOf('-resource') > -1 ) {
          sessionStorage.removeItem(key);
        }

      }

    }

  }

  public startLoad(keyMessage: string = 'Loading'): void {
    this.blockUI.start(this.translate(keyMessage));
  }

  public stopLoad(): void {
    this.blockUI.stop();
  }

}
