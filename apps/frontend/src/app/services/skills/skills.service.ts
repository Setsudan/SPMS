import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SkillsService {
  private API_URL =`${environment.API_URL}` + 'skills';

  private http = inject(HttpClient);

  // Fetch all available grades from the backend
  getSkills(): Observable<{ id: string; name: string; description: string }[]> {
    return this.http.get<{ id: string; name: string; description: string }[]>(`${this.API_URL}`);
  }
}
