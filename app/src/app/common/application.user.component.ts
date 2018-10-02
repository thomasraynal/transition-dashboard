import { Component } from '@angular/core';
import { UserService } from '../login/user.service';
import { LoggedUser } from '../login/loggedUser';

@Component({
    selector: 'app-user',
    template: '[{{loggedUser.user.firstName}} {{loggedUser.user.lastName }}] - {{loggedUser.user.identity}}'
})

export class ApplicationUserComponent {
    public loggedUser: LoggedUser;
    constructor(userService: UserService) {
        this.loggedUser = userService.getLoggedUser();
    }
}