import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { FavoriteService } from '../../services/favorite.service';
import { RatingService } from '../../services/rating.service';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { LoginPromptService } from '../../shared/login-prompt.service';
import { CommentSectionComponent } from '../../shared/components/comment-section.component';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-deal-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, CommentSectionComponent, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
    <div *ngIf="deal" class="glass p-4 md:p-6 animate-fade-in dark:bg-gray-900 dark:text-white">
      <div class="grid md:grid-cols-2 gap-6">
        <div class="overflow-hidden rounded-md animate-scale-in relative group">
          <img 
            [src]="getImageUrl()" 
            (error)="onImgError($event)" 
            class="w-full h-64 md:h-72 object-contain bg-black/30 hover:scale-110 transition-transform duration-500" 
          />
          <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button (click)="shareDeal()" class="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="animate-slide-in">
          <h1 class="text-2xl md:text-3xl font-bold mb-2 neon dark:text-blue-400">{{ deal.title }}</h1>
          <p class="opacity-80 mb-4 text-sm md:text-base dark:text-gray-300">{{ deal.description }}</p>
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <span class="text-green-500 dark:text-green-400 font-bold text-xl md:text-2xl">-{{ deal.discount }}%</span>
            <span class="opacity-80 text-sm md:text-base dark:text-gray-400">{{ deal.city?.name }} • {{ deal.category?.name }}</span>
          </div>

          <div class="flex items-center gap-2 mb-1">
            <div class="flex items-center gap-1">
              <span *ngFor="let s of [1,2,3,4,5]" [class]="s <= displayStars ? 'text-yellow-400' : 'opacity-40 text-gray-400'">★</span>
            </div>
            <span class="text-sm opacity-80 dark:text-gray-300" *ngIf="ratingLoaded; else ratingLoading">
              {{ (ratingsCount > 0) ? (average.toFixed(1) + ' (' + ratingsCount + ' ratings)') : 'No ratings yet' }}
            </span>
            <ng-template #ratingLoading>
              <span class="text-sm opacity-60 dark:text-gray-500">Loading rating…</span>
            </ng-template>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4 mt-6">
            <button 
              (click)="openBookingModal()" 
              [disabled]="bookingLoading"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span *ngIf="bookingLoading" class="animate-spin">⟳</span>
              <span>{{ bookingLoading ? 'Processing...' : (isFoodDeal ? 'Reserve Table' : 'Get Promo Code') }}</span>
            </button>

            <button 
              (click)="toggleFavorite()" 
              [class]="isFavorited ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900 dark:text-green-300 dark:border-green-700' : 'bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'" 
              [disabled]="favoriteLoading"
              class="border font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <span *ngIf="favoriteLoading" class="animate-spin">⟳</span>
              <span *ngIf="!favoriteLoading">{{ isFavorited ? '✓ Saved' : '☆ Save' }}</span>
            </button>
          </div>
          
          <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-blue-800">
            <h4 class="font-semibold text-blue-800 dark:text-blue-300 mb-1">Rate this deal:</h4>
            <div class="flex items-center gap-1">
              <button 
                *ngFor="let s of [1,2,3,4,5]" 
                (click)="rate(s)" 
                [class]="s <= myStars ? 'text-yellow-400 hover:text-yellow-300' : 'text-gray-300 hover:text-yellow-200 dark:text-gray-600'"
                class="text-2xl transition-colors focus:outline-none"
              >
                ★
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="deal.location" class="mt-8 animate-fade-in animate-delay-300">
        <h3 class="text-lg md:text-xl mb-3 font-semibold dark:text-white">📍 Location</h3>
        <div class="rounded-lg overflow-hidden shadow-md border border-gray-200 dark:border-gray-700">
          <iframe
            [src]="mapUrl"
            width="100%"
            height="300"
            style="border:0;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="w-full grayscale hover:grayscale-0 transition-all duration-500">
          </iframe>
        </div>
      </div>

      <!-- Comments Section -->
      <app-comment-section [dealId]="deal.id"></app-comment-section>
    </div>
    
    <!-- Reservation Modal -->
    <div *ngIf="showReservationModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in border border-white/10">
        <div class="p-6">
          <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ isFoodDeal ? 'Reserve a Table' : 'Get Promo Code' }}
          </h3>
          
          <div *ngIf="isFoodDeal" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date & Time</label>
              <input type="datetime-local" [(ngModel)]="reservationForm.date" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Party Size</label>
              <input type="number" min="1" max="20" [(ngModel)]="reservationForm.partySize" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Special Requests</label>
              <textarea [(ngModel)]="reservationForm.specialRequests" rows="3" placeholder="Allergies, preferences, etc." class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
            </div>
          </div>
          
          <div *ngIf="!isFoodDeal" class="text-gray-600 dark:text-gray-400 mb-6">
            <p>Generate a unique promo code for <strong>{{ deal.title }}</strong>.</p>
            <p class="mt-2 text-sm">This code can be used at the location to claim your discount.</p>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button (click)="showReservationModal = false" class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
              Cancel
            </button>
            <button (click)="confirmBooking()" [disabled]="bookingLoading || (isFoodDeal && (!reservationForm.date || !reservationForm.partySize))" class="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-lg hover:shadow-blue-500/30 transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {{ bookingLoading ? 'Processing...' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DealDetailComponent implements OnInit, OnDestroy {
  deal: any;
  myStars = 0;
  average = 0;
  ratingsCount = 0;
  displayStars = 0;
  mapUrl?: SafeResourceUrl;
  ratingLoaded = false;
  isFavorited = false;
  favoriteLoading = false;
  bookingLoading = false;

  // Reservation Modal Logic
  showReservationModal = false;
  reservationForm = {
    date: '',
    partySize: 2,
    specialRequests: ''
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dealService: DealService,
    private favService: FavoriteService,
    private ratingService: RatingService,
    private auth: AuthService,
    private reservationService: ReservationService,
    private prompt: LoginPromptService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      const id = params['id'];
      this.dealService.get(id).subscribe(d => {
        this.deal = d;
        this.loadRatingSummary();
        this.updateMapUrl();
        this.checkFavoriteStatus();
      });
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event) => {
      const currentRoute = this.route.snapshot;
      if (event.url.includes(`/deal/${currentRoute.params['id']}`) && this.deal?.id && this.auth.isLoggedIn()) {
        setTimeout(() => {
          this.checkFavoriteStatus();
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isFoodDeal(): boolean {
    return this.deal?.category?.name === 'Food';
  }

  openBookingModal() {
    if (!this.auth.isLoggedIn()) {
      this.prompt.open({ message: 'Log in to book deals.', returnUrl: `/deal/${this.deal?.id}` });
      return;
    }
    this.showReservationModal = true;
  }

  confirmBooking() {
    this.bookingLoading = true;

    const reservationData: any = {
      dealId: this.deal.id,
      dealTitle: this.deal.title
    };

    if (this.isFoodDeal) {
      reservationData.reservationDate = this.reservationForm.date;
      reservationData.partySize = this.reservationForm.partySize;
      reservationData.specialRequests = this.reservationForm.specialRequests;
    }

    this.reservationService.createReservation(
      reservationData.dealId,
      reservationData.dealTitle,
      reservationData.reservationDate,
      reservationData.partySize,
      reservationData.specialRequests
    ).subscribe({
      next: (res) => {
        this.showReservationModal = false;
        this.bookingLoading = false;
        alert(`Success! Your code is: ${res.reservationCode}`);
      },
      error: (err) => {
        console.error(err);
        alert('Reservation failed. Please try again.');
        this.bookingLoading = false;
      }
    });
  }

  updateMapUrl() {
    if (!this.deal?.location) {
      this.mapUrl = undefined;
      return;
    }
    const url = `https://www.google.com/maps?q=${encodeURIComponent(this.deal.location)}&output=embed`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  loadRatingSummary() {
    if (!this.deal?.id) return;
    this.ratingLoaded = false;
    this.ratingService.getSummary(this.deal.id).subscribe({
      next: s => {
        this.average = s?.average ?? 0;
        this.ratingsCount = s?.count ?? 0;
        this.displayStars = Math.round(this.average || 0);

        if (s?.userStars !== null && s.userStars !== undefined && s.userStars > 0) {
          this.myStars = s.userStars;
        } else {
          this.myStars = 0;
        }
        this.ratingLoaded = true;
      },
      error: (err) => {
        console.error('Error loading rating summary:', err);
        if (this.average === 0 && this.ratingsCount === 0) {
          this.average = 0;
          this.ratingsCount = 0;
          this.displayStars = 0;
        }
        this.myStars = 0;
        this.ratingLoaded = true;
      }
    });
  }

  checkFavoriteStatus() {
    if (!this.auth.isLoggedIn() || !this.deal?.id) {
      this.isFavorited = false;
      return;
    }
    this.favService.list().subscribe({
      next: (favorites) => {
        this.isFavorited = favorites.some((f: any) => f.deal?.id === this.deal.id);
      },
      error: () => {
        this.isFavorited = false;
      }
    });
  }

  toggleFavorite() {
    if (!this.auth.isLoggedIn()) {
      this.prompt.open({ message: 'Log in to add favorites.', returnUrl: `/deal/${this.deal?.id}` });
      return;
    }

    if (this.favoriteLoading || !this.deal?.id) return;

    this.favoriteLoading = true;
    const wasFavorited = this.isFavorited;

    this.isFavorited = !this.isFavorited;

    const request = wasFavorited
      ? this.favService.remove(this.deal.id)
      : this.favService.add(this.deal.id);

    request.subscribe({
      next: () => {
        this.favoriteLoading = false;
      },
      error: (err) => {
        console.error('Favorite toggle error:', err);
        this.isFavorited = wasFavorited;
        this.favoriteLoading = false;

        if (err.status === 401) {
          setTimeout(() => this.checkFavoriteStatus(), 500);
        } else {
          this.checkFavoriteStatus();
        }
      }
    });
  }

  rate(stars: number) {
    if (!this.auth.isLoggedIn()) {
      this.prompt.open({ message: 'Log in to rate deals.', returnUrl: `/deal/${this.deal?.id}` });
      return;
    }
    this.myStars = stars;
    this.ratingService.rate(this.deal.id, stars).subscribe({
      next: () => this.loadRatingSummary(),
      error: () => this.loadRatingSummary()
    });
  }

  shareDeal() {
    if (navigator.share) {
      navigator.share({
        title: this.deal.title,
        text: `Check out this deal on TuniStudent: ${this.deal.title} - ${this.deal.discount}% OFF!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }

  getImageUrl(): string {
    if (!this.deal?.imageUrl) {
      return 'https://picsum.photos/seed/placeholder/1200/800';
    }
    if (this.deal.imageUrl.startsWith('/assets/') || this.deal.imageUrl.startsWith('assets/')) {
      return this.deal.imageUrl;
    }
    if (this.deal.imageUrl.startsWith('http://') || this.deal.imageUrl.startsWith('https://')) {
      return this.deal.imageUrl;
    }
    return 'https://picsum.photos/seed/placeholder/1200/800';
  }

  onImgError(e: Event) {
    const img = e.target as HTMLImageElement;
    const originalSrc = this.deal?.imageUrl || '';
    const isLocalAsset = originalSrc.includes('/assets/') || originalSrc.includes('assets/');
    if (!isLocalAsset && !img.src.includes('/assets/')) {
      img.src = 'https://picsum.photos/seed/placeholder/1200/800';
    }
  }
}
