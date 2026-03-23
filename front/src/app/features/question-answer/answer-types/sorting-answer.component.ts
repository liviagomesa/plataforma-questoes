import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SortingData, SortingItem } from '../../../core/models/question.model';
import { shuffle } from '../../../core/utils/shuffle';
import { AnswerResult } from '../question-answer.component';

@Component({
  selector: 'app-sorting-answer',
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
      <span class="text-muted">Arraste os itens para colocá-los na ordem correta.</span>
      <button class="btn btn--ghost btn--sm" (click)="resetItems()">🔀 Embaralhar</button>
    </div>

    <div cdkDropList (cdkDropListDropped)="drop($event)" class="sorting-drop-list">
      @for (item of items; track item.id; let i = $index) {
        <div cdkDrag class="drag-card sorting-card">
          <span class="drag-handle">⠿</span>
          <span class="position-num">{{ i + 1 }}</span>
          {{ item.text }}
        </div>
      }
    </div>
  `,
  styles: [`
    .sorting-drop-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 60px;
    }
    .sorting-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      width: 100%;
    }
    .drag-handle { color: var(--text-muted); font-size: 1.1rem; cursor: grab; }
    .position-num {
      min-width: 1.75rem;
      height: 1.75rem;
      background: var(--primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }
  `]
})
export class SortingAnswerComponent implements OnInit {
  @Input() data!: unknown;

  items: SortingItem[] = [];

  get typedData(): SortingData {
    return this.data as SortingData;
  }

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    this.resetItems();
  }

  resetItems(): void {
    this.items = shuffle(this.typedData.items.map(i => ({ ...i })));
  }

  drop(event: CdkDragDrop<SortingItem[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }

  verify(): AnswerResult {
    const correct = this.items.every((item, idx) => item.order === idx + 1);
    return { correct };
  }
}
