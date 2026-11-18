import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private router = inject(Router);
  title = 'projet_roulot_lilia';

  mouseX = 50;
  mouseY = 50;
  cursorPxX = -500;
  cursorPxY = -500;

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursorPxX = event.clientX;
    this.cursorPxY = event.clientY;
    this.mouseX = (event.clientX / window.innerWidth) * 100;
    this.mouseY = (event.clientY / window.innerHeight) * 100;
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('user_session');
  }

  get operatorName(): string {
    const raw = localStorage.getItem('user_session');
    if (!raw) return 'INVITÉ';
    try {
      const parsed = JSON.parse(raw);
      return (parsed.name || parsed.email || 'AGENT').toUpperCase();
    } catch {
      return 'AGENT';
    }
  }

  async logout(): Promise<void> {
    const navigated = await this.router.navigate(['/signup']);
    if (navigated) {
      localStorage.removeItem('user_session');
    }
  }
}
