import notify from 'devextreme/ui/notify';
import { ServiceError } from './service.error';
import { LoggedUser } from '../login/loggedUser';
import CustomStore from "devextreme/data/custom_store";
import { Router } from '@angular/router';
import { UserService } from '../login/user.service';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

export class ComponentBase {

    env: any;
    loggedUser: LoggedUser;

    constructor(public router: Router, public translate: TranslateService, public userService : UserService) {
        this.env = environment;

        this.loggedUser = userService.getLoggedUser();
    
        translate.setDefaultLang(this.env.appLangage);

    }

    public redirectTo = (uri: string) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate([uri]));
    }

    protected showSuccess = (msg) => {
        notify({
            message: msg,
            position: {
                my: "center top",
                at: "center top"
            }
        }, "success", 1000);

    };

    protected showServiceFailure = (err: ServiceError) => {

        const message = `${err.name} - ${err.message}`;

        notify({
            message: message,
            position: {
                my: "center top",
                at: "center top"
            }
        }, "error", 2000);

    };

    protected showFailure = (err) => {

        let message = err;

        if (err._body) {
            var json = err.json();
            message = `${err.toString()} - ${json.name}:${json.message}`
        }

        notify({
            message: message,
            position: {
                my: "center top",
                at: "center top"
            }
        }, "error", 2000);

    };
}