import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginPromptService } from '../shared/login-prompt.service';

@Injectable({ providedIn: 'root' })
export class AuthGuardService {
  constructor(private auth: AuthService, private router: Router, private prompt: LoginPromptService) { }
  canActivate(): boolean {
    if (!this.auth.isLoggedIn()) {
      this.prompt.open({
        message: 'You need to log in to access this page.',
        returnUrl: this.router.url
      });
      return false;
    }
    return true;
  }
}

export const authGuard: CanActivateFn = () => {
  // Placeholder, not used directly since we wrap with class for DI
  return true;
};



