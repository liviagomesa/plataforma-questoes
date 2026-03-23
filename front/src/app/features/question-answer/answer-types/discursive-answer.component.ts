import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DiscursiveData } from '../../../core/models/question.model';
import { AnswerResult } from '../question-answer.component';

@Component({
  selector: 'app-discursive-answer',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="form-group">
      <label for="answer">Sua resposta</label>
      <textarea id="answer" [(ngModel)]="answer" rows="6"
                placeholder="Escreva sua resposta aqui..."></textarea>
    </div>
    <p class="text-muted mt-1">
      Após clicar em "Verificar resposta", o gabarito esperado será exibido para você comparar.
    </p>
  `
})
export class DiscursiveAnswerComponent {
  @Input() data!: unknown;
  answer = '';

  get typedData(): DiscursiveData {
    return this.data as DiscursiveData;
  }

  reset(): void {
    this.answer = '';
  }

  verify(): AnswerResult {
    return { correct: null, revealedAnswer: this.typedData.expectedAnswer };
  }
}
