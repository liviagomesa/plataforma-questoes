import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../core/services/question.service';
import { QuestionType } from '../../core/models/question.model';
import { MultipleChoiceFormComponent } from './form-types/multiple-choice-form.component';
import { MultipleCorrectFormComponent } from './form-types/multiple-correct-form.component';
import { DiscursiveFormComponent } from './form-types/discursive-form.component';
import { SortingFormComponent } from './form-types/sorting-form.component';
import { MatchingFormComponent } from './form-types/matching-form.component';
import { TableFormComponent } from './form-types/table-form.component';

@Component({
  selector: 'app-question-create',
  standalone: true,
  imports: [
    FormsModule, RouterLink,
    MultipleChoiceFormComponent, MultipleCorrectFormComponent, DiscursiveFormComponent,
    SortingFormComponent, MatchingFormComponent, TableFormComponent
  ],
  templateUrl: './question-create.component.html',
  styles: [`
    .create-layout {
      max-width: 700px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }
    .type-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .type-btn {
      padding: 0.625rem 0.75rem;
      border: 2px solid var(--border);
      border-radius: var(--radius-sm);
      background: white;
      cursor: pointer;
      font-size: 0.8125rem;
      font-weight: 500;
      text-align: center;
      transition: all 0.15s;
      &:hover { border-color: var(--primary); color: var(--primary); }
      &.active {
        border-color: var(--primary);
        background: var(--primary-light);
        color: var(--primary-dark);
      }
    }
    .section-label {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .form-footer {
      display: flex;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .comment-section {
      margin-top: 1.5rem;
      padding: 1rem;
      background: #fefce8;
      border: 1px solid #fde68a;
      border-radius: var(--radius-sm);
    }
  `]
})
export class QuestionCreateComponent implements OnInit {
  id?: string;
  title = '';
  type: QuestionType = 'MULTIPLE_CHOICE';
  data: Record<string, unknown> = {};
  successComment = '';
  loaded = false;
  saving = false;
  pageTitle = 'Nova Questão';

  readonly types: { value: QuestionType; label: string }[] = [
    { value: 'MULTIPLE_CHOICE', label: 'Múltipla Escolha' },
    { value: 'MULTIPLE_CORRECT', label: 'Múltipla Correta' },
    { value: 'DISCURSIVE', label: 'Discursiva' },
    { value: 'SORTING', label: 'Ordenação' },
    { value: 'MATCHING', label: 'Associação' },
    { value: 'TABLE', label: 'Tabela' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.pageTitle = 'Editar Questão';
      this.questionService.getById(this.id).subscribe(q => {
        this.title = q.title;
        this.type = q.type;
        this.data = q.data as unknown as Record<string, unknown>;
        this.successComment = (this.data['successComment'] as string) ?? '';
        this.loaded = true;
      });
    } else {
      this.loaded = true;
    }
  }

  onTypeChange(newType: QuestionType): void {
    this.type = newType;
    this.data = {};
  }

  onDataChange(data: Record<string, unknown>): void {
    this.data = data;
  }

  save(): void {
    if (!this.title.trim()) { alert('Informe o enunciado da questão.'); return; }
    this.saving = true;
    const data: Record<string, unknown> = { ...this.data };
    if (this.successComment.trim()) {
      data['successComment'] = this.successComment.trim();
    } else {
      delete data['successComment'];
    }
    const req = { title: this.title, type: this.type, data };
    const obs = this.id
      ? this.questionService.update(this.id, req)
      : this.questionService.create(req);

    obs.subscribe({
      next: () => this.router.navigate(['/questions']),
      error: () => { this.saving = false; alert('Erro ao salvar questão.'); }
    });
  }
}
