import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CityService } from '../../services/city.service';
import { DealService } from '../../services/deal.service';
import { CategoryService } from '../../services/category.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
    
    <!-- Hero Section -->
    <section class="mb-12 text-center animate-fade-in">
      <div class="glass p-8 md:p-16 relative overflow-hidden">
        <!-- Decorative Gradient Orbs -->
        <div class="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-pink-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
        
        <div class="relative z-10">
          <h1 class="text-4xl md:text-7xl font-black mb-4 animate-scale-in">
            <span class="gradient-text">Discover</span> Student Deals
          </h1>
          <p class="text-lg md:text-2xl opacity-90 mb-8 animate-slide-in-up">
            ✨ Across Tunisia's 24 cities ✨
          </p>
          
          <!-- Search Bar -->
          <div class="max-w-4xl mx-auto space-y-4 animate-slide-in-up">
            <div class="flex flex-col md:flex-row gap-3 items-stretch">
              <div class="relative flex-1">
                <input 
                  [(ngModel)]="query" 
                  (input)="onSearchInput()"
                  (keyup.enter)="search()" 
                  (focus)="onSearchFocus()"
                  (blur)="onSearchBlur()"
                  placeholder="🔍  Search amazing deals..." 
                  class="glass px-6 py-4 w-full text-lg rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all" 
                />
                <button 
                  *ngIf="query" 
                  (click)="clearSearch()" 
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition text-2xl"
                  type="button"
                >
                  ✕
                </button>
                
                <!-- Autocomplete Suggestions -->
                <div 
                  *ngIf="showSuggestions && suggestions.length > 0" 
                  class="absolute z-20 w-full mt-2 glass rounded-2xl shadow-2xl max-h-64 overflow-y-auto animate-scale-in"
                >
                  <div 
                    *ngFor="let suggestion of suggestions" 
                    (mousedown)="selectSuggestion(suggestion)"
                    class="px-6 py-3 hover:bg-white/20 cursor-pointer transition border-b border-white/10 last:border-0"
                  >
                    <div class="font-semibold">{{ suggestion.name }}</div>
                    <div class="text-xs opacity-70">{{ suggestion.type }}</div>
                  </div>
                </div>
              </div>
              
              <select [(ngModel)]="selectedCity" (change)="onFilterChange()" class="glass px-6 py-4 rounded-2xl text-base md:w-48 focus:ring-2 focus:ring-purple-500">
                <option value="">📍 All Cities</option>
                <option *ngFor="let c of cities" [value]="c.name">{{ c.name }}</option>
              </select>
              
              <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" class="glass px-6 py-4 rounded-2xl text-base md:w-48 focus:ring-2 focus:ring-purple-500">
                <option value="">🏷️ All Categories</option>
                <option *ngFor="let cat of categories" [value]="cat.name">{{ cat.name }}</option>
              </select>
              
              <button (click)="search()" [disabled]="isLoading" class="btn-glass px-8 py-4 text-lg font-bold bg-gradient-to-r from-indigo-500/30 to-purple-500/30 hover:from-indigo-500/50 hover:to-purple-500/50 rounded-2xl" [class.opacity-50]="isLoading">
                <span *ngIf="isLoading" class="animate-spin inline-block">⟳</span>
                <span *ngIf="!isLoading">Search</span>
              </button>
            </div>
            
            <div *ngIf="hasSearchResults" class="text-sm opacity-70 badge inline-block">
              Found {{ deals.length }} amazing deal{{ deals.length !== 1 ? 's' : '' }}! 🎉
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cities Grid -->
    <section class="mb-12 animate-fade-in">
      <h2 class="text-3xl font-black mb-6">
        <span class="gradient-text">Explore Cities</span>
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <a *ngFor="let c of cities; let i = index" 
           [routerLink]="['/city', c.name]" 
           class="glass p-6 text-center stagger-item card-hover group rounded-2xl">
          <div class="text-3xl mb-2 group-hover:scale-125 transition-transform">📍</div>
          <div class="font-bold">{{ c.name }}</div>
        </a>
      </div>
    </section>

    <!-- Deals Section -->
    <section class="animate-fade-in">
      <h2 class="text-3xl font-black mb-6">
        <span class="gradient-text">{{ hasSearchResults ? 'Search Results' : 'Featured Deals' }}</span>
      </h2>
      
      <!-- Loading State -->
      <div *ngIf="isLoading" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="glass p-6 shimmer rounded-2xl">
          <div class="w-full h-48 bg-black/30 rounded-xl mb-4"></div>
          <div class="h-5 bg-white/20 rounded-lg mb-3"></div>
          <div class="h-4 bg-white/10 rounded-lg w-2/3"></div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div *ngIf="!isLoading && deals.length === 0 && hasSearchResults" class="text-center py-16 glass rounded-2xl">
        <div class="text-6xl mb-4">🔍</div>
        <p class="text-2xl font-bold mb-2 opacity-90">No deals found</p>
        <p class="text-base opacity-70 mb-6">Try adjusting your search terms, filters, or browse featured deals</p>
        <button (click)="clearSearch()" class="btn-glass bg-gradient-to-r from-indigo-500/30 to-purple-500/30 px-8 py-4 text-lg font-bold">
          Clear Search
        </button>
      </div>
      
      <!-- Results Grid with Modern Cards -->
      <div *ngIf="!isLoading && deals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <a *ngFor="let d of deals; let i = index" 
           [routerLink]="['/deal', d.id]" 
           class="glass p-5 block stagger-item card-hover group rounded-2xl relative overflow-hidden">
          
          <!-- Discount Badge -->
          <div class="absolute top-4 right-4 z-10">
            <div class="badge bg-gradient-to-r from-green-500/90 to-emerald-500/90 px-4 py-2 text-lg font-black shadow-lg">
              -{{ d.discount }}%
            </div>
          </div>
          
          <!-- Image -->
          <div class="overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <img [src]="getImageUrl(d)" 
                 (error)="onImgError($event)" 
                 alt="{{ d.title }}" 
                 class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          
          <!-- Content -->
          <div class="space-y-2">
            <h3 class="font-black text-xl line-clamp-2 group-hover:text-purple-300 transition-colors">
              {{ d.title }}
            </h3>
            <div class="flex items-center gap-2 text-sm opacity-70">
              <span class="badge text-xs">📍 {{ d.city?.name }}</span>
              <span class="badge text-xs">🏷️ {{ d.category?.name }}</span>
            </div>
          </div>
          
          <!-- Hover Arrow -->
          <div class="absolute bottom-4 right-4 text-2xl opacity-0 group-hover:opacity-100 transition-opacity">
            →
          </div>
        </a>
      </div>
    </section>
    </div>
    <app-footer></app-footer>
    <app-chatbox></app-chatbox>
  `
})
export class HomePageComponent implements OnInit, OnDestroy {
  cities: any[] = [];
  categories: any[] = [];
  deals: any[] = [];
  query = '';
  selectedCity = '';
  selectedCategory = '';
  hasSearchResults = false;
  isLoading = false;
  showSuggestions = false;
  suggestions: any[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private cityService: CityService,
    private dealService: DealService,
    private categoryService: CategoryService
  ) {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(query => {
      if (query && query.trim().length >= 2) {
        this.performSearch();
      } else if (!query || query.trim().length === 0) {
        this.resetToFeatured();
      }
    });
  }

  ngOnInit(): void {
    this.cityService.getAll().subscribe(c => this.cities = c);
    this.categoryService.getAll().subscribe(c => {
      this.categories = c;
      this.updateSuggestions();
    });
    this.dealService.list({ featured: true, size: 6 }).subscribe(p => this.deals = p.content);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInput() {
    this.updateSuggestions();
    this.searchSubject.next(this.query);
  }

  onSearchFocus() {
    this.showSuggestions = true;
  }

  onSearchBlur() {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  onFilterChange() {
    this.performSearch();
  }

  updateSuggestions() {
    if (!this.query || this.query.trim().length < 2) {
      this.suggestions = [];
      return;
    }

    const queryLower = this.query.toLowerCase().trim();
    const suggestions: any[] = [];

    // Add matching categories
    this.categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(queryLower)) {
        suggestions.push({ name: cat.name, type: 'Category', value: cat.name });
      }
    });

    // Add matching cities
    this.cities.forEach(city => {
      if (city.name.toLowerCase().includes(queryLower)) {
        suggestions.push({ name: city.name, type: 'City', value: city.name });
      }
    });

    // Limit suggestions
    this.suggestions = suggestions.slice(0, 5);
  }

  selectSuggestion(suggestion: any) {
    if (suggestion.type === 'Category') {
      this.selectedCategory = suggestion.value;
      this.query = '';
    } else if (suggestion.type === 'City') {
      this.selectedCity = suggestion.value;
      this.query = '';
    }
    this.showSuggestions = false;
    this.performSearch();
  }

  clearSearch() {
    this.query = '';
    this.selectedCategory = '';
    this.selectedCity = '';
    this.suggestions = [];
    this.resetToFeatured();
  }

  search() {
    this.performSearch();
  }

  private performSearch() {
    const params: any = { size: 20 };

    if (this.query && this.query.trim()) {
      params.q = this.query.trim();
    }
    if (this.selectedCity && this.selectedCity.trim()) {
      params.city = this.selectedCity.trim();
    }
    if (this.selectedCategory && this.selectedCategory.trim()) {
      params.category = this.selectedCategory.trim();
    }

    // If no filters, show featured deals
    if (!params.q && !params.city && !params.category) {
      this.resetToFeatured();
      return;
    }

    this.isLoading = true;
    this.hasSearchResults = true;

    this.dealService.list(params).subscribe({
      next: p => {
        this.deals = p.content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.deals = [];
      }
    });
  }

  private resetToFeatured() {
    this.hasSearchResults = false;
    this.isLoading = true;
    this.dealService.list({ featured: true, size: 6 }).subscribe({
      next: p => {
        this.deals = p.content;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  getImageUrl(deal: any): string {
    if (!deal?.imageUrl) {
      return 'https://picsum.photos/seed/placeholder/800/600';
    }
    // If it's a local asset path, return it as-is
    if (deal.imageUrl.startsWith('/assets/') || deal.imageUrl.startsWith('assets/')) {
      return deal.imageUrl;
    }
    // If it's an external URL, return it
    if (deal.imageUrl.startsWith('http://') || deal.imageUrl.startsWith('https://')) {
      return deal.imageUrl;
    }
    // Default to placeholder
    return 'https://picsum.photos/seed/placeholder/800/600';
  }
  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    // Only replace with placeholder if it's not a local asset path
    if (!img.src.includes('/assets/') && !img.src.includes('assets/')) {
      img.src = 'https://picsum.photos/seed/placeholder/800/600';
    }
  }
}


