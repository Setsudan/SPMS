import { Component, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { GradesService } from '../../services/grades/grades.service';
import { Router } from '@angular/router';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [NgFor, ReactiveFormsModule]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private gradesService = inject(GradesService);
  private router = inject(Router);

  registerForm: FormGroup;
  grades = signal<{ id: string; name: string; graduationYear: string }[]>([]);

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gradeId: ['', Validators.required],
    });

    this.fetchGrades();
  }

  fetchGrades() {
    this.gradesService.getGrades().subscribe({
      next: (data) => this.grades.set(data),
      error: (err) => console.error('Error fetching grades:', err),
    });
  }

  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error('Registration failed:', err),
      });
    }
  }
}
