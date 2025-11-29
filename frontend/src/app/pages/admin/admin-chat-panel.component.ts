import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Conversation {
  userId: number;
  userName: string;
  messageCount: number;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageFromAdmin: boolean;
}

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  isAdmin: boolean;
  timestamp: string;
}

@Component({
  selector: 'app-admin-chat-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      <!-- Conversations List -->
      <div class="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 class="font-bold text-lg dark:text-white">User Messages</h3>
          <button (click)="refreshConversations()" class="text-sm text-blue-500 hover:underline">Refresh</button>
        </div>
        <div class="overflow-y-auto h-[calc(100%-60px)]">
          <div *ngIf="conversations().length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">
            No conversations yet
          </div>
          <div *ngFor="let conv of conversations()" 
               (click)="selectConversation(conv.userId)"
               [class.bg-blue-50]="selectedUserId() === conv.userId"
               [class.dark:bg-blue-900]="selectedUserId() === conv.userId"
               class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors">
            <div class="flex justify-between items-start mb-1">
              <span class="font-semibold text-sm dark:text-white">{{ conv.userName }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">{{ conv.lastMessageTime | date:'short' }}</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-300 truncate">
              {{ conv.lastMessageFromAdmin ? '✓ ' : '' }}{{ conv.lastMessage }}
            </p>
            <span class="text-xs text-gray-500 dark:text-gray-400">{{ conv.messageCount }} messages</span>
          </div>
        </div>
      </div>

      <!-- Chat Thread -->
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        <div *ngIf="!selectedUserId()" class="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Select a conversation to view messages
        </div>
        
        <div *ngIf="selectedUserId()" class="flex-1 flex flex-col">
          <!-- Chat Header -->
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="font-bold dark:text-white">{{ getSelectedUserName() }}</h3>
          </div>

          <!-- Messages -->
          <div class="flex-1 overflow-y-auto p-4 space-y-3">
            <div *ngFor="let msg of messages()" 
                 [class.flex-row-reverse]="msg.isAdmin"
                 class="flex gap-2">
              <div [class.bg-blue-500]="msg.isAdmin"
                   [class.text-white]="msg.isAdmin"
                   [class.bg-gray-100]="!msg.isAdmin"
                   [class.dark:bg-gray-700]="!msg.isAdmin"
                   [class.dark:text-white]="!msg.isAdmin"
                   class="max-w-[70%] rounded-lg p-3">
                <p class="text-sm font-semibold mb-1">{{ msg.senderName }}</p>
                <p class="text-sm">{{ msg.content }}</p>
                <span class="text-xs opacity-70">{{ msg.timestamp | date:'short' }}</span>
              </div>
            </div>
          </div>

          <!-- Reply Input -->
          <div class="p-4 border-t border-gray-200 dark:border-gray-700">
            <div class="flex gap-2">
              <input 
                type="text" 
                [(ngModel)]="replyText"
                (keyup.enter)="sendReply()"
                placeholder="Type your reply..."
                class="flex-1 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button 
                (click)="sendReply()"
                [disabled]="!replyText.trim()"
                class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminChatPanelComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/chat`;

  conversations = signal<Conversation[]>([]);
  messages = signal<ChatMessage[]>([]);
  selectedUserId = signal<number | null>(null);
  replyText = '';

  ngOnInit() {
    console.log('AdminChatPanelComponent initialized, calling API...');
    this.refreshConversations();
  }

  refreshConversations() {
    console.log('Fetching conversations from:', `${this.apiUrl}/conversations`);
    this.http.get<Conversation[]>(`${this.apiUrl}/conversations`).subscribe({
      next: (data) => {
        console.log('Conversations received:', data);
        this.conversations.set(data);
        if (data.length === 0) {
          alert('No user conversations found. Make sure users have sent chat messages!');
        }
      },
      error: (err) => {
        console.error('Failed to load conversations:', err);
        alert('Error loading conversations: ' + (err.message || 'Unknown error'));
      }
    });
  }

  selectConversation(userId: number) {
    this.selectedUserId.set(userId);
    this.loadConversation(userId);
  }

  loadConversation(userId: number) {
    this.http.get<ChatMessage[]>(`${this.apiUrl}/conversation/${userId}`).subscribe({
      next: (data) => this.messages.set(data),
      error: (err) => console.error('Failed to load messages:', err)
    });
  }

  sendReply() {
    if (!this.replyText.trim() || !this.selectedUserId()) return;

    this.http.post<ChatMessage>(`${this.apiUrl}/reply`, {
      userId: this.selectedUserId(),
      content: this.replyText
    }).subscribe({
      next: (msg) => {
        this.messages.update(msgs => [...msgs, msg]);
        this.replyText = '';
        this.refreshConversations();
      },
      error: (err) => console.error('Failed to send reply:', err)
    });
  }

  getSelectedUserName(): string {
    const conv = this.conversations().find(c => c.userId === this.selectedUserId());
    return conv ? conv.userName : '';
  }
}
