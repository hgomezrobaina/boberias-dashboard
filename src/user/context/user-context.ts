import type { USER_ROLE } from "@/lib/user-role";
import type { User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface UserContextProps {
  user: User | null;
  loading: boolean;
  role: USER_ROLE | null;
}

export const UserContext = createContext<UserContextProps>({
  loading: false,
  user: null,
} as UserContextProps);
