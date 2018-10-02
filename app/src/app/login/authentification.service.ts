import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { ServiceBase } from '../common/service.base';
import { LoggedUser } from './loggedUser';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService extends ServiceBase {

  constructor(private http: Http, userService: UserService) {
    super('AuthentificationService', userService);
  }

  login(email: string, password: string, dashboard: string): Promise<LoggedUser> {

    return this.http
      .post(environment.apiUrl + "/auth/login", { 'email': email, 'password': password, 'dashboard': dashboard }).toPromise()
      .then((user) => {
        var loggedUser = new LoggedUser(user.json());
        this.userService.set(loggedUser);
        return loggedUser;
      });

  };
}
