import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [NgIf, NgFor]
})
export class HomeComponent {
  private userService = inject(UserService);
  private authService = inject(AuthService);

  students = signal<any[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string | null>(null);
  userGrade = signal<string | null>(null);

  constructor() {
    this.userService.getUserProfile().subscribe(user => {
      this.userGrade.set(user.grade?.name || null);
      if (user.grade?.id) {
        console.log('Fetching students...', user.grade.id);
        this.fetchStudents(user.grade.id);
      } else {
        this.isLoading.set(false);
        this.errorMessage.set('No grade assigned to your profile.');
      }
    });
  }

  fetchStudents(gradeId: string) {
    this.userService.getStudentsByGrade(gradeId).subscribe({
      next: (students) => {
        this.students.set(students);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error.message || 'Failed to fetch students.');
      }
    });
  }
}
