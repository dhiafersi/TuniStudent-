import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeToggleComponent } from './theme-toggle.component';
import { NotificationComponent } from './notification.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, ThemeToggleComponent, NotificationComponent],
  template: `
    <nav class="fixed top-0 left-0 right-0 z-[10000] glass border-0 border-b border-white/10 backdrop-blur-xl animate-slide-in-up">
      <div class="container mx-auto px-4 md:px-6">
        <div class="flex items-center justify-between h-20">
          <!-- Logo with Gradient -->
          <a routerLink="/" class="group flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-purple-500/50">
              <span class="text-2xl font-black text-white">T</span>
            </div>
            <span class="text-2xl font-black gradient-text hidden md:block">TuniStudent</span>
          </a>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-2">
            <a routerLink="/submit-deal" class="btn-glass text-sm px-5 py-2.5 flex items-center gap-2 group">
              <span class="text-xl group-hover:scale-125 transition-transform">✨</span>
              <span>Submit Deal</span>
            </a>
            
            <app-notification *ngIf="authService.currentUser()"></app-notification>
            
            <a routerLink="/favorites" *ngIf="authService.currentUser()" class="btn-glass text-sm px-5 py-2.5 flex items-center gap-2 group relative overflow-hidden">
              <span class="text-xl group-hover:scale-125 transition-transform">❤️</span>
              <span>Favorites</span>
            </a>
            
            <app-theme-toggle></app-theme-toggle>
            
            <div *ngIf="authService.currentUser()" class="flex items-center gap-2 ml-2">
              <a routerLink="/profile" class="btn-glass px-5 py-2.5 flex items-center gap-2 text-sm">
                <div class="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
                  {{ authService.currentUser()?.username?.charAt(0).toUpperCase() }}
                </div>
                <span class="hidden lg:inline">{{ authService.currentUser()?.username }}</span>
              </a>
              <button (click)="logout()" class="btn-glass px-4 py-2.5 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 text-sm font-semibold">
                Logout
              </button>
          </div>
            
            <div *ngIf="!authService.currentUser()" class="flex items-center gap-2">
              <a routerLink="/login" class="btn-glass px-6 py-2.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 font-semibold text-sm">
                Login
              </a>
              <a routerLink="/register" class="btn-glass px-6 py-2.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 font-semibold text-sm">
                Sign Up
              </a>
            </div>
          </div>

          <!-- Mobile Menu Button -->
          <button (click)="mobileMenuOpen = !mobileMenuOpen" class="md:hidden btn-glass px-4 py-3 text-2xl">
            <span *ngIf="!mobileMenuOpen">☰</span>
            <span *ngIf="mobileMenuOpen">✕</span>
          </button>
        </div>

        <!-- Mobile Menu with Animation -->
        <div *ngIf="mobileMenuOpen" class="md:hidden pb-4 space-y-2 animate-fade-in">
          <a routerLink="/submit-deal" (click)="mobileMenuOpen = false" class="block btn-glass px-4 py-3 text-center">
            ✨ Submit Deal
          </a>
          <a routerLink="/favorites" *ngIf="authService.currentUser()" (click)="mobileMenuOpen = false" class="block btn-glass px-4 py-3 text-center">
            ❤️ Favorites
          </a>
          <a routerLink="/profile" *ngIf="authService.currentUser()" (click)="mobileMenuOpen = false" class="block btn-glass px-4 py-3 text-center">
            👤 Profile
          </a>
          <button (click)="logout()" *ngIf="authService.currentUser()" class="block w-full btn-glass px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20">
            Logout
          </button>
          <a routerLink="/login" *ngIf="!authService.currentUser()" (click)="mobileMenuOpen = false" class="block btn-glass px-4 py-3 text-center bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
            Login
          </a>
          <a routerLink="/register" *ngIf="!authService.currentUser()" (click)="mobileMenuOpen = false" class="block btn-glass px-4 py-3 text-center bg-gradient-to-r from-pink-500/20 to-purple-500/20">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
    
    <!-- Spacer for fixed navbar -->
    <div class="h-20"></div>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = false;

  logout() {
    this.authService.logout();
    this.mobileMenuOpen = false;
  }
}
