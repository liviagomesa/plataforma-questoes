import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { QuestionService } from '../../core/services/question.service';
import { Question, TYPE_LABELS } from '../../core/models/question.model';
import { MultipleChoiceAnswerComponent } from './answer-types/multiple-choice-answer.component';
import { MultipleCorrectAnswerComponent } from './answer-types/multiple-correct-answer.component';
import { DiscursiveAnswerComponent } from './answer-types/discursive-answer.component';
import { SortingAnswerComponent } from './answer-types/sorting-answer.component';
import { MatchingAnswerComponent } from './answer-types/matching-answer.component';
import { TableAnswerComponent } from './answer-types/table-answer.component';

export interface AnswerResult {
  correct: boolean | null;
  revealedAnswer?: string;
}

@Component({
  selector: 'app-question-answer',
  standalone: true,
  imports: [
    RouterLink,
    MultipleChoiceAnswerComponent, MultipleCorrectAnswerComponent, DiscursiveAnswerComponent,
    SortingAnswerComponent, MatchingAnswerComponent, TableAnswerComponent
  ],
  templateUrl: './question-answer.component.html',
  styles: [`
    .answer-layout { max-width: 800px; margin: 0 auto; padding: 0 1.5rem; }
    .question-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--border);
    }
    .question-title {
      font-size: 1.125rem;
      font-weight: 600;
      line-height: 1.5;
      margin-top: 0.5rem;
    }
    .answer-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    .loading { text-align: center; padding: 3rem; color: var(--text-muted); }
    :host ::ng-deep .feedback--comment {
      margin-top: 0.5rem;
      background: #fefce8;
      border-color: #fde68a;
      color: #713f12;
    }
  `]
})
export class QuestionAnswerComponent implements OnInit {
  question?: Question;
  result?: AnswerResult;
  loading = true;
  readonly typeLabels = TYPE_LABELS;

  @ViewChild(MultipleChoiceAnswerComponent) mcAnswer?: MultipleChoiceAnswerComponent;
  @ViewChild(MultipleCorrectAnswerComponent) mcCorrectAnswer?: MultipleCorrectAnswerComponent;
  @ViewChild(DiscursiveAnswerComponent) discAnswer?: DiscursiveAnswerComponent;
  @ViewChild(SortingAnswerComponent) sortAnswer?: SortingAnswerComponent;
  @ViewChild(MatchingAnswerComponent) matchAnswer?: MatchingAnswerComponent;
  @ViewChild(TableAnswerComponent) tableAnswer?: TableAnswerComponent;

  constructor(
    private route: ActivatedRoute,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.questionService.getById(id).subscribe({
      next: (q) => { this.question = q; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  verify(): void {
    if (!this.question) return;
    const child = this.mcAnswer ?? this.mcCorrectAnswer ?? this.discAnswer ?? this.sortAnswer
      ?? this.matchAnswer ?? this.tableAnswer;
    if (child) {
      this.result = child.verify();
    }
  }

  reset(): void {
    this.result = undefined;
    const child = this.mcAnswer ?? this.mcCorrectAnswer ?? this.discAnswer ?? this.sortAnswer
      ?? this.matchAnswer ?? this.tableAnswer;
    (child as { reset?: () => void })?.reset?.();
  }

  get successComment(): string {
    return (this.question?.data as unknown as Record<string, unknown>)?.['successComment'] as string ?? '';
  }

  typeCss(type: string): string {
    return type.toLowerCase();
  }
}
