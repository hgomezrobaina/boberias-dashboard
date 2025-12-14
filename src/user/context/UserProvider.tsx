import { supabase } from "@/lib/supabase";
import { UserContext } from "./user-context";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { USER_ROLE } from "@/lib/user-role";

interface Props {
  children?: React.ReactNode;
}

export default function UserProvider({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<USER_ROLE | null>(null);

  useEffect(() => {
    if (user !== null) {
      supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const profile = res.data[0];

            setRole(profile.role);
          }
        });
    }
  }, [user]);

  useEffect(() => {
    // Verificar sesión actual
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // Escuchar cambios en la autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ loading: loading, user: user, role: role }}>
      {children}
    </UserContext.Provider>
  );
}
