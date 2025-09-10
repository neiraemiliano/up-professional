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
    onSuccess: (response) => {
      // Manejar diferentes estructuras de respuesta
      let token, user;
      if (response.data) {
        // Si viene envuelto en { data: { token, user } }
        token = response.data.token;
        user = response.data.user;
      } else {
        // Si viene directo como { token, user }
        token = response.token;
        user = response.user;
      }

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        authAPI.setToken(token);
        setUser(user);
      } else {
        console.error("Invalid response structure:", response);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  // === Register (si quieres auto-login tras registro) ===
  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      // Manejar diferentes estructuras de respuesta
      let token, user, requiresOnboarding;
      if (response.data) {
        // Si viene envuelto en { data: { token, user, requiresOnboarding } }
        token = response.data.token;
        user = response.data.user;
        requiresOnboarding = response.data.requiresOnboarding;
      } else {
        // Si viene directo como { token, user, requiresOnboarding }
        token = response.token;
        user = response.user;
        requiresOnboarding = response.requiresOnboarding;
      }

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        authAPI.setToken(token);
        setUser(user);

        // Store onboarding flag for professionals
        if (requiresOnboarding) {
          localStorage.setItem("requiresOnboarding", "true");
        }
      } else {
        console.error("Invalid register response structure:", response);
      }
    },
    onError: (error) => {
      console.error("Register error:", error);
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
  const login = async (creds) => {
    try {
      return await loginMutation.mutateAsync(creds);
    } catch (error) {
      // Re-throw con estructura consistente
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Error de autenticación";
      throw new Error(errorMessage);
    }
  };

  const register = async (data) => {
    try {
      return await registerMutation.mutateAsync(data);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Error de registro";
      throw new Error(errorMessage);
    }
  };
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
