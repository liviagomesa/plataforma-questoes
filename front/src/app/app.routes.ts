import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/questions', pathMatch: 'full' },
  {
    path: 'questions',
    loadComponent: () => import('./features/question-list/question-list.component')
      .then(m => m.QuestionListComponent)
  },
  {
    path: 'questions/new',
    loadComponent: () => import('./features/question-create/question-create.component')
      .then(m => m.QuestionCreateComponent)
  },
  {
    path: 'questions/:id/edit',
    loadComponent: () => import('./features/question-create/question-create.component')
      .then(m => m.QuestionCreateComponent)
  },
  {
    path: 'questions/:id/answer',
    loadComponent: () => import('./features/question-answer/question-answer.component')
      .then(m => m.QuestionAnswerComponent)
  },
  { path: '**', redirectTo: '/questions' }
];
