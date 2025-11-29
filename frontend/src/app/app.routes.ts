import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { CityPageComponent } from './pages/city/city-page.component';
import { DealDetailComponent } from './pages/deal/deal-detail.component';
import { SubmitDealComponent } from './pages/deal/submit-deal.component';
import { LoginComponent } from './pages/auth/login.component';
import { RegisterComponent } from './pages/auth/register.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuardService } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'city/:name', component: CityPageComponent },
  { path: 'deal/:id', component: DealDetailComponent },
  { path: 'submit-deal', component: SubmitDealComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'favorites', component: FavoritesComponent, canActivate: [AuthGuardService] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuardService] },
];


