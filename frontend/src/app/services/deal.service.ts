import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DealService {
  api = 'http://localhost:8080/api/deals';
  constructor(private http: HttpClient) { }
  list(query: any) {
    let params = new HttpParams();
    Object.keys(query || {}).forEach(k => {
      const value = query[k];
      if (value !== null && value !== undefined && value !== '') {
        params = params.set(k, value);
      }
    });
    return this.http.get<any>(this.api, { params });
  }
  getTrending() {
    return this.http.get<any[]>(`${this.api}/trending`);
  }
  get(id: number) { return this.http.get<any>(`${this.api}/${id}`); }
  create(deal: any) { return this.http.post<any>(this.api, deal); }
  update(id: number, deal: any) { return this.http.put<any>(`${this.api}/${id}`, deal); }
  delete(id: number) { return this.http.delete(`${this.api}/${id}`); }

  // Client submission
  submit(deal: any) { return this.http.post<any>(`${this.api}/submit`, deal); }

  // Admin only
  getPending(query?: any) {
    let params = new HttpParams();
    if (query) {
      Object.keys(query).forEach(k => {
        const value = query[k];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(k, value);
        }
      });
    }
    return this.http.get<any>(`${this.api}/pending`, { params });
  }
  approve(id: number) { return this.http.post<{ id: number, status: string, message: string }>(`${this.api}/${id}/approve`, {}); }
  reject(id: number) { return this.http.post<{ id: number, status: string, message: string }>(`${this.api}/${id}/reject`, {}); }
}


