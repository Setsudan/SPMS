import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';

import { UserService } from '../../services/user/user.service';
import { SkillsService } from '../../services/skills/skills.service';
import { AuthService } from '../../services/auth/auth.service';

import { User, SocialLink } from '../../models/types';

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
  private skillsService = inject(SkillsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm: FormGroup;
  userProfile = signal<User | null>(null);
  loading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  skillList = signal<{ id: string; name: string }[]>([]);
  filteredSkills = signal<{ id: string; name: string }[]>([]);
  linkTypeOptions = ['LinkedIn', 'GitHub', 'Twitter', 'Website'];

  constructor() {
    this.profileForm = this.fb.group({
      bio: ['', [Validators.maxLength(500)]],
      face: [''],
      socialLinks: this.fb.array([]),
      skills: this.fb.array([]),
    });

    this.loadUserProfile();
    this.fetchSkills();
  }

  private loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (user: User) => {
        this.userProfile.set(user);
        this.profileForm.patchValue({
          bio: user.bio || '',
          face: user.face || '',
        });

        // Skills Form Array
        const skillsFormArray = this.fb.array(
          (user.skills || []).map(skill =>
            this.fb.group({
              skillId: [skill.skill.id],
              name: [skill.skill.name],
              ability: [skill.ability, [Validators.min(0), Validators.max(5)]],
            })
          )
        );
        this.profileForm.setControl('skills', skillsFormArray);

        const socialLinksFormArray = this.fb.array(
          (user.socialLinks || []).map(link =>
            this.fb.group({
              type: [link.type || ''],
              url: [link.url || ''],
            })
          )
        );
        this.profileForm.setControl('socialLinks', socialLinksFormArray);

        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load user profile.');
        this.loading.set(false);
      },
    });
  }

  private fetchSkills() {
    this.skillsService.getSkills().subscribe({
      next: (skills) => {
        this.skillList.set(skills);
        this.filteredSkills.set(skills);
      },
      error: (err) => console.error('Error fetching skills:', err),
    });
  }

  /** Search & Filter Skills */
  onSkillInput(event: Event) {
    const query = (event.target as HTMLInputElement)?.value || '';
    this.filterSkills(query);
  }

  filterSkills(query: string) {
    const lowerQuery = query.toLowerCase();
    const skillsFormArray = this.profileForm.get('skills') as FormArray;
    const existingIds = new Set(
      skillsFormArray.controls.map(ctrl => ctrl.get('skillId')?.value)
    );

    this.filteredSkills.set(
      this.skillList().filter(skill => {
        const matchesQuery = skill.name.toLowerCase().includes(lowerQuery);
        const notAlreadySelected = !existingIds.has(skill.id);
        return matchesQuery && notAlreadySelected;
      })
    );
  }

  /** Add a skill (no required fields to block submission) */
  addSkill(skill: { id: string; name: string }) {
    const skillsFormArray = this.profileForm.get('skills') as FormArray;
    // Prevent duplicates
    if (skillsFormArray.controls.some(control => control.get('skillId')?.value === skill.id)) return;

    skillsFormArray.push(
      this.fb.group({
        skillId: [skill.id],
        name: [skill.name],
        ability: [1, [Validators.min(0), Validators.max(5)]],
      })
    );
  }

  removeSkill(index: number) {
    const skillsFormArray = this.profileForm.get('skills') as FormArray;
    skillsFormArray.removeAt(index);
  }

  /** Social Links */
  addSocialLink() {
    const socialLinksFormArray = this.profileForm.get('socialLinks') as FormArray;
    socialLinksFormArray.push(this.fb.group({ type: '', url: '' }));
  }

  removeSocialLink(index: number) {
    const socialLinksFormArray = this.profileForm.get('socialLinks') as FormArray;
    socialLinksFormArray.removeAt(index);
  }

  getSocialLinksControls(): FormGroup[] {
    return (this.profileForm.get('socialLinks') as FormArray).controls as FormGroup[];
  }

  getSkillsControls(): FormGroup[] {
    return (this.profileForm.get('skills') as FormArray).controls as FormGroup[];
  }

  /** Submit the form */
  saveChanges() {
    // 🏁 3) If invalid, log out exactly what's wrong
    if (this.profileForm.invalid) {
      console.log('Form is invalid:', this.profileForm.errors);

      // Log top-level controls & each array item
      Object.entries(this.profileForm.controls).forEach(([key, ctrl]) => {
        console.log(`Control: ${key}, Status: ${ctrl.status}, Errors:`, ctrl.errors);
      });

      const socialLinksArray = this.profileForm.get('socialLinks') as FormArray;
      socialLinksArray.controls.forEach((ctrl, i) => {
        console.log(`Social Link #${i}:`, ctrl.status, ctrl.errors);
        console.log('--type errors:', ctrl.get('type')?.errors);
        console.log('--url errors:', ctrl.get('url')?.errors);
      });

      const skillsArray = this.profileForm.get('skills') as FormArray;
      skillsArray.controls.forEach((ctrl, i) => {
        console.log(`Skill #${i}:`, ctrl.status, ctrl.errors);
        console.log('--ability errors:', ctrl.get('ability')?.errors);
      });
      return;
    }

    const formValue = this.profileForm.value;
    const payload = {
      bio: formValue.bio,
      face: formValue.face,
      socialLinks: formValue.socialLinks.map((link: SocialLink) => ({
        type: link.type,
        url: link.url,
      })),
      skills: formValue.skills.map((skill: { skillId: any; ability: any }) => ({
        skillId: skill.skillId,
        ability: skill.ability,
      })),
    };

    console.log('Saving changes:', payload);

    this.loading.set(true);
    this.userService.updateUserProfile(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.errorMessage.set(err.error.message || 'An error occurred while updating.');
        this.loading.set(false);
      },
    });
  }

  isLoading(): boolean {
    return this.loading();
  }
}
