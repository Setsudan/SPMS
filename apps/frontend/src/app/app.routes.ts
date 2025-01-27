import type { Routes } from "@angular/router"
import { authGuard } from "./guards/auth.guard"
import { RegisterComponent } from "./pages/register/register.component"
import { StatsComponent } from "./pages/stats/stats.component"
import { HomeComponent } from "./pages/home/home.component"
import { LoginComponent } from "./pages/login/login.component"

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "shorter",
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: "stats/:shortUrl",
    component: StatsComponent,
    canActivate: [authGuard],
  },
  {
    path: "**", redirectTo: "",
  }
]

