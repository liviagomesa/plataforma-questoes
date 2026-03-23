import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatchingData, MatchingPair } from '../../../core/models/question.model';

@Component({
  selector: 'app-matching-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="section-label">Pares Termo → Definição</div>
    <p class="text-muted mb-4">Cadastre cada par. Os termos serão embaralhados ao exibir para o aluno.</p>

    <div class="pairs-header">
      <span>Termo</span>
      <span>Definição</span>
    </div>

    @for (pair of pairs; track pair.id; let i = $index) {
      <div class="pair-row">
        <input type="text" [(ngModel)]="pair.term" (ngModelChange)="emit()"
               placeholder="Termo (ex: ui:define)" />
        <input type="text" [(ngModel)]="pair.definition" (ngModelChange)="emit()"
               placeholder="Definição (ex: Define um espaço reservado)" />
        <button class="btn btn--danger btn--sm" (click)="remove(i)"
                [disabled]="pairs.length <= 2">✕</button>
      </div>
    }

    <button class="btn btn--secondary btn--sm mt-4" (click)="addPair()">
      + Adicionar par
    </button>
  `,
  styles: [`
    .pairs-header {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0 0.25rem;
      margin-bottom: 0.5rem;
    }
    .pair-row {
      display: grid;
      grid-template-columns: 1fr 1fr auto;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      align-items: center;
    }
  `]
})
export class MatchingFormComponent implements OnInit {
  @Input() data: Record<string, unknown> = {};
  @Output() dataChange = new EventEmitter<Record<string, unknown>>();

  pairs: MatchingPair[] = [];

  ngOnInit(): void {
    const d = this.data as Partial<MatchingData>;
    if (d.pairs?.length) {
      this.pairs = d.pairs.map(p => ({ ...p }));
    } else {
      this.pairs = [this.newPair(), this.newPair()];
    }
  }

  addPair(): void {
    this.pairs.push(this.newPair());
    this.emit();
  }

  remove(i: number): void {
    this.pairs.splice(i, 1);
    this.emit();
  }

  emit(): void {
    this.dataChange.emit({ pairs: [...this.pairs] });
  }

  private newPair(): MatchingPair {
    return { id: crypto.randomUUID(), term: '', definition: '' };
  }
}
