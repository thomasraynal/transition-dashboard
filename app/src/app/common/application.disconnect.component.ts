import { Component } from '@angular/core';
import { UserService } from '../login/user.service';

@Component({
    selector: 'app-disconnect',
    template:  '<button type="button" class="btn btn-danger mr-sm-2" (click)="userService.disconnect()"><i class="fa fa-power-off"></i></button>'
})

export class ApplicationDisconnectComponent {
    public userService: UserService;
    constructor(userService: UserService) {
        this.userService =userService;
    }
}