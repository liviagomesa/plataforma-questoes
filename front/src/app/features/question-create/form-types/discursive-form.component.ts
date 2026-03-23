import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiscursiveData } from '../../../core/models/question.model';

@Component({
  selector: 'app-discursive-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-group">
      <label for="expected">Resposta esperada (gabarito)</label>
      <textarea id="expected" [(ngModel)]="expectedAnswer" (ngModelChange)="emit()"
                rows="6"
                placeholder="Digite o texto do gabarito que será exibido após o aluno submeter a resposta...">
      </textarea>
      <span class="text-muted mt-1">Este texto será exibido após a submissão para o aluno comparar manualmente.</span>
    </div>
  `
})
export class DiscursiveFormComponent implements OnInit {
  @Input() data: Record<string, unknown> = {};
  @Output() dataChange = new EventEmitter<Record<string, unknown>>();

  expectedAnswer = '';

  ngOnInit(): void {
    this.expectedAnswer = (this.data as Partial<DiscursiveData>).expectedAnswer ?? '';
  }

  emit(): void {
    this.dataChange.emit({ expectedAnswer: this.expectedAnswer });
  }
}
