import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SortingData, SortingItem } from '../../../core/models/question.model';

@Component({
  selector: 'app-sorting-form',
  standalone: true,
  imports: [FormsModule, DragDropModule],
  template: `
    <div class="section-label">Itens na ordem correta</div>
    <p class="text-muted mb-4">Adicione os itens <strong>já na ordem correta</strong>. O sistema vai embaralhá-los ao exibir para o aluno.</p>

    <div cdkDropList (cdkDropListDropped)="drop($event)" class="sorting-list">
      @for (item of items; track item.id; let i = $index) {
        <div cdkDrag class="sorting-item">
          <span class="drag-handle">⠿</span>
          <span class="order-num">{{ i + 1 }}</span>
          <input type="text" [(ngModel)]="item.text" (ngModelChange)="emit()"
                 [placeholder]="'Item ' + (i + 1)" style="flex:1" />
          <button class="btn btn--danger btn--sm" (click)="remove(i)"
                  [disabled]="items.length <= 2">✕</button>
        </div>
      }
    </div>

    <button class="btn btn--secondary btn--sm mt-4" (click)="addItem()">
      + Adicionar item
    </button>
  `,
  styles: [`
    .sorting-list { display: flex; flex-direction: column; gap: 0.375rem; }
    .sorting-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.5rem;
      background: white;
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      cursor: move;
    }
    .drag-handle { color: var(--text-muted); font-size: 1.1rem; cursor: grab; }
    .order-num {
      width: 1.5rem;
      height: 1.5rem;
      background: var(--primary-light);
      color: var(--primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 600;
      flex-shrink: 0;
    }
  `]
})
export class SortingFormComponent implements OnInit {
  @Input() data: Record<string, unknown> = {};
  @Output() dataChange = new EventEmitter<Record<string, unknown>>();

  items: SortingItem[] = [];

  ngOnInit(): void {
    const d = this.data as Partial<SortingData>;
    if (d.items?.length) {
      this.items = d.items.map(i => ({ ...i })).sort((a, b) => a.order - b.order);
    } else {
      this.items = [this.newItem(), this.newItem()];
    }
  }

  drop(event: CdkDragDrop<SortingItem[]>): void {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    this.emit();
  }

  addItem(): void {
    this.items.push(this.newItem());
    this.emit();
  }

  remove(i: number): void {
    this.items.splice(i, 1);
    this.emit();
  }

  emit(): void {
    const items = this.items.map((item, idx) => ({ ...item, order: idx + 1 }));
    this.dataChange.emit({ items });
  }

  private newItem(): SortingItem {
    return { id: crypto.randomUUID(), text: '', order: this.items.length + 1 };
  }
}
