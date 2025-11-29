import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AIService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/ai`;

    generateDescription(title: string, category: string) {
        return this.http.post<{ description: string }>(`${this.apiUrl}/generate-description`, { title, category });
    }
}
