import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private API_URL =`${environment.API_URL}` + 'grades';

  private http = inject(HttpClient);

  // Fetch all available grades from the backend
  getGrades(): Observable<{ id: string; name: string; graduationYear: string }[]> {
    return this.http.get<{ id: string; name: string; graduationYear: string }[]>(`${this.API_URL}`);
  }
}
