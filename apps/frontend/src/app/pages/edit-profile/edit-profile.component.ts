import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/types';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  imports: [NgFor, NgIf, ReactiveFormsModule],
})
export class EditProfileComponent {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm: FormGroup;
  userProfile = signal<any>(null);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);

  constructor() {
    this.profileForm = this.fb.group({
      bio: ['', [Validators.maxLength(500)]],
      face: [''],
      socialLinks: this.fb.array([]),
      skills: this.fb.array([]),
    });

    this.userService.getUserProfile().subscribe((user: User) => {
      this.userProfile.set(user);
      this.profileForm.patchValue({
        bio: user.bio || '',
        face: user.face || '',
        socialLinks: user.socialLinks || [],
        skills: user.skills?.map((skill: any) => ({
          skillId: skill.skill.id,
          ability: skill.ability,
        })) || [],
      });
      this.isLoading.set(false);
    });
  }

  saveChanges() {
    if (this.profileForm.invalid) return;
    this.isLoading.set(true);

    this.userService.updateUserProfile(this.userProfile()?.id, this.profileForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error.message || 'An error occurred while updating.');
      },
    });
  }
}
