import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultipleChoiceData, Option } from '../../../core/models/question.model';

@Component({
  selector: 'app-multiple-choice-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="section-label">Alternativas</div>
    <p class="text-muted mb-4">Marque o rádio ao lado da alternativa correta.</p>

    @for (opt of options; track opt.id; let i = $index) {
      <div class="option-row">
        <input type="radio" [name]="'correct'" [value]="opt.id"
               [(ngModel)]="correctId" (ngModelChange)="emit()" />
        <input type="text" [(ngModel)]="opt.text" (ngModelChange)="emit()"
               [placeholder]="'Alternativa ' + (i + 1)" style="flex:1" />
        <button class="btn btn--danger btn--sm" (click)="remove(i)"
                [disabled]="options.length <= 2">✕</button>
      </div>
    }

    <button class="btn btn--secondary btn--sm mt-4" (click)="addOption()">
      + Adicionar alternativa
    </button>
  `,
  styles: [`
    .option-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    input[type="radio"] { width: auto; flex-shrink: 0; cursor: pointer; }
  `]
})
export class MultipleChoiceFormComponent implements OnInit {
  @Input() data: Record<string, unknown> = {};
  @Output() dataChange = new EventEmitter<Record<string, unknown>>();

  options: Option[] = [];
  correctId = '';

  ngOnInit(): void {
    const d = this.data as Partial<MultipleChoiceData>;
    if (d.options?.length) {
      this.options = d.options.map(o => ({ ...o }));
      this.correctId = d.correctId ?? '';
    } else {
      this.options = [this.newOption(), this.newOption()];
    }
  }

  addOption(): void {
    this.options.push(this.newOption());
    this.emit();
  }

  remove(i: number): void {
    if (this.options[i].id === this.correctId) this.correctId = '';
    this.options.splice(i, 1);
    this.emit();
  }

  emit(): void {
    this.dataChange.emit({ options: [...this.options], correctId: this.correctId });
  }

  private newOption(): Option {
    return { id: crypto.randomUUID(), text: '' };
  }
}
