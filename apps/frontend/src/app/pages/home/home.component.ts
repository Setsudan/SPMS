import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { UrlService } from "../../services/url.service"
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  longUrl = ""
  shortUrl = ""
  recentUrls: any[] = []
  isAuthenticated: boolean

  constructor(
    private urlService: UrlService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.isAuthenticated = this.authService.isAuthenticated()
    console.log("HomeComponent constructor executed!");
  }

  ngOnInit() {
    console.log("HomeComponent initialized!");
  }

  shortenUrl() {
    this.urlService.shortenUrl(this.longUrl).subscribe(
      (response) => {
        this.shortUrl = response.shortUrl
        this.addToRecentUrls(response)
      },
      (error) => {
        console.error("Error shortening URL:", error)
      },
    )
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.shortUrl).then(() => {
      // Optionally, you can show a "Copied!" message here
    })
  }

  addToRecentUrls(url: any) {
    this.recentUrls.unshift(url)
    if (this.recentUrls.length > 5) {
      this.recentUrls.pop()
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path])
  }
}

