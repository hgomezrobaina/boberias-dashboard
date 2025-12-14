import { UserContext } from "@/user/context/user-context";
import { useContext } from "react";
import { Navigate } from "react-router";

interface Props {
  children?: React.ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { loading, user } = useContext(UserContext);

  if (loading) {
    return <div>Cargando...</div>; // O tu componente de loading
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
