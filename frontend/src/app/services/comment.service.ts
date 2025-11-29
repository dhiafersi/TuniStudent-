import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommentService {
    private apiUrl = 'http://localhost:8080/api/comments';

    constructor(private http: HttpClient) { }

    getCommentsForDeal(dealId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/deal/${dealId}`);
    }

    addComment(dealId: number, content: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/deal/${dealId}`, { content });
    }

    updateComment(commentId: number, content: string): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${commentId}`, { content });
    }

    deleteComment(commentId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${commentId}`);
    }

    getAllComments(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`);
    }
}
