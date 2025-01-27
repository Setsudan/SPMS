import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { UrlService } from "../../services/url.service"

@Component({
  selector: "app-shorter",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./shorter.component.html",
  styleUrls: ["./shorter.component.scss"],
})
export class ShorterComponent implements OnInit {
  urls: any[] = []

  constructor(private urlService: UrlService) { }

  ngOnInit() {
    this.loadUrls()
  }

  loadUrls() {
    this.urlService.getUserUrls().subscribe({
      next: (urls) => {
        this.urls = urls
      },
      error: (error) => {
        console.error("Error loading URLs:", error)
      }
    })
  }

  deleteUrl(id: string) {
    this.urlService.deleteUrl(id).subscribe({
      next: () => {
        this.urls = this.urls.filter((url) => url.id !== id)
      },
      error: (error) => {
        console.error("Error deleting URL:", error)
      }
    })
  }
}

