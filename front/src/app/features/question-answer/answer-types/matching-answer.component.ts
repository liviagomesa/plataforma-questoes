import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatchingData, MatchingPair } from '../../../core/models/question.model';
import { shuffle } from '../../../core/utils/shuffle';
import { AnswerResult } from '../question-answer.component';

interface Slot {
  definition: string;
  pairId: string;
  dropped: MatchingPair[];
}

@Component({
  selector: 'app-matching-answer',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div class="matching-layout">
      <!-- Banco de termos -->
      <div class="term-bank-section">
        <div class="section-label">Termos</div>
        <div cdkDropList
             id="term-bank"
             [cdkDropListData]="termBank"
             [cdkDropListConnectedTo]="slotIds"
             (cdkDropListDropped)="dropOnBank($event)"
             class="term-bank">
          @for (term of termBank; track term.id) {
            <div cdkDrag [cdkDragData]="term" class="drag-card">{{ term.term }}</div>
          }
          @if (termBank.length === 0) {
            <span class="text-muted" style="font-size:0.8125rem">Todos os termos foram arrastados</span>
          }
        </div>
      </div>

      <!-- Definições com slots -->
      <div class="definitions-section">
        <div class="section-label">Definições</div>
        @for (slot of slots; track slot.pairId; let i = $index) {
          <div class="definition-row">
            <div cdkDropList
                 [id]="'slot-' + i"
                 [cdkDropListData]="slot.dropped"
                 [cdkDropListConnectedTo]="['term-bank']"
                 (cdkDropListDropped)="dropOnSlot($event, i)"
                 class="slot-zone drop-zone">
              @for (term of slot.dropped; track term.id) {
                <div cdkDrag [cdkDragData]="term" class="drag-card" style="margin:0">
                  {{ term.term }}
                </div>
              }
              @if (slot.dropped.length === 0) {
                <span style="font-size:0.75rem; color:var(--text-muted)">← arraste aqui</span>
              }
            </div>
            <div class="definition-text">{{ slot.definition }}</div>
          </div>
        }
      </div>
    </div>

    <button class="btn btn--ghost btn--sm mt-4" (click)="reset()">🔀 Reiniciar</button>
  `,
  styles: [`
    .matching-layout {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 2rem;
      align-items: start;
    }
    .term-bank {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 48px;
      padding: 0.5rem;
      border: 1.5px dashed var(--border);
      border-radius: var(--radius-sm);
    }
    .definitions-section { display: flex; flex-direction: column; gap: 0.5rem; }
    .definition-row {
      display: grid;
      grid-template-columns: 160px 1fr;
      gap: 0.75rem;
      align-items: center;
    }
    .slot-zone {
      min-width: 140px;
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.25rem 0.5rem;
    }
    .definition-text {
      font-size: 0.875rem;
      line-height: 1.4;
    }

    @media (max-width: 600px) {
      .matching-layout { grid-template-columns: 1fr; }
      .definition-row { grid-template-columns: 1fr; }
    }
  `]
})
export class MatchingAnswerComponent implements OnInit {
  @Input() data!: unknown;

  termBank: MatchingPair[] = [];
  slots: Slot[] = [];

  get typedData(): MatchingData {
    return this.data as MatchingData;
  }

  get slotIds(): string[] {
    return this.slots.map((_, i) => `slot-${i}`);
  }

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    const shuffledDefs = shuffle([...this.typedData.pairs]);
    this.slots = shuffledDefs.map(p => ({
      definition: p.definition,
      pairId: p.id,
      dropped: []
    }));
    this.termBank = shuffle(this.typedData.pairs.map(p => ({ ...p })));
  }

  dropOnSlot(event: CdkDragDrop<MatchingPair[]>, slotIndex: number): void {
    if (event.previousContainer === event.container) return;
    const slot = this.slots[slotIndex];
    if (slot.dropped.length > 0) {
      this.termBank.push(slot.dropped.splice(0, 1)[0]);
    }
    transferArrayItem(
      event.previousContainer.data,
      slot.dropped,
      event.previousIndex,
      0
    );
  }

  dropOnBank(event: CdkDragDrop<MatchingPair[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.termBank, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        this.termBank,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  verify(): AnswerResult {
    const correct = this.slots.every(slot =>
      slot.dropped.length === 1 && slot.dropped[0].id === slot.pairId
    );
    return { correct };
  }
}
