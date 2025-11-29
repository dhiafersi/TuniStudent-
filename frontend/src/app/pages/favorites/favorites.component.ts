import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
    <h2 class="text-2xl mb-4">My Favorites</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <a *ngFor="let f of favorites" [routerLink]="['/deal', f.deal.id]" class="glass p-3 block">
        <img [src]="f.deal.imageUrl" class="w-full h-40 object-cover rounded-md mb-3" />
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-semibold">{{ f.deal.title }}</h3>
            <p class="opacity-70 text-sm">{{ f.deal.city?.name }} • {{ f.deal.category?.name }}</p>
          </div>
          <span class="text-green-300">-{{ f.deal.discount }}%</span>
        </div>
      </a>
    </div>
  `
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  constructor(private favoriteService: FavoriteService) { }
  ngOnInit(): void {
    this.favoriteService.list().subscribe(f => this.favorites = f);
  }
}


