import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceError } from '../common/service.error';
import { LoggedUser } from '../login/loggedUser';
import { ComponentBase } from '../common/component.base';
import { RegistrationService } from './register.service';
import { RegistrationDao } from './registration.dao';
import { UserService } from '../login/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends ComponentBase {

  public email: string;
  public lastName: string;
  public firstName: string;
  public phone: string;
  public password: string;
  public dashboard: string;
  public isLoading: boolean;

  private cannotRegister: boolean = true;

  constructor(
    private registrationService: RegistrationService,
    translateService: TranslateService,
    userService: UserService,
    router: Router) {
    super(router, translateService, userService);
  }

  public onEmailInput = (e) => {
    this.email = e.component._options.text;
  }

  public onLastNameInput = (e) => {
    this.lastName = e.component._options.text;
  }

  public onFirstNameInput = (e) => {
    this.firstName = e.component._options.text;
  }

  public onPhoneInput = (e) => {
    this.phone = e.component._options.text;
  }

  public onPasswordInput = (e) => {
    this.password = e.component._options.text;
  }

  public onDashboardInput = (e) => {
    this.dashboard = e.component._options.text;
  }

  public register = () => {
    this.disable();

    const registration = new RegistrationDao({
      email: this.email,
      lastName: this.lastName,
      firstName: this.firstName,
      phone: this.phone,
      password: this.password,
      dashboard: this.dashboard
    });

    return this.registrationService
      .register(registration)
      .then(this.handleRegisterSuccess)
      .then(this.enable)
      .catch((err) => {
        this.handleRegisterError(new ServiceError(err.json()));
      });
  }

  private disable = () => {
    this.isLoading = true;
  };

  private enable = () => {
    this.isLoading = false;
  };

  private handleRegisterSuccess = (user: LoggedUser) => {
    this.router.navigate(['/']);
  };

  private handleRegisterError = (error: ServiceError) => {
    this.showFailure(`Failed to login for email [${this.email}] - ${error.toErrorString()}`);
    this.password = '';
    this.enable();
  };

}
