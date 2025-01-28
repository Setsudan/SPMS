export class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    class: string;
}

export class LoginDto {
  email: string;
  password: string;
}
