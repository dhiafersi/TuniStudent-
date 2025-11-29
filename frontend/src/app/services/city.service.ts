import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CityService {
  api = 'http://localhost:8080/api/cities';
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<any[]>(this.api); }
}


