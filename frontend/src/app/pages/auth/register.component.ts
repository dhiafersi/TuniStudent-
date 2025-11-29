import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-160px)]">
    <div class="max-w-md mx-auto glass p-6 md:p-8 animate-scale-in w-full text-center">
      <h2 class="text-2xl md:text-3xl font-bold mb-2 neon">Create Account</h2>
      <p class="opacity-70 text-sm mb-6">Join TuniStudent via Keycloak</p>
      
      <button 
        (click)="register()"
        class="btn-glass mt-2 animate-fade-in animate-delay-300 w-full py-3 font-semibold hover:scale-105 transition-transform"
      >
        Sign Up with Keycloak
      </button>
      
      <p class="mt-6 text-center opacity-70 text-sm">
        Already have an account? 
        <a (click)="login()" class="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer">Login</a>
      </p>
    </div>
    </div>
    <app-footer></app-footer>
    <app-chatbox></app-chatbox>
  `
})
export class RegisterComponent {
  constructor(private auth: AuthService) { }

  async register() {
    await this.auth.register();
  }

  async login() {
    await this.auth.login();
  }
}


