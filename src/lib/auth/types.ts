/**
 * Authentication layer preparation (Sprint 1).
 * No provider wired yet — interfaces only.
 */
export type AuthPlan = "anonymous" | "free" | "pro" | "team";

export interface AuthSession {
  userId: string;
  email: string;
  plan: AuthPlan;
  expiresAt?: string;
}

export interface AuthAdapter {
  getSession(): Promise<AuthSession | null>;
  signIn(email: string): Promise<AuthSession>;
  signOut(): Promise<void>;
}
