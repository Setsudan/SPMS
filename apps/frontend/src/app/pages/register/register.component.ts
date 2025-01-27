import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router } from "@angular/router"
import { AuthService } from "../../services/auth.service"
import { switchMap } from "rxjs"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent {
  email = ""
  password = ""
  confirmPassword = ""
  error = ""

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      console.error("Passwords do not match")
      this.error = "Passwords do not match"
      return
    }

    this.authService.register(this.email, this.password).pipe(
      switchMap(() => this.authService.login(this.email, this.password))
    ).subscribe({
      next: () => {
        this.router.navigate(["/shorter"]);
      },
      error: (error) => {
        console.error("Error during registration or login:", error);
        this.error = "An error occurred during registration or login";
      }
    });
  }
}

