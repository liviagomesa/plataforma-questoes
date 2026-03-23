import { Component, Input, OnInit } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { CdkDragDrop, DragDropModule, transferArrayItem, moveItemInArray } from '@angular/cdk/drag-drop';
import { TableData } from '../../../core/models/question.model';
import { shuffle } from '../../../core/utils/shuffle';
import { AnswerResult } from '../question-answer.component';

interface Card {
  id: string;
  value: string;
}

interface TableCell {
  id: string;
  expected: string;
  rowIndex: number;
  colIndex: number;
  dropped: Card[];
}

@Component({
  selector: 'app-table-answer',
  standalone: true,
  imports: [DragDropModule, SlicePipe],
  template: `
    <div class="table-answer-layout">
      <!-- Banco de cards -->
      <div class="card-bank-section">
        <div class="section-label">Cards para arrastar</div>
        <div cdkDropList
             id="table-bank"
             [cdkDropListData]="cardBank"
             [cdkDropListConnectedTo]="cellListIds"
             (cdkDropListDropped)="dropOnBank($event)"
             class="card-bank">
          @for (card of cardBank; track card.id) {
            <div cdkDrag [cdkDragData]="card" class="drag-card">{{ card.value }}</div>
          }
          @if (cardBank.length === 0) {
            <span class="text-muted" style="font-size:0.8125rem">Todos os cards foram colocados</span>
          }
        </div>
      </div>

      <!-- Tabela -->
      <div class="table-wrapper">
        <table class="answer-table">
          <thead>
            <tr>
              @for (h of typedData.headers; track h) {
                <th>{{ h }}</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of typedData.rows; track row; let r = $index) {
              <tr>
                <td class="row-label">{{ row[0] }}</td>
                @for (col of typedData.headers | slice:1; track col; let c = $index) {
                  <td class="droppable-cell">
                    <div cdkDropList
                         [id]="cellId(r, c + 1)"
                         [cdkDropListData]="getCell(r, c + 1).dropped"
                         [cdkDropListConnectedTo]="['table-bank']"
                         (cdkDropListDropped)="dropOnCell($event, r, c + 1)"
                         class="cell-drop-zone drop-zone">
                      @for (card of getCell(r, c + 1).dropped; track card.id) {
                        <div cdkDrag [cdkDragData]="card" class="drag-card" style="margin:0; font-size:0.8125rem">
                          {{ card.value }}
                        </div>
                      }
                      @if (getCell(r, c + 1).dropped.length === 0) {
                        <span style="font-size:0.7rem; color:var(--text-muted)">↓</span>
                      }
                    </div>
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <button class="btn btn--ghost btn--sm mt-4" (click)="reset()">🔀 Reiniciar</button>
  `,
  styles: [`
    .table-answer-layout { display: flex; flex-direction: column; gap: 1.5rem; }
    .card-bank {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      min-height: 48px;
      padding: 0.625rem;
      border: 1.5px dashed var(--border);
      border-radius: var(--radius-sm);
      align-items: flex-start;
    }
    .table-wrapper { overflow-x: auto; }
    .answer-table {
      border-collapse: collapse;
      width: 100%;
      font-size: 0.875rem;
    }
    .answer-table th, .answer-table td {
      border: 1px solid var(--border);
      padding: 0;
      min-width: 100px;
      vertical-align: middle;
    }
    .answer-table thead th {
      background: #1e293b;
      color: white;
      padding: 0.5rem 0.75rem;
      font-weight: 600;
      font-size: 0.8125rem;
    }
    .row-label {
      background: #f1f5f9;
      padding: 0.5rem 0.75rem;
      font-weight: 600;
      font-size: 0.8125rem;
      white-space: nowrap;
    }
    .droppable-cell { padding: 0.25rem; }
    .cell-drop-zone {
      min-height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem;
    }
  `]
})
export class TableAnswerComponent implements OnInit {
  @Input() data!: unknown;

  cardBank: Card[] = [];
  cells: TableCell[] = [];
  private cellMap = new Map<string, TableCell>();

  get typedData(): TableData {
    return this.data as TableData;
  }

  get cellListIds(): string[] {
    return this.cells.map(c => this.cellId(c.rowIndex, c.colIndex));
  }

  cellId(r: number, c: number): string {
    return `table-cell-${r}-${c}`;
  }

  getCell(r: number, c: number): TableCell {
    return this.cellMap.get(`${r}-${c}`)!;
  }

  ngOnInit(): void {
    this.reset();
  }

  reset(): void {
    const cards: Card[] = [];
    const cells: TableCell[] = [];
    this.cellMap.clear();

    this.typedData.rows.forEach((row, r) => {
      row.forEach((value, c) => {
        if (c > 0) {
          const id = `${r}-${c}`;
          const card: Card = { id, value };
          const cell: TableCell = { id, expected: value, rowIndex: r, colIndex: c, dropped: [] };
          cards.push(card);
          cells.push(cell);
          this.cellMap.set(id, cell);
        }
      });
    });

    this.cells = cells;
    this.cardBank = shuffle(cards);
  }

  dropOnCell(event: CdkDragDrop<Card[]>, r: number, c: number): void {
    if (event.previousContainer === event.container) return;
    const cell = this.getCell(r, c);
    if (cell.dropped.length > 0) {
      this.cardBank.push(cell.dropped.splice(0, 1)[0]);
    }
    transferArrayItem(
      event.previousContainer.data,
      cell.dropped,
      event.previousIndex,
      0
    );
  }

  dropOnBank(event: CdkDragDrop<Card[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.cardBank, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        this.cardBank,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  verify(): AnswerResult {
    const correct = this.cells.every(cell =>
      cell.dropped.length === 1 && cell.dropped[0].value === cell.expected
    );
    return { correct };
  }
}
