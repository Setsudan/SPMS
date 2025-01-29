import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { NgFor, NgIf } from '@angular/common';
import { User } from '../../models/types';
import { SkillsService } from '../../services/skills/skills.service';

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
  selectedSkills = signal<{ name: string; ability: number }[]>([]);

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

  /** Load user profile and populate the form */
  private loadUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (user: User) => {
        this.userProfile.set(user);
        this.profileForm.patchValue({
          bio: user.bio || '',
          face: user.face || '',
        });

        // Populate social links
        const socialLinksArray = this.fb.array(
          (user.socialLinks || []).map(link => this.fb.control(link))
        );
        this.profileForm.setControl('socialLinks', socialLinksArray);

        // Populate selected skills
        const selectedSkillsArray = user.skills?.map(skill =>
          this.createSkillGroup(skill.skill.name, skill.ability)
        );
        this.profileForm.setControl(
          'skills',
          this.fb.array(selectedSkillsArray || [])
        );

        this.selectedSkills.set(
          user.skills?.map(skill => ({
            name: skill.skill.name,
            ability: skill.ability,
          })) || []
        );

        this.loading.set(false);
      },
      error: err => {
        this.errorMessage.set('Failed to load user profile.');
        this.loading.set(false);
      },
    });
  }

  /** Fetch available skills from the server */
  private fetchSkills() {
    this.skillsService.getSkills().subscribe({
      next: skills => {
        this.skillList.set(skills);
        this.filteredSkills.set(skills);
      },
      error: err => {
        console.error('Error fetching skills:', err);
      },
    });
  }

  /** Creates a FormGroup for skills */
  private createSkillGroup(skillName: string, ability: number) {
    return this.fb.group({
      name: [skillName],
      ability: [ability, [Validators.min(0), Validators.max(5)]],
    });
  }

  /** Filters the skills list based on user input */
  filterSkills(query: string) {
    const lowerQuery = query.toLowerCase();
    this.filteredSkills.set(
      this.skillList().filter(skill => skill.name.toLowerCase().includes(lowerQuery))
    );
  }

  /** Handles skill input changes */
  onSkillInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.value || '';
    this.filterSkills(inputValue);
  }

  /** Adds a selected skill to the form */
  addSkill(skill: { name: string }) {
    const skillsFormArray = this.profileForm.get('skills') as FormArray;

    // Prevent duplicate skills
    if (this.selectedSkills().some(s => s.name === skill.name)) return;

    const newSkill = { name: skill.name, ability: 1 };
    this.selectedSkills.set([...this.selectedSkills(), newSkill]);

    skillsFormArray.push(this.createSkillGroup(skill.name, 1));
  }

  /** Removes a skill from the form */
  removeSkill(index: number) {
    const skillsFormArray = this.profileForm.get('skills') as FormArray;
    skillsFormArray.removeAt(index);

    const updatedSkills = this.selectedSkills().filter((_, i) => i !== index);
    this.selectedSkills.set(updatedSkills);
  }

  /** Returns form controls for social links */
  getSocialLinksControls(): AbstractControl[] {
    return (this.profileForm.get('socialLinks') as FormArray).controls;
  }

  /** Returns form controls for skills */
  getSkillsControls(): AbstractControl[] {
    return (this.profileForm.get('skills') as FormArray).controls;
  }

  /** Submits the profile form */
  saveChanges() {
    if (this.profileForm.invalid) return;

    this.loading.set(true);
    const userId = this.userProfile()?.id;
    if (!userId) {
      this.errorMessage.set('User ID is missing.');
      this.loading.set(false);
      return;
    }

    this.userService.updateUserProfile(this.profileForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/profile']);
      },
      error: err => {
        this.errorMessage.set(err.error.message || 'An error occurred while updating.');
        this.loading.set(false);
      },
    });
  }

  /** Checks if the form is loading */
  isLoading(): boolean {
    return this.loading();
  }
}
