import { Component, Injector, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './sem-acesso.component.html'
})
export class SemAcessoComponent extends AppComponent implements OnInit {

  constructor(inject: Injector, public route: Router) {
    super(inject);
  }

  public ngOnInit() {

    this.userGroups = this.getGroups();

    if (this.userGroups && this.userGroups.length > 0) {
      this.route.navigateByUrl('portal');
    }

  }

}
