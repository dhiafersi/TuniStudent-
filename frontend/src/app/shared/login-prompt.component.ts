import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginPromptService, LoginPromptOptions } from './login-prompt.service';

@Component({
  selector: 'app-login-prompt',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="visible" class="fixed inset-0 z-[10000] flex items-center justify-center p-4 animate-fade-in">
    <!-- Backdrop with blur -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="close()" aria-hidden="true"></div>

    <!-- Modal -->
    <div class="relative glass w-full max-w-md rounded-2xl p-8 shadow-2xl border border-white/20 animate-scale-in"
         role="dialog" aria-modal="true"
         aria-labelledby="login-prompt-title"
         aria-describedby="login-prompt-desc"
         tabindex="-1" #modalRef>
      
      <!-- Decorative Gradient Orb -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 rounded-full blur-2xl pointer-events-none"></div>
      
      <!-- Close Button -->
      <button class="absolute top-4 right-4 btn-glass w-8 h-8 flex items-center justify-center rounded-full text-sm hover:bg-red-500/20 hover:text-red-400 transition-colors"
              (click)="close()" aria-label="Close login prompt">✕</button>

      <!-- Icon -->
      <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-indigo-500/30 mx-auto">
        🔒
      </div>

      <div class="text-center mb-8">
        <h3 id="login-prompt-title" class="text-2xl font-black mb-2 gradient-text">Login Required</h3>
        <p id="login-prompt-desc" class="opacity-80 text-base leading-relaxed">
          {{ opts.message || 'Please log in to access this feature and unlock amazing student deals!' }}
        </p>
      </div>

      <div class="flex flex-col gap-3">
        <button class="btn-glass py-3.5 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 font-bold text-lg shadow-lg transition-all hover:scale-[1.02]" 
                (click)="go('login')">
          Login
        </button>
        <button class="btn-glass py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all" 
                (click)="go('register')">
          Create Account
        </button>
        <button class="text-sm opacity-60 hover:opacity-100 transition-opacity mt-2" 
                (click)="close()">
          Maybe later
        </button>
      </div>
    </div>
  </div>
  `
})
export class LoginPromptComponent {
  visible = false;
  opts: LoginPromptOptions = {};

  constructor(
    private svc: LoginPromptService,
    private router: Router,
    private el: ElementRef<HTMLElement>
  ) {
    this.svc.open$.subscribe(o => {
      this.opts = o || {};
      this.visible = true;
      setTimeout(() => {
        const modal = this.el.nativeElement.querySelector<HTMLElement>('[tabindex="-1"]');
        modal?.focus();
      });
    });
  }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.visible) this.close(); }

  close() { this.visible = false; }

  go(target: 'login' | 'register') {
    const qp = this.opts.returnUrl ? { queryParams: { returnUrl: this.opts.returnUrl } } : undefined;
    this.router.navigate(['/' + target], qp);
    this.close();
  }
}
