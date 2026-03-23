import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

interface QuestionRequest {
  title: string;
  type: string;
  data: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class QuestionService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/questions';

  getAll(): Observable<Question[]> {
    return this.http.get<Question[]>(this.base);
  }

  getById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this.base}/${id}`);
  }

  create(req: QuestionRequest): Observable<Question> {
    return this.http.post<Question>(this.base, req);
  }

  update(id: string, req: QuestionRequest): Observable<Question> {
    return this.http.put<Question>(`${this.base}/${id}`, req);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
