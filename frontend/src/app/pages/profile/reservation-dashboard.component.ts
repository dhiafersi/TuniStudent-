import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-reservation-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 class="text-gray-400 text-sm font-medium mb-2">Total Reservations</h3>
          <p class="text-3xl font-bold text-white">{{ stats?.total || 0 }}</p>
        </div>
        
        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 class="text-gray-400 text-sm font-medium mb-2">Confirmed</h3>
          <p class="text-3xl font-bold text-green-400">{{ stats?.confirmed || 0 }}</p>
        </div>
        
        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-gradient-to-br from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <h3 class="text-gray-400 text-sm font-medium mb-2">Cancelled</h3>
          <p class="text-3xl font-bold text-red-400">{{ stats?.cancelled || 0 }}</p>
        </div>
      </div>

      <!-- Reservations Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-white/5">
          <h2 class="text-xl font-bold text-white">My Reservations</h2>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-white/5">
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Deal</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Code</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let res of reservations" class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 text-white">{{ res.dealTitle }}</td>
                <td class="px-6 py-4 font-mono text-blue-400">{{ res.reservationCode }}</td>
                <td class="px-6 py-4 text-gray-300">
                  {{ res.reservationDate ? (res.reservationDate | date:'medium') : (res.createdAt | date:'mediumDate') }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 rounded-full text-xs font-medium"
                    [ngClass]="{
                      'bg-green-500/20 text-green-400': res.status === 'CONFIRMED',
                      'bg-red-500/20 text-red-400': res.status === 'CANCELLED',
                      'bg-blue-500/20 text-blue-400': res.status === 'USED'
                    }">
                    {{ res.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-400 text-sm">
                  {{ res.reservationDate ? 'Table Reservation' : 'Promo Code' }}
                </td>
              </tr>
              <tr *ngIf="reservations.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                  No reservations found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class ReservationDashboardComponent implements OnInit {
    reservations: any[] = [];
    stats: any = {};

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.http.get<any[]>(`${environment.apiUrl}/reservations`).subscribe({
            next: (data) => this.reservations = data,
            error: (err) => console.error('Error loading reservations', err)
        });

        this.http.get<any>(`${environment.apiUrl}/reservations/stats`).subscribe({
            next: (data) => this.stats = data,
            error: (err) => console.error('Error loading stats', err)
        });
    }
}
