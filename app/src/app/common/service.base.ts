
import { Headers } from '@angular/http';
import { UserService } from '../login/user.service';

export abstract class ServiceBase {

    constructor(protected serviceName: string, protected userService: UserService) {
    }

    authorizationHeader(): Object {
        const token = this.userService.getApiToken();
        return { 'Authorization': token};
    };

    createAuthorizationHeader(): Headers {
        const headers = new Headers();
        const token = this.userService.getApiToken();
        headers.append('Authorization', token);
        return headers;
    }

}
