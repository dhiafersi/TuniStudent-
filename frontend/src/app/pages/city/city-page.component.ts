import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

@Component({
  selector: 'app-city-page',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
    <h2 class="text-3xl font-black mb-6"><span class="gradient-text">{{ cityName }}</span></h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a *ngFor="let d of deals" [routerLink]="['/deal', d.id]" class="glass p-3 block">
        <img [src]="getImageUrl(d)" (error)="onImgError($event)" class="w-full h-40 object-contain rounded-md mb-3 bg-black/30" />
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold">{{ d.title }}</h3>
            <p class="opacity-70 text-sm">{{ d.category?.name }}</p>
          </div>
          <span class="text-green-300">-{{ d.discount }}%</span>
        </div>
      </a>
    </div>
    </div>
    <app-footer></app-footer>
    <app-chatbox></app-chatbox>
  `
})
export class CityPageComponent implements OnInit {
  cityName = '';
  deals: any[] = [];
  constructor(private route: ActivatedRoute, private dealService: DealService) { }
  ngOnInit(): void {
    this.cityName = this.route.snapshot.params['name'];
    this.dealService.list({ city: this.cityName }).subscribe(p => this.deals = p.content);
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


