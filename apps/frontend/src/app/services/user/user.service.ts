import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserSkill } from '../../models/types';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl =`${environment.API_URL}` + 'users';

  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers: this.authService.getAuthHeaders() });
  }

  getStudentProfile(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`, { headers: this.authService.getAuthHeaders() });
  }

  updateUserProfile(data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/profile`, data, { headers: this.authService.getAuthHeaders() });
  }

  getStudentsByGrade(gradeId: string): Observable<any[]> {
    console.log('fetching',`http://localhost:5000/grades/${gradeId}/students`)
    return this.http.get<any[]>(`http://localhost:5000/grades/${gradeId}/students`, { headers: this.authService.getAuthHeaders() });
  }

  addSkillToProfile(userId: string, skillId: string, ability: number): Observable<UserSkill> {
    if (ability < 0 || ability > 5) {
      throw new Error('Ability must be between 0 and 5');
    }
    return this.http.post<UserSkill>(`${this.apiUrl}/${userId}/skills`, {
      skillId,
      ability,
    }, { headers: this.authService.getAuthHeaders() });
  }
}
