import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserSkill } from '../../models/types';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.API_URL}` + 'users';

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getStudentProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get/${userId}`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getUserGrade() {
    return this.http.get<any>(`${this.apiUrl}/grade`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile`, data, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  getStudentsByGrade(gradeId: string): Observable<any[]> {
    console.log('fetching', `${environment.API_URL}/grades/${gradeId}/students`);
    return this.http.get<any[]>(`${environment.API_URL}/grades/${gradeId}/students`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  addSkillToProfile(
    userId: string,
    skillId: string,
    ability: number
  ): Observable<UserSkill> {
    if (ability < 0 || ability > 5) {
      throw new Error('Ability must be between 0 and 5');
    }
    return this.http.post<UserSkill>(
      `${this.apiUrl}/${userId}/skills`,
      {
        skillId,
        ability,
      },
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
