import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute } from "@angular/router"
import { UrlService } from "../../services/url.service"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

@Component({
  selector: "app-stats",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.scss"],
})
export class StatsComponent implements OnInit {
  stats: any

  constructor(
    private route: ActivatedRoute,
    private urlService: UrlService,
  ) { }

  ngOnInit() {
    const shortUrl = this.route.snapshot.paramMap.get("shortUrl")
    if (shortUrl) {
      this.loadStats(shortUrl)
    }
  }

  loadStats(shortUrl: string) {
    this.urlService.getUrlStats(shortUrl).subscribe(
      (stats) => {
        this.stats = stats
        this.renderChart()
      },
      (error) => {
        console.error("Error loading stats:", error)
      },
    )
  }

  renderChart() {
    const ctx = document.getElementById("clicksChart") as HTMLCanvasElement
    new Chart(ctx, {
      type: "line",
      data: {
        labels: this.stats.clicksOverTime.map((item: any) => item.date),
        datasets: [
          {
            label: "Clicks",
            data: this.stats.clicksOverTime.map((item: any) => item.clicks),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    })
  }
}

