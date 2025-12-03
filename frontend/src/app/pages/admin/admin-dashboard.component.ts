import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DealService } from '../../services/deal.service';
import { CityService } from '../../services/city.service';
import { CategoryService } from '../../services/category.service';
import { AdminChatPanelComponent } from './admin-chat-panel.component';
import { AdminReservationComponent } from './admin-reservation.component';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminChatPanelComponent, AdminReservationComponent],
  template: `
    <div class="glass p-4 md:p-6">
      <!-- Tabs -->
      <div class="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
        <div class="flex gap-4">
          <button 
            (click)="activeTab.set('deals')" 
            [class.border-b-2]="activeTab() === 'deals'"
            [class.border-blue-500]="activeTab() === 'deals'"
            [class.text-blue-500]="activeTab() === 'deals'"
            class="px-4 py-2 font-semibold dark:text-white">Deal Management</button>
          <button 
            (click)="activeTab.set('messages')" 
            [class.border-b-2]="activeTab() === 'messages'"
            [class.border-blue-500]="activeTab() === 'messages'"
            [class.text-blue-500]="activeTab() === 'messages'"
            class="px-4 py-2 font-semibold dark:text-white">User Messages</button>
          <button 
            (click)="activeTab.set('reservations')" 
            [class.border-b-2]="activeTab() === 'reservations'"
            [class.border-blue-500]="activeTab() === 'reservations'"
            [class.text-blue-500]="activeTab() === 'reservations'"
            class="px-4 py-2 font-semibold dark:text-white">Reservations</button>
        </div>
        <button (click)="logout()" class="btn-glass bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2">
          Logout
        </button>
      </div>

      <!-- Deal Management Tab -->
      <div *ngIf="activeTab() === 'deals'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl mb-4">Admin Dashboard</h2>
        <button (click)="showForm = !showForm; editingDeal = null" class="btn-glass">
          {{ showForm ? 'Cancel' : '+ Add Deal' }}
        </button>
      </div>

      <!-- Deal Form -->
      <div *ngIf="showForm" class="glass p-4 mb-6">
        <h3 class="text-xl mb-4">{{ editingDeal ? 'Edit Deal' : 'Create New Deal' }}</h3>
        <form (ngSubmit)="saveDeal()" class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block mb-2 opacity-80">Title</label>
            <input [(ngModel)]="dealForm.title" name="title" required class="glass px-3 py-2 w-full" />
          </div>
          <div>
            <label class="block mb-2 opacity-80">Image URL</label>
            <input [(ngModel)]="dealForm.imageUrl" name="imageUrl" class="glass px-3 py-2 w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="block mb-2 opacity-80">Description</label>
            <textarea [(ngModel)]="dealForm.description" name="description" required class="glass px-3 py-2 w-full" rows="3"></textarea>
          </div>
          <div>
            <label class="block mb-2 opacity-80">City</label>
            <select [(ngModel)]="dealForm.cityId" name="cityId" required class="glass px-3 py-2 w-full">
              <option value="">Select City</option>
              <option *ngFor="let c of cities" [value]="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div>
            <label class="block mb-2 opacity-80">Category</label>
            <select [(ngModel)]="dealForm.categoryId" name="categoryId" required class="glass px-3 py-2 w-full">
              <option value="">Select Category</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <div>
            <label class="block mb-2 opacity-80">Price</label>
            <input type="number" step="0.01" [(ngModel)]="dealForm.price" name="price" required class="glass px-3 py-2 w-full" />
          </div>
          <div>
            <label class="block mb-2 opacity-80">Discount (%)</label>
            <input type="number" step="0.01" [(ngModel)]="dealForm.discount" name="discount" required class="glass px-3 py-2 w-full" />
          </div>
          <div>
            <label class="block mb-2 opacity-80">Location</label>
            <input [(ngModel)]="dealForm.location" name="location" class="glass px-3 py-2 w-full" />
          </div>
          <div>
            <label class="block mb-2 opacity-80">Expiration Date</label>
            <input type="date" [(ngModel)]="dealForm.expirationDate" name="expirationDate" class="glass px-3 py-2 w-full" />
          </div>
          <div class="md:col-span-2">
            <label class="inline-flex items-center gap-2">
              <input type="checkbox" [(ngModel)]="dealForm.featured" name="featured" />
              <span>Featured</span>
            </label>
          </div>
          <div class="md:col-span-2 flex gap-3">
            <button type="submit" class="btn-glass">Save</button>
            <button type="button" (click)="cancelEdit()" class="btn-glass">Cancel</button>
          </div>
        </form>
      </div>

      <!-- Pending Deals Section -->
      <div class="mb-6">
        <h3 class="text-xl mb-4">Pending Deals (Awaiting Approval) 
          <span *ngIf="pendingDeals.length > 0" class="text-sm font-normal opacity-70">({{ pendingDeals.length }})</span>
        </h3>
        <div *ngIf="pendingDeals.length === 0" class="glass p-4 text-center opacity-70">
          No pending deals to review.
        </div>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div *ngFor="let d of pendingDeals" class="glass p-3 border-2 border-yellow-500/30">
            <div class="font-semibold mb-2">{{ d.title }}</div>
            <div class="text-sm opacity-70 mb-2">{{ d.city?.name }} • {{ d.category?.name }}</div>
            <div class="text-sm opacity-60 mb-2">Discount: {{ d.discount }}%</div>
            <div class="text-xs opacity-50 mb-2" *ngIf="d.submittedBy">Submitted by: {{ d.submittedBy?.username || 'Unknown' }}</div>
            <div class="flex gap-2 flex-wrap">
              <button (click)="approveDeal(d.id)" class="btn-glass text-xs px-2 py-1 bg-green-500/20 hover:bg-green-500/30" [disabled]="processingDeals.has(d.id)">Approve</button>
              <button (click)="rejectDeal(d.id)" class="btn-glass text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30" [disabled]="processingDeals.has(d.id)">Reject</button>
              <button (click)="editDeal(d)" class="btn-glass text-xs px-2 py-1" [disabled]="processingDeals.has(d.id)">Edit</button>
              <button (click)="viewDeal(d.id)" class="btn-glass text-xs px-2 py-1" [disabled]="processingDeals.has(d.id)">View</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Deals Section -->
      <div class="mb-6">
        <h3 class="text-xl mb-4">Featured Deals (Shown on homepage)</h3>
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div *ngFor="let d of featuredDeals; let i = index" class="glass p-3">
            <div class="flex justify-between items-start mb-2">
              <div>
                <div class="font-semibold">{{ d.title }}</div>
                <div class="text-sm opacity-70">{{ d.city?.name }} • {{ d.category?.name }}</div>
              </div>
              <span class="text-xs opacity-60">#{{ i + 1 }}</span>
            </div>
            <div class="flex gap-2 mt-2">
              <button (click)="toggleFeatured(d)" class="btn-glass text-xs px-2 py-1">Unfeature</button>
              <button (click)="editDeal(d)" class="btn-glass text-xs px-2 py-1">Edit</button>
              <button (click)="deleteDeal(d.id)" class="btn-glass text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- All Deals -->
      <div>
        <h3 class="text-xl mb-4">All Deals</h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div *ngFor="let d of allDeals" class="glass p-3" [ngClass]="{'border-2 border-yellow-500/30': d.status === 'PENDING', 'border-2 border-red-500/30': d.status === 'REJECTED'}">
            <div class="font-semibold mb-2 flex items-center gap-2 flex-wrap">
              <span>{{ d.title }}</span>
              <span *ngIf="d.featured" class="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20">Featured</span>
              <span *ngIf="d.status === 'PENDING'" class="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20">Pending</span>
              <span *ngIf="d.status === 'APPROVED'" class="text-xs px-2 py-0.5 rounded-full bg-green-500/20">Approved</span>
              <span *ngIf="d.status === 'REJECTED'" class="text-xs px-2 py-0.5 rounded-full bg-red-500/20">Rejected</span>
            </div>
            <div class="text-sm opacity-70 mb-2">{{ d.city?.name }} • {{ d.category?.name }}</div>
            <div class="text-sm opacity-60 mb-2">Discount: {{ d.discount }}%</div>
            <div class="text-xs opacity-50 mb-2" *ngIf="d.submittedBy">Submitted by: {{ d.submittedBy?.username || 'Admin' }}</div>
            <div class="flex gap-2 flex-wrap">
              <button (click)="toggleFeatured(d)" class="btn-glass text-xs px-2 py-1" [disabled]="d.status !== 'APPROVED'">{{ d.featured ? 'Unfeature' : 'Feature' }}</button>
              <button (click)="editDeal(d)" class="btn-glass text-xs px-2 py-1">Edit</button>
              <button *ngIf="d.status === 'PENDING'" (click)="approveDeal(d.id)" class="btn-glass text-xs px-2 py-1 bg-green-500/20 hover:bg-green-500/30">Approve</button>
              <button *ngIf="d.status === 'PENDING'" (click)="rejectDeal(d.id)" class="btn-glass text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30">Reject</button>
              <button (click)="deleteDeal(d.id)" class="btn-glass text-xs px-2 py-1 bg-red-500/20 hover:bg-red-500/30">Delete</button>
            </div>
          </div>
        </div>
      </div>
      </div>  <!-- CLOSE Deal Management Tab -->

      <!-- User Messages Tab -->
      <div *ngIf="activeTab() === 'messages'">
        <h2 class="text-2xl mb-6 dark:text-white">User Support Chat</h2>
        <app-admin-chat-panel></app-admin-chat-panel>
      </div>

      <!-- Reservations Tab -->
      <div *ngIf="activeTab() === 'reservations'">
        <app-admin-reservation></app-admin-reservation>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  activeTab = signal('deals');
  deals: any[] = [];
  featuredDeals: any[] = [];
  allDeals: any[] = [];
  pendingDeals: any[] = [];
  cities: any[] = [];
  categories: any[] = [];
  showForm = false;
  editingDeal: any = null;
  processingDeals = new Set<number>();

  dealForm: any = {
    title: '',
    description: '',
    imageUrl: '',
    cityId: '',
    categoryId: '',
    price: '',
    discount: '',
    location: '',
    expirationDate: '',
    featured: false
  };

  constructor(
    private dealService: DealService,
    private cityService: CityService,
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService
  ) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.loadDeals();
    this.cityService.getAll().subscribe(c => this.cities = c);
    this.categoryService.getAll().subscribe(c => this.categories = c);
  }

  loadDeals() {
    // Load pending deals
    this.dealService.getPending({ size: 100 }).subscribe(p => {
      this.pendingDeals = p.content || [];
    });

    // Load featured deals (only approved)
    this.dealService.list({ featured: true, size: 100 }).subscribe(p => {
      this.featuredDeals = p.content || [];
    });

    // Load all deals (admin sees all, including pending/rejected)
    this.dealService.list({ size: 100 }).subscribe(p => {
      this.allDeals = p.content || [];
    });
  }

  approveDeal(id: number) {
    if (this.processingDeals.has(id)) return;
    this.processingDeals.add(id);
    this.dealService.approve(id).subscribe({
      next: (response) => {
        console.log('Deal approved:', response);
        this.loadDeals();
        this.processingDeals.delete(id);
      },
      error: (err) => {
        console.error('Failed to approve deal:', err);
        this.processingDeals.delete(id);
        alert('Failed to approve deal: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  rejectDeal(id: number) {
    if (this.processingDeals.has(id)) return;
    if (!confirm('Are you sure you want to reject this deal?')) return;
    this.processingDeals.add(id);
    this.dealService.reject(id).subscribe({
      next: (response) => {
        console.log('Deal rejected:', response);
        this.loadDeals();
        this.processingDeals.delete(id);
      },
      error: (err) => {
        console.error('Failed to reject deal:', err);
        this.processingDeals.delete(id);
        alert('Failed to reject deal: ' + (err.error?.message || err.message || 'Unknown error'));
      }
    });
  }

  viewDeal(id: number) {
    window.open(`/deal/${id}`, '_blank');
  }

  editDeal(deal: any) {
    this.editingDeal = deal;
    this.dealForm = {
      title: deal.title || '',
      description: deal.description || '',
      imageUrl: deal.imageUrl || '',
      cityId: deal.city?.id || '',
      categoryId: deal.category?.id || '',
      price: deal.price || '',
      discount: deal.discount || '',
      location: deal.location || '',
      expirationDate: deal.expirationDate ? deal.expirationDate.split('T')[0] : '',
      featured: !!deal.featured
    };
    this.showForm = true;
  }

  saveDeal() {
    const dealData = {
      title: this.dealForm.title,
      description: this.dealForm.description,
      imageUrl: this.dealForm.imageUrl,
      city: { id: this.dealForm.cityId },
      category: { id: this.dealForm.categoryId },
      price: parseFloat(this.dealForm.price),
      discount: parseFloat(this.dealForm.discount),
      location: this.dealForm.location,
      expirationDate: this.dealForm.expirationDate,
      featured: !!this.dealForm.featured
    };

    if (this.editingDeal) {
      this.dealService.update(this.editingDeal.id, dealData).subscribe(() => {
        this.loadDeals();
        this.cancelEdit();
      });
    } else {
      this.dealService.create(dealData).subscribe(() => {
        this.loadDeals();
        this.cancelEdit();
      });
    }
  }

  deleteDeal(id: number) {
    if (confirm('Are you sure you want to delete this deal?')) {
      this.dealService.delete(id).subscribe(() => {
        this.loadDeals();
      });
    }
  }

  toggleFeatured(deal: any) {
    const updated = { ...deal, city: deal.city ? { id: deal.city.id } : null, category: deal.category ? { id: deal.category.id } : null, featured: !deal.featured };
    this.dealService.update(deal.id, updated).subscribe(() => {
      this.loadDeals();
    });
  }

  cancelEdit() {
    this.showForm = false;
    this.editingDeal = null;
    this.dealForm = {
      title: '',
      description: '',
      imageUrl: '',
      cityId: '',
      categoryId: '',
      price: '',
      discount: '',
      location: '',
      expirationDate: '',
      featured: false
    };
  }
}
