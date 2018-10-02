import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { LoggedUser } from './loggedUser';
import { Router } from '@angular/router';

const appCookie = 'transitionDashboard';
const admin = 'ADMIN';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private cookieService: CookieService, private router: Router) {
  }

  set(user: LoggedUser) : void {
    this.cookieService.put(appCookie, JSON.stringify(user));
  };

  disconnect() : void  {
    this.cookieService.remove(appCookie);
    this.router.navigate(['/login']);
  };

  getApiToken() : string {
    var user = this.getLoggedUser();
    if (user === null) return null;
    return user.token;
  };

  getLoggedUser() : LoggedUser {
    var cookie = this.cookieService.get(appCookie);
    if (null == cookie) return null;
    var user = new LoggedUser(JSON.parse(cookie));
    if (null == user.expiration || new Date() > user.expiration) {
      this.router.navigate(["/login"]);
      return null;
    }
    return user;
  };

  isAdmin() : boolean {
    var loggedUser = this.getLoggedUser();
    if (null == loggedUser) return false;
    return loggedUser.user.position === admin;
  };
}
