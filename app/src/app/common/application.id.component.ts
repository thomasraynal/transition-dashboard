import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
import { UserService } from '../login/user.service';

@Component({
    selector: 'app-id',
    template: '{{env.appName}} - {{env.appVersion}}',
})

export class ApplicationIdComponent {
    public env: any;
    constructor() {
        this.env = environment;
    }
}