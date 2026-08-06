import { createStore } from "./createStore";

export interface UserState {
  /** Null until auth layer is connected (Sprint 1 prepares only). */
  userId: string | null;
  email: string | null;
  plan: "anonymous" | "free" | "pro" | "team";
  isAuthenticated: boolean;
}

const initial: UserState = {
  userId: null,
  email: null,
  plan: "anonymous",
  isAuthenticated: false,
};

export const userStore = createStore<UserState>(initial);

export const userActions = {
  setAnonymous(): void {
    userStore.replace({ ...initial });
  },
  /** Placeholder for future auth session hydration. */
  hydrateSession(session: Partial<UserState>): void {
    userStore.setState({
      ...session,
      isAuthenticated: Boolean(session.userId),
      plan: session.plan ?? "free",
    });
  },
};
