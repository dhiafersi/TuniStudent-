import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Reservation {
    id: number;
    reservationCode: string;
    status: string;
    createdAt: string;
    dealTitle: string;
    reservationDate?: string;
    partySize?: number;
    specialRequests?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reservations`;

    createReservation(dealId: number, dealTitle: string, reservationDate?: string, partySize?: number, specialRequests?: string) {
        return this.http.post<Reservation>(this.apiUrl, {
            dealId,
            dealTitle,
            reservationDate,
            partySize,
            specialRequests
        });
    }

    getMyReservations() {
        return this.http.get<Reservation[]>(this.apiUrl);
    }

    getStats() {
        return this.http.get<any>(`${this.apiUrl}/stats`);
    }

    // Admin methods
    getAllReservations() {
        return this.http.get<Reservation[]>(`${this.apiUrl}/all`);
    }

    updateStatus(id: number, status: string) {
        return this.http.put<Reservation>(`${this.apiUrl}/${id}/status`, { status });
    }
}
