import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableData } from '../../../core/models/question.model';

@Component({
  selector: 'app-table-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="section-label">Configuração da Tabela</div>
    <p class="text-muted mb-4">
      Preencha a tabela completa. A <strong>primeira linha</strong> (headers) e a
      <strong>primeira coluna</strong> de cada linha serão exibidas fixas ao responder.
      Os demais valores virarão cards para o aluno arrastar.
    </p>

    <div class="dim-controls">
      <div class="form-group" style="flex:1">
        <label>Colunas (incluindo a 1ª col. de rótulo)</label>
        <input type="number" [(ngModel)]="cols" (ngModelChange)="resize()" min="2" max="8" />
      </div>
      <div class="form-group" style="flex:1">
        <label>Linhas de dados</label>
        <input type="number" [(ngModel)]="dataRows" (ngModelChange)="resize()" min="1" max="10" />
      </div>
    </div>

    <div class="table-wrapper">
      <table class="edit-table">
        <thead>
          <tr>
            @for (c of colIndices; track c) {
              <th>
                <input type="text" [(ngModel)]="headers[c]" (ngModelChange)="emit()"
                       [placeholder]="c === 0 ? 'Rótulo col.' : 'Header ' + c"
                       class="table-input" />
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (r of rowIndices; track r) {
            <tr>
              @for (c of colIndices; track c) {
                <td [class.first-col]="c === 0">
                  <input type="text" [(ngModel)]="rows[r][c]" (ngModelChange)="emit()"
                         [placeholder]="c === 0 ? 'Rótulo linha ' + (r+1) : 'Valor'"
                         class="table-input" />
                </td>
              }
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .dim-controls { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .table-wrapper { overflow-x: auto; }
    .edit-table {
      border-collapse: collapse;
      width: 100%;
      font-size: 0.875rem;
    }
    .edit-table th, .edit-table td {
      border: 1px solid var(--border);
      padding: 0.375rem;
      min-width: 120px;
    }
    .edit-table thead { background: #f1f5f9; }
    .first-col { background: #f8fafc; }
    .table-input {
      border: none;
      padding: 0.25rem;
      font-size: 0.8125rem;
      background: transparent;
      width: 100%;
      &:focus { outline: 1px solid var(--primary); border-radius: 2px; }
    }
  `]
})
export class TableFormComponent implements OnInit {
  @Input() data: Record<string, unknown> = {};
  @Output() dataChange = new EventEmitter<Record<string, unknown>>();

  cols = 3;
  dataRows = 3;
  headers: string[] = [];
  rows: string[][] = [];

  get colIndices(): number[] { return Array.from({ length: this.cols }, (_, i) => i); }
  get rowIndices(): number[] { return Array.from({ length: this.dataRows }, (_, i) => i); }

  ngOnInit(): void {
    const d = this.data as Partial<TableData>;
    if (d.headers?.length) {
      this.headers = [...d.headers];
      this.cols = this.headers.length;
      this.rows = d.rows ? d.rows.map(r => [...r]) : [];
      this.dataRows = this.rows.length;
    } else {
      this.buildGrid();
    }
  }

  resize(): void {
    this.cols = Math.max(2, Math.min(8, this.cols));
    this.dataRows = Math.max(1, Math.min(10, this.dataRows));
    this.buildGrid();
  }

  private buildGrid(): void {
    this.headers = Array.from({ length: this.cols }, (_, i) => this.headers[i] ?? '');
    this.rows = Array.from({ length: this.dataRows }, (_, r) =>
      Array.from({ length: this.cols }, (__, c) => this.rows[r]?.[c] ?? '')
    );
    this.emit();
  }

  emit(): void {
    this.dataChange.emit({ headers: [...this.headers], rows: this.rows.map(r => [...r]) });
  }
}
