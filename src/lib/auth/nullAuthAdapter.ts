import type { AuthAdapter, AuthSession } from "./types";

/** Placeholder adapter — always anonymous until Sprint 2+ auth. */
export const nullAuthAdapter: AuthAdapter = {
  async getSession(): Promise<AuthSession | null> {
    return null;
  },
  async signIn(): Promise<AuthSession> {
    throw new Error("Authentication is not configured in Sprint 1.");
  },
  async signOut(): Promise<void> {
    return;
  },
};
