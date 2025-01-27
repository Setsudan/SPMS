import { Component, Inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  email = ""
  password = ""
  error = ""

  constructor(
    @Inject(AuthService) private authService: AuthService,
    private router: Router,
  ) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      () => {
        this.router.navigate(["/shorter"])
      },
      (error) => {
        console.error("Login error:", error)
        this.error = "Invalid email or password"
      },
    )
  }
}

