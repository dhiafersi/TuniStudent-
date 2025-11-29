import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { HttpClient } from '@angular/common/http';

export interface CurrentUser {
  username: string;
  roles: string[];
  email?: string;
  firstName?: string;
  lastName?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<CurrentUser | null>(null);
  userId = signal<number | null>(null);

  constructor(private keycloak: KeycloakService, private router: Router, private http: HttpClient) {
    this.initUser();
  }

  private async initUser() {
    try {
      if (await this.keycloak.isLoggedIn()) {
        const profile = await this.keycloak.loadUserProfile();
        const roles = this.keycloak.getUserRoles();
        this.currentUser.set({
          username: profile.username || '',
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          roles: roles
        });

        // Fetch backend user ID
        this.http.get<any>('http://localhost:8080/api/users/me/stats').subscribe({
          next: (stats) => {
            if (stats && stats.user) {
              this.userId.set(stats.user.id);
            }
          },
          error: (err) => console.error('Failed to fetch user stats', err)
        });

        // Redirect logic based on role
        const currentUrl = this.router.url.split('?')[0];
        if (currentUrl === '/' || currentUrl === '/register') {
          if (this.isAdmin()) {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/']);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load user profile', e);
    }
  }

  async login() {
    await this.keycloak.login({
      redirectUri: window.location.origin + '/'
    });
  }

  async register() {
    await this.keycloak.register({
      redirectUri: window.location.origin + '/'
    });
  }

  logout() {
    this.keycloak.logout();
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  isAdmin(): boolean {
    return this.keycloak.isUserInRole('ADMIN');
  }

  getToken(): Promise<string> {
    return this.keycloak.getToken();
  }
}
