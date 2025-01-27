import { inject } from "@angular/core"
import { type CanActivateFn, Router } from "@angular/router"
import { AuthService } from "../services/auth.service"

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log("🔍 Checking authentication in Auth Guard...");

  if (authService.isAuthenticated()) {
    console.log("✅ User is authenticated, allowing access.");
    return true;
  }

  console.log("🚫 User is not authenticated, redirecting to login.");
  router.navigate(["/login"]);  // Force redirect
  return false;
};

