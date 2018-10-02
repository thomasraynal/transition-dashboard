import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthentificationService } from './authentification.service';
import { LoggedUser } from './loggedUser';
import { ServiceError } from '../common/service.error';
import { ComponentBase } from '../common/component.base';
import { UserService } from './user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent extends ComponentBase {

  public email: string;
  public password: string;
  public dashboard: string;
  public isLoading: boolean;

  constructor(
    private authentificationService: AuthentificationService,
    translateService: TranslateService,
    userService: UserService,
    router: Router) {
    super(router, translateService, userService);
  }

  public onPasswordInput = (e) => {
    this.password = e.component._options.text;
  }

  public onEmailInput = (e) => {
    this.email = e.component._options.text;
  }

  public onDashboardInput = (e) => {
    this.dashboard = e.component._options.text;
  }

  public onLoginInitialized = (e) => {
    e.component.registerKeyHandler("enter", ea => {
      if (this.isLoginDisabled()) return;
      this.login();
    });
  }

  public isLoginDisabled = () => {
    return undefined === this.dashboard || '' === this.dashboard ||
      undefined === this.email || '' === this.email ||
      undefined === this.password || '' === this.password;
  }

  public login = () => {
    this.disable();
    return this.authentificationService
      .login(this.email, this.password, this.dashboard)
      .then(this.handleLoginSuccess)
      .then(this.enable)
      .catch((err) => {
        this.handleLoginError(new ServiceError(err.json()));
      });
  }

  private disable = () => {
    this.isLoading = true;
  };

  private enable = () => {
    this.isLoading = false;
  };

  private handleLoginSuccess = (user: LoggedUser) => {
    this.router.navigate(['/']);
  };

  private handleLoginError = (error: ServiceError) => {
    this.showFailure(`${this.translate.get('FAILURE')} [${this.email}] - ${error.toErrorString()}`);
    this.password = '';
    this.enable();
  };

}
