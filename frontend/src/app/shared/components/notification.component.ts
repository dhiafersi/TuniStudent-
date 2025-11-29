import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative" *ngIf="authService.currentUser()">
      <button (click)="toggleDropdown()" class="btn-glass px-3 py-2.5 flex items-center gap-2 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span *ngIf="notificationService.unreadCount() > 0" class="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-black px-2 py-0.5 rounded-full shadow-lg animate-pulse">
          {{ notificationService.unreadCount() }}
        </span>
      </button>

      <!-- Modern Dropdown -->
      <div *ngIf="isOpen()" class="absolute right-0 mt-3 w-96 glass rounded-2xl shadow-2xl z-[10001] border border-white/20 overflow-hidden animate-scale-in">
        <!-- Header -->
        <div class="p-4 border-b border-white/10 bg-gradient-to-r from-indigo-500/20 to-purple-500/20">
          <div class="flex justify-between items-center">
            <h3 class="font-black text-lg gradient-text">🔔 Notifications</h3>
            <button (click)="refresh()" class="btn-glass px-3 py-1.5 text-xs font-semibold hover:scale-105 transition-transform">
              Refresh
            </button>
          </div>
        </div>

        <!-- Notifications List -->
        <div class="max-h-96 overflow-y-auto">
          <div *ngIf="notificationService.notifications().length === 0" class="p-8 text-center">
            <div class="text-5xl mb-3">📭</div>
            <p class="text-sm opacity-70">No notifications yet</p>
          </div>

          <div *ngFor="let notif of notificationService.notifications()" 
               class="p-4 border-b border-white/5 hover:bg-white/10 transition-all cursor-pointer group"
               [ngClass]="{'bg-gradient-to-r from-blue-500/10 to-purple-500/10': !notif.read}"
               (click)="markAsRead(notif)">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <span class="text-lg">{{notif.read ? '📩' : '✉️'}}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold mb-1 line-clamp-2">{{ notif.message }}</p>
                <span class="text-xs opacity-60">{{ notif.createdAt | date:'short' }}</span>
              </div>
              <div *ngIf="!notif.read" class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mt-1.5 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-center">
          <button (click)="markAllAsRead()" class="text-xs font-semibold opacity-70 hover:opacity-100 transition-opacity">
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  `
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  isOpen = signal(false);

  constructor() {
    // Fetch notifications if logged in
    if (this.authService.currentUser()) {
      this.notificationService.fetchNotifications();
    }
  }

  toggleDropdown() {
    this.isOpen.set(!this.isOpen());
  }

  refresh() {
    this.notificationService.fetchNotifications();
  }

  markAsRead(notif: any) {
    this.notificationService.markAsRead(notif.id);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
    this.isOpen.set(false);
  }
}
