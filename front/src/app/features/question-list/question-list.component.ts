import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { QuestionService } from '../../core/services/question.service';
import { Question, TYPE_LABELS } from '../../core/models/question.model';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './question-list.component.html',
  styles: [`
    .question-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .question-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: box-shadow 0.15s;
      &:hover { box-shadow: var(--shadow-md); }
    }
    .question-card__title {
      font-size: 0.9375rem;
      font-weight: 600;
      line-height: 1.4;
      flex: 1;
    }
    .question-card__meta {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .question-card__actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 0.25rem;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-muted);
      h2 { font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text); }
      p { margin-bottom: 1.5rem; }
    }
    .loading { text-align: center; padding: 3rem; color: var(--text-muted); }
  `]
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  loading = true;
  error = '';
  readonly typeLabels = TYPE_LABELS;

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.questionService.getAll().subscribe({
      next: (q) => { this.questions = q; this.loading = false; },
      error: () => { this.error = 'Erro ao carregar questões.'; this.loading = false; }
    });
  }

  delete(id: string): void {
    if (!confirm('Excluir esta questão permanentemente?')) return;
    this.questionService.delete(id).subscribe({ next: () => this.load() });
  }

  typeCss(type: string): string {
    return type.toLowerCase();
  }
}
