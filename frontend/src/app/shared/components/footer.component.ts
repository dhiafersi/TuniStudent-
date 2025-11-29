import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="glass mt-12 py-8 border-0 border-t border-white/10 animate-fade-in">
      <div class="container mx-auto px-4 text-center">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <span class="text-xl font-black text-white">T</span>
            </div>
            <span class="font-bold gradient-text text-lg">TuniStudent</span>
          </div>
          
          <p class="text-sm opacity-70">
            © 2026 TuniStudent • Made with 💜 in Tunisia
          </p>
          
          <div class="flex gap-4">
            <a href="#" class="btn-glass px-4 py-2 text-sm hover:scale-110 transition-transform">
              About
            </a>
            <a href="#" class="btn-glass px-4 py-2 text-sm hover:scale-110 transition-transform">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent { }
