import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultipleChoiceData, Option } from '../../../core/models/question.model';
import { shuffle } from '../../../core/utils/shuffle';
import { AnswerResult } from '../question-answer.component';

@Component({
  selector: 'app-multiple-choice-answer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="options-list">
      @for (opt of shuffledOptions; track opt.id) {
        <label class="option-label" [class.selected]="selectedId === opt.id">
          <input type="radio" name="mc" [value]="opt.id" [(ngModel)]="selectedId" />
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
    input[type="radio"] { width: auto; flex-shrink: 0; }
  `]
})
export class MultipleChoiceAnswerComponent implements OnInit {
  @Input() data!: unknown;

  shuffledOptions: Option[] = [];
  selectedId = '';

  get typedData(): MultipleChoiceData {
    return this.data as MultipleChoiceData;
  }

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    this.shuffledOptions = shuffle(this.typedData.options);
    this.selectedId = '';
  }

  verify(): AnswerResult {
    return { correct: this.selectedId === this.typedData.correctId };
  }
}
