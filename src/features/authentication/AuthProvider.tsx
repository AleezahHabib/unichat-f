"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getMe, login as apiLogin, signup as apiSignup, User, LoginRequest, RegisterRequest } from "./api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest, redirectTo?: string) => Promise<void>;
  signup: (data: RegisterRequest, redirectTo?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    async function initAuth() {
      const token = localStorage.getItem("unichat_token");
      if (token) {
        try {
          const currentUser = await getMe();
          setUser(currentUser);
        } catch {
          localStorage.removeItem("unichat_token");
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    initAuth();
  }, []);

  const handleLogin = useCallback(async (data: LoginRequest, redirectTo?: string) => {
    const response = await apiLogin(data);
    localStorage.setItem("unichat_token", response.access_token);
    setUser(response.user);
    router.push(redirectTo || "/workspaces");
  }, [router]);

  const handleSignup = useCallback(async (data: RegisterRequest, redirectTo?: string) => {
    const response = await apiSignup(data);
    localStorage.setItem("unichat_token", response.access_token);
    setUser(response.user);
    router.push(redirectTo || "/workspaces");
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("unichat_token");
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
