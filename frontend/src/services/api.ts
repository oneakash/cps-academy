import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;
console.log("API_URL:", API_URL); 

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  async login(identifier: string, password: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Authentication failed");
    }

    return {
      user: data.user,
      jwt: data.jwt,
    };
  },
  async register(username: string, email: string, password: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Registration failed");
    }

    return {
      user: data.user,
      jwt: data.jwt,
    };
  },

  async forgotPassword(email: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to send reset email");
    }

    return data;
  },

  async resetPassword(code: string, password: string, passwordConfirmation: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, password, passwordConfirmation }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "Failed to reset password");
    }

    return data;
  },
};

export const coursesAPI = {
  getAll: (url: string) => api.get("/api/courses?populate=*"),
  getOne: (id: string) => api.get(`/api/courses/${id}?populate=*`),
};

export default api;
