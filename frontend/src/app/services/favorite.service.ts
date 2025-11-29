import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  api = 'http://localhost:8080/api/favorites';
  constructor(private http: HttpClient) {}
  // Note: Headers are handled by the auth interceptor, so we don't need to set them here
  list() { return this.http.get<any[]>(this.api); }
  add(dealId: number) { return this.http.post<any>(`${this.api}/${dealId}`, {}); }
  remove(dealId: number) { return this.http.delete<void>(`${this.api}/${dealId}`); }
}



