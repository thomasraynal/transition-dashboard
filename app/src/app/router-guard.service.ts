import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './login/user.service';

@Injectable({
  providedIn: 'root'
})
export class RouterGuardService implements CanActivate {

  constructor(private router: Router, private userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    var currentUser = this.userService.getLoggedUser();

    if (currentUser && currentUser.expiration > new Date()) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
