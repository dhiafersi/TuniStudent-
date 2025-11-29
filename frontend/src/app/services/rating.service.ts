import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RatingService {
  api = 'http://localhost:8080/api/ratings';
  constructor(private http: HttpClient) {}
  rate(dealId: number, stars: number) { return this.http.post<any>(`${this.api}/${dealId}`, { stars }); }
  getSummary(dealId: number) { return this.http.get<{ average: number; count: number; userStars?: number }>(`${this.api}/summary/${dealId}`); }
}



