import { createContext, useState } from "react";
import type { User } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logIn: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logOut: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const value = localStorage.getItem("user");
      if (value) {
        return JSON.parse(value) as User;
      }
      return null;
    } catch (error) {
      console.error("Error reading stored user:", error);
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const value = localStorage.getItem("token");
      return value ?? null;
    } catch (error) {
      console.error("Error reading stored token:", error);
      return null;
    }
  });

  const saveAuth = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const logIn = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Login failed");
      }

      const data = await res.json();
      saveAuth(data.token, data.user);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Registration failed");
      }

      const data = await res.json();
      saveAuth(data.token, data.user);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const logOut = () => {
    clearAuth();
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logIn, register, logOut, token, setToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}