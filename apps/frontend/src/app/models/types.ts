export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  face?: string;
  grade?: Grade;
  socialLinks?: SocialLink[];
  skills?: UserSkill[];
}

export interface Grade {
  id: string;
  name: string;
  graduationYear: string;
}

export interface SocialLink {
  type: string;
  url: string;
}

export interface Skill {
  id: string;
  name: string;
  description?: string;
}

export interface UserSkill {
  skill: Skill;
  ability: number; // 0 to 5
}

export interface AuthResponse {
  access_token?: string;
  statusCode?: number;
  message?: string;
  error?: string;
}
