import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MultipleCorrectData, Option } from '../../../core/models/question.model';

@Component({
  selector: 'app-multiple-correct-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="section-label">Alternativas</div>
    <p class="text-muted mb-4">Marque todas as alternativas corretas (pode ser mais de uma).</p>

    @for (opt of options; track opt.id; let i = $index) {
      <div class="option-row">
        <input type="checkbox" [value]="opt.id"
               [checked]="correctIds.includes(opt.id)"
               (change)="toggleCorrect(opt.id, $event)" />
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
    input[type="checkbox"] { width: auto; flex-shrink: 0; cursor: pointer; }
  `]
})
export class MultipleCorrectFormComponent implements OnInit {
  @Input() data: Record<string, unknown> = {};
  @Output() dataChange = new EventEmitter<Record<string, unknown>>();

  options: Option[] = [];
  correctIds: string[] = [];

  ngOnInit(): void {
    const d = this.data as Partial<MultipleCorrectData>;
    if (d.options?.length) {
      this.options = d.options.map(o => ({ ...o }));
      this.correctIds = [...(d.correctIds ?? [])];
    } else {
      this.options = [this.newOption(), this.newOption()];
    }
  }

  toggleCorrect(id: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.correctIds = checked
      ? [...this.correctIds, id]
      : this.correctIds.filter(x => x !== id);
    this.emit();
  }

  addOption(): void {
    this.options.push(this.newOption());
    this.emit();
  }

  remove(i: number): void {
    const removedId = this.options[i].id;
    this.correctIds = this.correctIds.filter(x => x !== removedId);
    this.options.splice(i, 1);
    this.emit();
  }

  emit(): void {
    this.dataChange.emit({ options: [...this.options], correctIds: [...this.correctIds] });
  }

  private newOption(): Option {
    return { id: crypto.randomUUID(), text: '' };
  }
}
