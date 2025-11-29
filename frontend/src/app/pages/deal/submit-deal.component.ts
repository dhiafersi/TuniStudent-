import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { CityService } from '../../services/city.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { AIService } from '../../services/ai.service';
import { LoginPromptService } from '../../shared/login-prompt.service';
import { NavbarComponent } from '../../shared/components/navbar.component';
import { FooterComponent } from '../../shared/components/footer.component';
import { ChatboxComponent } from '../../shared/components/chatbox.component';

@Component({
  selector: 'app-submit-deal',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, ChatboxComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-7xl">
    <div class="glass p-4 md:p-6 max-w-4xl mx-auto dark:bg-gray-900 dark:text-white">
      <h2 class="text-2xl font-bold mb-6 neon">Submit a Deal</h2>
      
      <div *ngIf="!auth.isLoggedIn()" class="glass p-4 mb-4 bg-yellow-500/20 border-yellow-500/50">
        <p class="mb-4">You need to be logged in to submit a deal.</p>
        <button (click)="prompt.open({ message: 'Please log in to submit a deal.', returnUrl: '/submit-deal' })" class="btn-glass">
          Log In
        </button>
      </div>

      <form *ngIf="auth.isLoggedIn()" (ngSubmit)="onSubmit()" class="grid md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block mb-2 opacity-80">Title *</label>
          <input [(ngModel)]="dealForm.title" name="title" required class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" placeholder="e.g., Student Discount -20%" />
        </div>

        <div class="md:col-span-2">
          <div class="flex justify-between items-center mb-2">
            <label class="opacity-80">Description *</label>
            <button 
              type="button" 
              (click)="generateDescription()" 
              [disabled]="generatingAI || !dealForm.title"
              class="text-xs bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded transition-colors flex items-center gap-1 disabled:opacity-50"
            >
              <span *ngIf="generatingAI" class="animate-spin">✨</span>
              <span *ngIf="!generatingAI">✨ AI Magic Description</span>
            </button>
          </div>
          <textarea [(ngModel)]="dealForm.description" name="description" required class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" rows="4" placeholder="Describe your deal..."></textarea>
        </div>

        <div>
          <label class="block mb-2 opacity-80">Image URL</label>
          <input [(ngModel)]="dealForm.imageUrl" name="imageUrl" type="url" class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" placeholder="https://..." />
        </div>

        <div>
          <label class="block mb-2 opacity-80">City *</label>
          <select [(ngModel)]="dealForm.cityId" name="cityId" required class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select City</option>
            <option *ngFor="let c of cities" [value]="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 opacity-80">Category *</label>
          <select [(ngModel)]="dealForm.categoryId" name="categoryId" required class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700">
            <option value="">Select Category</option>
            <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
          </select>
        </div>

        <div>
          <label class="block mb-2 opacity-80">Price</label>
          <input type="number" step="0.01" [(ngModel)]="dealForm.price" name="price" class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" placeholder="0.00" />
        </div>

        <div>
          <label class="block mb-2 opacity-80">Discount (%) *</label>
          <input type="number" step="0.01" [(ngModel)]="dealForm.discount" name="discount" required class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" placeholder="0.00" />
        </div>

        <div>
          <label class="block mb-2 opacity-80">Location</label>
          <input [(ngModel)]="dealForm.location" name="location" class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" placeholder="Address or location" />
        </div>

        <div>
          <label class="block mb-2 opacity-80">Expiration Date</label>
          <input type="date" [(ngModel)]="dealForm.expirationDate" name="expirationDate" class="glass px-3 py-2 w-full dark:bg-gray-800 dark:border-gray-700" />
        </div>

        <div class="md:col-span-2 glass p-4 bg-blue-500/20 border-blue-500/50 rounded-lg">
          <p class="text-sm opacity-90 dark:text-blue-200">
            <strong>Note:</strong> Your deal submission will be reviewed by an administrator before being published. 
            You will be notified once it's approved or rejected.
          </p>
        </div>

        <div class="md:col-span-2 flex gap-3">
          <button type="submit" [disabled]="submitting" class="btn-glass bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto">
            <span *ngIf="submitting">Submitting...</span>
            <span *ngIf="!submitting">Submit Deal</span>
          </button>
          <button type="button" (click)="cancel()" class="btn-glass bg-gray-500 hover:bg-gray-600 text-white w-full md:w-auto" [disabled]="submitting">Cancel</button>
        </div>

        <div *ngIf="error" class="md:col-span-2 glass p-4 bg-red-500/20 border-red-500/50 rounded-lg">
          <p class="text-red-300">{{ error }}</p>
        </div>

        <div *ngIf="success" class="md:col-span-2 glass p-4 bg-green-500/20 border-green-500/50 rounded-lg">
          <p class="text-green-300">Deal submitted successfully! It will be reviewed by an administrator.</p>
        </div>
      </form>
    </div>
  `
})
export class SubmitDealComponent implements OnInit {
  cities: any[] = [];
  categories: any[] = [];
  submitting = false;
  generatingAI = false;
  error: string | null = null;
  success = false;

  dealForm: any = {
    title: '',
    description: '',
    imageUrl: '',
    cityId: '',
    categoryId: '',
    price: '',
    discount: '',
    location: '',
    expirationDate: ''
  };

  constructor(
    private dealService: DealService,
    private cityService: CityService,
    private categoryService: CategoryService,
    public auth: AuthService,
    private aiService: AIService,
    public prompt: LoginPromptService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cityService.getAll().subscribe(c => this.cities = c);
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  generateDescription() {
    if (!this.dealForm.title) return;

    this.generatingAI = true;
    const categoryName = this.categories.find(c => c.id == this.dealForm.categoryId)?.name || 'General';

    this.aiService.generateDescription(this.dealForm.title, categoryName).subscribe({
      next: (res) => {
        this.dealForm.description = res.description;
        this.generatingAI = false;
      },
      error: () => {
        this.generatingAI = false;
        // Fallback or silent fail
      }
    });
  }

  onSubmit() {
    if (this.submitting) return;

    this.error = null;
    this.success = false;
    this.submitting = true;

    const dealData = {
      title: this.dealForm.title,
      description: this.dealForm.description,
      imageUrl: this.dealForm.imageUrl || null,
      cityId: parseInt(this.dealForm.cityId),
      categoryId: parseInt(this.dealForm.categoryId),
      price: this.dealForm.price ? parseFloat(this.dealForm.price) : null,
      discount: parseFloat(this.dealForm.discount),
      location: this.dealForm.location || null,
      expirationDate: this.dealForm.expirationDate || null
    };

    this.dealService.submit(dealData).subscribe({
      next: () => {
        this.success = true;
        this.submitting = false;
        this.dealForm = {
          title: '',
          description: '',
          imageUrl: '',
          cityId: '',
          categoryId: '',
          price: '',
          discount: '',
          location: '',
          expirationDate: ''
        };
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to submit deal. Please try again.';
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
