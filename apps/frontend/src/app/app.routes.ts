import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { ChatPageComponent } from './pages/chat/chat.component';
import { MentorshipComponent } from './pages/mentorship/mentorship.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }, // Own profile
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] }, // View specific user
  { path: 'edit-profile', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'chat/:receiverId', component: ChatPageComponent, canActivate: [AuthGuard] },
  {path: 'mentorship', component: MentorshipComponent, canActivate: [AuthGuard]},
  { path: '', pathMatch: 'full', canActivate: [AuthGuard], component: HomeComponent },
  { path: '**', redirectTo: '/home' }
];
