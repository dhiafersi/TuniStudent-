import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-admin-reservation',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="space-y-6 animate-fade-in">
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">Reservation Management</h2>
          <div class="text-sm text-gray-400">
            Total: <span class="text-white font-bold">{{ reservations.length }}</span>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-white/5">
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">User ID</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Deal</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Details</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr *ngFor="let res of reservations" class="hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 text-gray-300">#{{ res.userId }}</td>
                <td class="px-6 py-4 text-white">
                  <div class="font-medium">{{ res.dealTitle }}</div>
                  <div class="text-xs text-blue-400 font-mono mt-1">{{ res.reservationCode }}</div>
                </td>
                <td class="px-6 py-4 text-gray-300 text-sm">
                  <div *ngIf="res.reservationDate">
                    <div class="text-white">{{ res.reservationDate | date:'medium' }}</div>
                    <div class="text-xs text-gray-400">Party: {{ res.partySize }}</div>
                    <div *ngIf="res.specialRequests" class="text-xs text-yellow-400 mt-1">
                      Note: {{ res.specialRequests }}
                    </div>
                  </div>
                  <div *ngIf="!res.reservationDate" class="text-gray-500 italic">
                    Promo Code Only
                  </div>
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
                <td class="px-6 py-4">
                  <div class="flex gap-2">
                    <button *ngIf="res.status === 'CONFIRMED'" 
                            (click)="updateStatus(res.id, 'USED')"
                            class="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                            title="Mark as Used">
                      <i class="fas fa-check-double"></i>
                    </button>
                    <button *ngIf="res.status !== 'CANCELLED'" 
                            (click)="updateStatus(res.id, 'CANCELLED')"
                            class="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Cancel">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminReservationComponent implements OnInit {
    reservations: any[] = [];

    constructor(private http: HttpClient) { }

    ngOnInit() {
        this.loadReservations();
    }

    loadReservations() {
        this.http.get<any[]>(`${environment.apiUrl}/reservations/all`).subscribe({
            next: (data) => this.reservations = data,
            error: (err) => console.error('Error loading reservations', err)
        });
    }

    updateStatus(id: number, status: string) {
        this.http.put(`${environment.apiUrl}/reservations/${id}/status`, { status }).subscribe({
            next: () => {
                this.loadReservations(); // Reload to show changes
            },
            error: (err) => console.error('Error updating status', err)
        });
    }
}
