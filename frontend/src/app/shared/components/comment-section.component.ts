import { Component, Input, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';

interface Comment {
  id: number;
  content: string;
  userName: string;
  userId: number;
  createdAt: string;
}

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 class="text-xl font-bold mb-4 dark:text-white">Comments ({{ comments().length }})</h3>
      
      <!-- Comment List -->
      <div class="space-y-4 mb-6">
        <div *ngIf="comments().length === 0" class="text-gray-500 dark:text-gray-400 italic">
          No comments yet. Be the first to share your thoughts!
        </div>
        <div *ngFor="let comment of comments()" class="flex gap-3 animate-fade-in group">
          <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
            {{ comment.userName?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="flex-1">
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 relative">
              <div class="flex justify-between items-baseline mb-1">
                <span class="font-semibold text-sm dark:text-white">{{ comment.userName || 'Anonymous' }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ comment.createdAt | date:'mediumDate' }}</span>
              </div>
              
              <div *ngIf="editingCommentId !== comment.id">
                <p class="text-gray-700 dark:text-gray-300 text-sm">{{ comment.content }}</p>
              </div>
              <div *ngIf="editingCommentId === comment.id">
                 <textarea [(ngModel)]="editContent" rows="2" class="w-full border rounded p-2 text-sm dark:bg-gray-600 dark:text-white"></textarea>
                 <div class="flex gap-2 mt-2 justify-end">
                    <button (click)="cancelEdit()" class="text-xs text-gray-500 hover:underline">Cancel</button>
                    <button (click)="saveEdit(comment.id)" class="text-xs text-blue-500 font-bold hover:underline">Save</button>
                 </div>
              </div>

              <!-- Actions -->
              <div *ngIf="canEdit(comment) && editingCommentId !== comment.id" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button (click)="startEdit(comment)" class="text-xs text-blue-500 hover:underline">Edit</button>
                <button (click)="deleteComment(comment.id)" class="text-xs text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Comment Form -->
      <div *ngIf="authService.isLoggedIn()" class="flex gap-3">
        <div class="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
           <span class="font-bold">{{ authService.currentUser()?.username?.charAt(0)?.toUpperCase() }}</span>
        </div>
        <div class="flex-1">
          <textarea [(ngModel)]="newComment" placeholder="Write a comment..." rows="2" class="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
          <div class="flex justify-end mt-2">
            <button (click)="postComment()" [disabled]="!newComment.trim()" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Post Comment
            </button>
          </div>
        </div>
      </div>
      <div *ngIf="!authService.isLoggedIn()" class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p class="text-gray-600 dark:text-gray-300">Please <a href="/login" class="text-blue-600 hover:underline">login</a> to leave a comment.</p>
      </div>
    </div>
  `
})
export class CommentSectionComponent {
  @Input() dealId!: number;

  commentService = inject(CommentService);
  authService = inject(AuthService);

  comments = signal<Comment[]>([]);
  newComment = '';
  editingCommentId: number | null = null;
  editContent = '';

  ngOnInit() {
    this.fetchComments();
  }

  fetchComments() {
    this.commentService.getCommentsForDeal(this.dealId).subscribe(comments => {
      this.comments.set(comments);
    });
  }

  postComment() {
    if (!this.newComment.trim()) return;

    this.commentService.addComment(this.dealId, this.newComment).subscribe(comment => {
      this.comments.update(c => [comment, ...c]);
      this.newComment = '';
    });
  }

  canEdit(comment: Comment): boolean {
    const userId = this.authService.userId();
    const isAdmin = this.authService.isAdmin();
    return isAdmin || (userId !== null && userId === comment.userId);
  }

  startEdit(comment: Comment) {
    this.editingCommentId = comment.id;
    this.editContent = comment.content;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editContent = '';
  }

  saveEdit(id: number) {
    if (!this.editContent.trim()) return;
    this.commentService.updateComment(id, this.editContent).subscribe({
      next: (updated) => {
        this.comments.update(list => list.map(c => c.id === id ? updated : c));
        this.cancelEdit();
      },
      error: (err) => alert('Failed to update comment')
    });
  }

  deleteComment(id: number) {
    if (!confirm('Are you sure?')) return;
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.comments.update(list => list.filter(c => c.id !== id));
      },
      error: (err) => alert('Failed to delete comment')
    });
  }
}
