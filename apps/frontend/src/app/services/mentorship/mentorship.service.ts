import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  private baseUrl = environment.API_URL + 'mentorship';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Fetch available mentors (senior students)
  getMentors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/available`, { headers: this.authService.getAuthHeaders() });
  }

  requestMentorship(mentorId: string): Observable<void> {
    const headers = this.authService.getAuthHeaders();

    return this.http.post<void>(
      `${this.baseUrl}/request`,
      { receiverId: mentorId },
      { headers }
    );
  }

  // Get mentorship requests (sent & received)
  getRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/requests` , { headers: this.authService.getAuthHeaders() });
  }
}
