import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { gsap } from 'gsap';

interface ChatMessage {
  id?: number;
  content: string;
  senderName: string;
  admin: boolean;
  timestamp?: string;
}

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="authService.currentUser()" class="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <!-- Modern Chat Window -->
      <div #chatWindow class="glass w-96 h-[500px] rounded-2xl shadow-2xl border border-white/20 flex flex-col mb-4 overflow-hidden transform origin-bottom-right scale-0 opacity-0" [class.hidden]="!isOpen()">
        <!-- Gradient Header -->
        <div class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 flex justify-between items-center text-white">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl backdrop-blur">
              💬
            </div>
            <div>
              <h3 class="font-black text-lg">Support Chat</h3>
              <p class="text-xs opacity-80">We're here to help!</p>
            </div>
          </div>
          <button (click)="toggleChat()" class="hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
        
        <!-- Messages Area -->
        <div #scrollContainer class="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-white/5 to-transparent">
          <div *ngIf="messages().length === 0" class="text-center py-8 opacity-70">
            <div class="text-4xl mb-2">👋</div>
            <p class="text-sm">Start a conversation with our support team</p>
          </div>

          <div *ngFor="let msg of messages()" class="flex flex-col animate-slide-in-up" [class.items-start]="msg.admin" [class.items-end]="!msg.admin">
            <div class="max-w-[80%] rounded-2xl p-3 text-sm shadow-lg" 
                 [class.glass]="msg.admin" 
                 [class.bg-gradient-to-r]="!msg.admin"
                 [class.from-indigo-500]="!msg.admin"
                 [class.to-purple-500]="!msg.admin"
                 [class.text-white]="!msg.admin">
              {{ msg.content }}
            </div>
            <span class="text-xs opacity-60 mt-1">{{ msg.senderName }}</span>
          </div>
        </div>

        <!-- Modern Input -->
        <div class="p-4 border-t border-white/10 bg-white/5 backdrop-blur flex gap-2">
          <input 
            [(ngModel)]="newMessage" 
            (keyup.enter)="sendMessage()" 
            type="text" 
            placeholder="Type your message..." 
            class="flex-1 glass px-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all">
          <button 
            (click)="sendMessage()" 
            class="btn-glass bg-gradient-to-r from-indigo-500/30 to-purple-500/30 hover:from-indigo-500/50 hover:to-purple-500/50 px-4 rounded-xl transition-all hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Modern Floating Button -->
      <button 
        (click)="toggleChat()" 
        class="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center text-2xl font-bold shadow-purple-500/50 animate-float">
        <span *ngIf="!isOpen()">💬</span>
        <span *ngIf="isOpen()">✕</span>
        <span *ngIf="unreadCount() > 0" class="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-xs font-black shadow-lg animate-pulse">
          {{ unreadCount() }}
        </span>
      </button>
    </div>
  `
})
export class ChatboxComponent implements AfterViewChecked {
  @ViewChild('chatWindow') chatWindow!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  authService = inject(AuthService);
  http = inject(HttpClient);

  messages = signal<ChatMessage[]>([]);
  newMessage = '';
  isOpen = signal(false);
  unreadCount = signal(0);
  private shouldScroll = false;

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat() {
    const newState = !this.isOpen();
    this.isOpen.set(newState);

    if (newState) {
      gsap.to(this.chatWindow.nativeElement, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'back.out(1.7)'
      });
      this.loadMessages();
      this.unreadCount.set(0);
    } else {
      gsap.to(this.chatWindow.nativeElement, {
        scale: 0,
        opacity: 0,
        duration: 0.2
      });
    }
  }

  loadMessages() {
    this.http.get<ChatMessage[]>(`${environment.apiUrl}/chat`)
      .subscribe({
        next: (msgs) => {
          this.messages.set(msgs);
          this.shouldScroll = true;
        },
        error: (err) => console.error('Failed to load messages', err)
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const message = { content: this.newMessage };
    this.http.post<ChatMessage>(`${environment.apiUrl}/chat`, message)
      .subscribe({
        next: (msg) => {
          this.messages.update(msgs => [...msgs, msg]);
          this.newMessage = '';
          this.shouldScroll = true;
        },
        error: (err) => console.error('Failed to send message', err)
      });
  }

  private scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}
