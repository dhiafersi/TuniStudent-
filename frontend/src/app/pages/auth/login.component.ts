import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-160px)]">
    <div class="max-w-md mx-auto glass p-6 md:p-8 animate-scale-in w-full text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-2 neon">Login</h2>
      <p class="opacity-70 text-sm mb-6">Welcome back! Sign in with Keycloak to continue</p>
      
      <button 
        (click)="login()"
        class="btn-glass mt-2 animate-fade-in animate-delay-300 w-full py-3 font-semibold hover:scale-105 transition-transform"
      >
        Login with Keycloak
      </button>
      
      <p class="mt-6 text-center opacity-70 text-sm">
        Don't have an account? 
        <a (click)="register()" class="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer">Sign Up</a>
      </p>
    </div>
    </div>
    <app-footer></app-footer>
    <app-chatbox></app-chatbox>
  `
})
export class LoginComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) { }

  async ngOnInit() {
    // If user is already logged in, redirect to home
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  async login() {
    await this.auth.login();
  }

  async register() {
    await this.auth.login(); // Keycloak login page has register link usually, or use keycloak.register() if available
  }
}


