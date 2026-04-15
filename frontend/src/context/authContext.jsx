import { createContext, useEffect, useState } from "react";
import { auth } from "../services/api";
import { useAuthChannel, sendLogout } from "../hooks/useAuthChannel";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await auth.refresh();
        const userData = res.user || JSON.parse(localStorage.getItem("user"));

        localStorage.setItem("token", res.accessToken);

        if (!userData) {
          throw new Error("No user data");
        }

        const normalizedUser = {
          ...userData,
          role: userData.role || userData.rol
        };

        localStorage.setItem("user", JSON.stringify(normalizedUser));
        setUser(normalizedUser);
      } catch (error) {
        console.error("Sesion invalida:", error);
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);

    const normalizedUser = {
      ...data.user,
      role: data.user.role || data.user.rol
    };

    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch {
      // noop
    }

    localStorage.setItem("logoutMessage", "Sesion cerrada correctamente");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setUser(null);
    sendLogout();
  };

  useAuthChannel(
    () => {
      localStorage.clear();
      setUser(null);
    },
    () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    }
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
