import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const allowedRoles = route.data['roles'] as string[] | undefined;
    const user = this.authService.getCurrentUser();

    if (!allowedRoles || !user) {
      return this.router.createUrlTree(['/auth/login']);
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    return this.router.createUrlTree(['/dashboard']);
  }
}