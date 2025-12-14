import { ModalProvider } from "./modal/contexts/ModalProvider";
import Dashboard from "./pages/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Login from "./pages/Login/Login";
import PrivateRoute from "./pages/PrivateRoute/PrivateRoute";
import UserProvider from "./user/context/UserProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  { path: "/login", element: <Login /> },
]);

export default function App() {
  return (
    <UserProvider>
      <ModalProvider>
        <Toaster position="top-right" />

        <RouterProvider router={router} />
      </ModalProvider>
    </UserProvider>
  );
}
