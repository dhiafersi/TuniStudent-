import { Component, OnInit, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginPromptComponent } from './shared/login-prompt.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginPromptComponent],
  template: `
    <!-- Cursor Animation Canvas -->
    <canvas #cursorCanvas class="fixed top-0 left-0 w-full h-full pointer-events-none z-[9998]"></canvas>
    
    <router-outlet></router-outlet>
    <app-login-prompt></app-login-prompt>
  `
})
export class AppComponent implements OnInit {
  title = 'tunistudent';

  constructor(private el: ElementRef) { }

  ngOnInit() {
    this.initCursorAnimation();
  }

  private initCursorAnimation() {
    const canvas = this.el.nativeElement.querySelector('canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      life: number;
      maxLife: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
        this.life = 0;
        this.maxLife = 60;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        this.size *= 0.96;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = 1 - (this.life / this.maxLife);
        ctx.fillStyle = `rgba(59, 130, 246, ${opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
      if (particles.length > 15) particles.splice(0, particles.length - 15);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life >= particles[i].maxLife) particles.splice(i, 1);
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    animate();
  }
}
