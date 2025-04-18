import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [NgFor, NgIf]
})
export class ProfileComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  router = inject(Router);

  userProfile = signal<any>(null);
  isOwnProfile = signal<boolean>(false);

  constructor() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      // Viewing another student's profile
      this.userService.getStudentProfile(userId).subscribe((user: User) => {
        console.log('Viewing student profile:', user);
        this.userProfile.set(user);
        this.isOwnProfile.set(false);
      });

    } else {
      // Viewing own profile
      this.userService.getUserProfile().subscribe((user: User) => {
        this.userProfile.set(user);
        this.isOwnProfile.set(true);
      });
    }
  }

  getProfileImageUrl(name: string): string {
    return `https://api.dicebear.com/9.x/glass/svg?seed=${name}`;
  }
}
