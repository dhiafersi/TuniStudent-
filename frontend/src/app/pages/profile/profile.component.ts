import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { FavoriteService } from '../../services/favorite.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

import { ReservationDashboardComponent } from './reservation-dashboard.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ChatboxComponent, ReservationDashboardComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
    <div class="max-w-6xl mx-auto p-4 md:p-8 animate-fade-in">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl mb-8">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-white/30">
            {{ authService.currentUser()?.username?.charAt(0).toUpperCase() }}
          </div>
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-bold mb-2">{{ authService.currentUser()?.username }}</h1>
            <p class="opacity-80">{{ authService.currentUser()?.email }}</p>
            <div class="mt-4 flex gap-4 justify-center md:justify-start">
              <div class="bg-white/10 px-4 py-2 rounded-lg text-center">
                <span class="block text-2xl font-bold">{{ reservations().length }}</span>
                <span class="text-xs opacity-80">Reservations</span>
              </div>
              <div class="bg-white/10 px-4 py-2 rounded-lg text-center">
                <span class="block text-2xl font-bold">{{ favorites().length }}</span>
                <span class="text-xs opacity-80">Favorites</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Reservations -->
        <div class="col-span-1 md:col-span-2">
          <app-reservation-dashboard></app-reservation-dashboard>
        </div>

        <!-- Favorites -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2 dark:text-white">
            <span>❤️</span> My Favorites
          </h2>
          <div class="space-y-4">
            <div *ngIf="favorites().length === 0" class="text-center py-8 text-gray-500 dark:text-gray-400">
              No favorites yet.
            </div>
            <div *ngFor="let fav of favorites()" class="flex gap-4 items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-100 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group">
              <img [src]="getImageUrl(fav.deal)" class="w-16 h-16 object-cover rounded-md" alt="Deal">
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-gray-800 dark:text-white truncate">{{ fav.deal?.title }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ fav.deal?.city?.name }} • -{{ fav.deal?.discount }}%</p>
              </div>
              <a [routerLink]="['/deal', fav.deal?.id]" class="opacity-0 group-hover:opacity-100 bg-blue-600 text-white p-2 rounded-full transition-all transform hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
  reservationService = inject(ReservationService);
  favoriteService = inject(FavoriteService);

  reservations = signal<any[]>([]);
  favorites = signal<any[]>([]);

  constructor() {
    this.loadData();
  }

  loadData() {
    this.reservationService.getMyReservations().subscribe(res => {
      this.reservations.set(res);
    });

    this.favoriteService.list().subscribe(favs => {
      this.favorites.set(favs);
    });
  }

  getImageUrl(deal: any): string {
    if (!deal?.imageUrl) {
      return 'https://picsum.photos/seed/placeholder/200/200';
    }
    if (deal.imageUrl.startsWith('/assets/') || deal.imageUrl.startsWith('assets/')) {
      return deal.imageUrl;
    }
    if (deal.imageUrl.startsWith('http://') || deal.imageUrl.startsWith('https://')) {
      return deal.imageUrl;
    }
    return 'https://picsum.photos/seed/placeholder/200/200';
  }
}
