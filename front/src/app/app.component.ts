import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="app-header">
      <div class="app-header__inner container--wide">
        <a routerLink="/questions" class="app-header__brand">
          📚 Plataforma de Questões
        </a>
        <nav class="app-header__nav">
          <a routerLink="/questions" routerLinkActive="active"
             [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            Minhas Questões
          </a>
          <a routerLink="/questions/new" class="btn btn--primary btn--sm">
            + Nova Questão
          </a>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-header {
      background: #1e293b;
      color: white;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .app-header__inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
    }
    .app-header__brand {
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      letter-spacing: -0.01em;
    }
    .app-header__nav {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
      transition: color 0.15s;
      &:hover, &.active { color: white; }
    }
    .app-main {
      padding: 2rem 0;
      min-height: calc(100vh - 56px);
    }

    @media (max-width: 600px) {
      .app-header__brand { font-size: 1rem; }
      .nav-link { display: none; }
    }
  `]
})
export class AppComponent {}
