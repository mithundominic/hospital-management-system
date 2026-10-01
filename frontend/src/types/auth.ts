// Responsibility: Type definitions for authentication context

import type { User, Session } from "@supabase/supabase-js";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ user: User; session: Session } | void>;
  signUp: (email: string, password: string) => Promise<User | null>;
  signOut: () => Promise<void>;
}
