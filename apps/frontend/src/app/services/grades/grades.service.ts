import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GradesService {
  private API_URL = 'http://localhost:5000/grades'; // Adjust API URL

  private http = inject(HttpClient);

  // Fetch all available grades from the backend
  getGrades(): Observable<{ id: string; name: string; graduationYear: string }[]> {
    return this.http.get<{ id: string; name: string; graduationYear: string }[]>(`${this.API_URL}`);
  }
}
