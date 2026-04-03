import { Component, Input, OnInit } from '@angular/core';
import { MultipleCorrectData, Option } from '../../../core/models/question.model';
import { shuffle } from '../../../core/utils/shuffle';
import { AnswerResult } from '../question-answer.component';

@Component({
  selector: 'app-multiple-correct-answer',
  standalone: true,
  imports: [],
  template: `
    <p class="text-muted mb-4">Selecione todas as alternativas corretas.</p>
    <div class="options-list">
      @for (opt of shuffledOptions; track opt.id) {
        <label class="option-label" [class.selected]="selectedIds.has(opt.id)">
          <input type="checkbox"
                 [checked]="selectedIds.has(opt.id)"
                 (change)="toggle(opt.id, $event)" />
          <span>{{ opt.text }}</span>
        </label>
      }
    </div>
  `,
  styles: [`
    .options-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .option-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border: 1.5px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      font-size: 0.9375rem;
      &:hover { border-color: var(--primary); background: var(--primary-light); }
      &.selected { border-color: var(--primary); background: var(--primary-light); }
    }
    input[type="checkbox"] { width: auto; flex-shrink: 0; }
  `]
})
export class MultipleCorrectAnswerComponent implements OnInit {
  @Input() data!: unknown;

  shuffledOptions: Option[] = [];
  selectedIds = new Set<string>();

  get typedData(): MultipleCorrectData {
    return this.data as MultipleCorrectData;
  }

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    this.shuffledOptions = shuffle(this.typedData.options);
    this.selectedIds = new Set();
  }

  toggle(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const next = new Set(this.selectedIds);
    checked ? next.add(id) : next.delete(id);
    this.selectedIds = next;
  }

  verify(): AnswerResult {
    const correct = new Set(this.typedData.correctIds);
    const isCorrect = correct.size === this.selectedIds.size &&
      [...correct].every(id => this.selectedIds.has(id));
    return { correct: isCorrect };
  }
}
