import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface Notification {
    id: number;
    message: string;
    type: string;
    read: boolean;
    createdAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/notifications`;

    notifications = signal<Notification[]>([]);
    unreadCount = signal<number>(0);

    constructor() {
        // Initial fetch if user is logged in (logic to be added in component or app init)
    }

    fetchNotifications() {
        this.http.get<Notification[]>(this.apiUrl).subscribe(notifs => {
            this.notifications.set(notifs);
            this.updateUnreadCount();
        });
    }

    markAsRead(id: number) {
        this.http.post(`${this.apiUrl}/${id}/read`, {}).subscribe(() => {
            this.notifications.update(notifs =>
                notifs.map(n => n.id === id ? { ...n, read: true } : n)
            );
            this.updateUnreadCount();
        });
    }

    markAllAsRead() {
        // Assuming backend supports this endpoint, otherwise we iterate
        this.notifications().forEach(n => {
            if (!n.read) this.markAsRead(n.id);
        });
    }

    private updateUnreadCount() {
        this.unreadCount.set(this.notifications().filter(n => !n.read).length);
    }
}
