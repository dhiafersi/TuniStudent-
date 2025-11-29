import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DealService } from '../../services/deal.service';

@Component({
  selector: 'app-trending-deals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="mb-12">
      <div class="flex items-center gap-2 mb-6">
        <span class="text-2xl">🔥</span>
        <h2 class="text-2xl font-bold dark:text-white">Trending Now</h2>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let deal of trendingDeals()" class="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <!-- Image -->
          <div class="h-48 overflow-hidden relative">
            <img [src]="getImageUrl(deal)" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="{{ deal.title }}">
            <div class="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              -{{ deal.discount }}%
            </div>
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 class="text-white font-bold text-lg truncate">{{ deal.title }}</h3>
            </div>
          </div>
          
          <!-- Content -->
          <div class="p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ deal.city?.name }}
              </span>
              <div class="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                <span>★</span>
                <span>{{ deal.rating || 'New' }}</span>
              </div>
            </div>
            
            <a [routerLink]="['/deal', deal.id]" class="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">
              View Deal
            </a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TrendingDealsComponent {
  dealService = inject(DealService);
  trendingDeals = signal<any[]>([]);

  constructor() {
    this.dealService.getTrending().subscribe((response: any) => {
      // Handle both Page object (response.content) and direct array
      const deals = response.content || response;
      if (Array.isArray(deals)) {
        this.trendingDeals.set(deals.slice(0, 3));
      }
    });
  }

  getImageUrl(deal: any): string {
    if (!deal?.imageUrl) {
      return 'https://picsum.photos/seed/placeholder/800/600';
    }
    if (deal.imageUrl.startsWith('/assets/') || deal.imageUrl.startsWith('assets/')) {
      return deal.imageUrl;
    }
    if (deal.imageUrl.startsWith('http://') || deal.imageUrl.startsWith('https://')) {
      return deal.imageUrl;
    }
    return 'https://picsum.photos/seed/placeholder/800/600';
  }
}
