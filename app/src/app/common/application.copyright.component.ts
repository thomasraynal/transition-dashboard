import { Component } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-copyright',
    template: '© {{env.copyright}}',
})

export class ApplicationCopyrightComponent {
    public env: any;
    constructor() {
        this.env = environment;
    }
}