import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class UrlService {
  private readonly API_URL = "http://localhost:5000"
  constructor(private http: HttpClient) { }

  shortenUrl(longUrl: string): Observable<any> {
    return this.http.post(this.API_URL + "/shorten", { url: longUrl })
  }

  getUserUrls(): Observable<any> {
    return this.http.get(this.API_URL + "/user/urls")
  }

  deleteUrl(id: string): Observable<any> {
    return this.http.delete(this.API_URL + `/urls/${id}`)
  }

  getUrlStats(shortUrl: string): Observable<any> {
    return this.http.get(this.API_URL + `/stats/${shortUrl}`)
  }
}

