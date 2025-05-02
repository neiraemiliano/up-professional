// src/context/AuthContext.jsx
import React, { createContext, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import * as authAPI from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initialized, setInitialized] = useState(false);
  // === Login ===
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    },
  });

  // === Register (si quieres auto-login tras registro) ===
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: async ({ token, user }) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    },
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedToken && storedUser) {
      authAPI.setToken(storedToken);
      setUser(storedUser);
    }
    setInitialized(true);
  }, []);

  // Exponer mutateAsync para poder await
  const login = async (creds) => loginMutation.mutateAsync(creds);
  const register = async (data) => registerMutation.mutateAsync(data);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    authAPI.clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        initialized,
        login,
        logout,
        register,
        loginLoading: loginMutation.isLoading,
        loginError: loginMutation.error,
        registerLoading: registerMutation.isLoading,
        registerError: registerMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
