import { supabase } from "@/lib/supabase";
import { type User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate } from "react-router";

interface Props {
  children?: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  if (loading) {
    return <div>Cargando...</div>; // O tu componente de loading
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
