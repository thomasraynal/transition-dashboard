import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { ServiceBase } from '../common/service.base';
import { LoggedUser } from '../login/loggedUser';
import { UserService } from '../login/user.service';
import { RegistrationDao } from './registration.dao';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService extends ServiceBase {

    constructor(private http: Http, userService: UserService) {
        super('RegistrationService', userService);
    }

    register(registrationDao: RegistrationDao): Promise<LoggedUser> {

        return this.http
            .post(environment.apiUrl + "/auth/register", registrationDao).toPromise()
            .then((user) => {
                var loggedUser = new LoggedUser(user.json());
                this.userService.set(loggedUser);
                return loggedUser;
            });

    };
}
