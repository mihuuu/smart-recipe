import type { User, Recipe, Preferences } from '../types';

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
  ? "http://localhost:3001/api"
  : "https://recipe-app-backend-oeyz.onrender.com/api";

const getToken = (): string | null => {
  return localStorage.getItem("authToken");
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data as T;
};

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

const makeRequest = async <T>(url: string, options: RequestOptions = {}): Promise<T> => {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  return handleResponse<T>(response);
};

interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export const authAPI = {
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const data = await makeRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    });

    if (data.success && data.data.token) {
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await makeRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.success && data.data.token) {
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data;
  },

  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  },

  async getMe(): Promise<{ success: boolean; data: User }> {
    return makeRequest("/auth/me");
  },

  isAuthenticated(): boolean {
    return !!getToken();
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    return userStr ? (JSON.parse(userStr) as User) : null;
  },
};

export const recipeAPI = {
  async generateRecipes(ingredients: string): Promise<Recipe[]> {
    const data = await makeRequest<{ success: boolean; data: Recipe[] }>("/recipes/generate", {
      method: "POST",
      body: JSON.stringify({ ingredients }),
    });

    return data.data;
  },

  async getSavedRecipes(): Promise<Recipe[]> {
    const data = await makeRequest<{ success: boolean; data: Recipe[] }>("/recipes/saved");
    return data.data;
  },

  async getPublicRecipes(): Promise<Recipe[]> {
    const data = await makeRequest<{ success: boolean; data: Recipe[] }>("/recipes/public/all");
    return data.data;
  },

  async getRecipe(recipeId: string): Promise<Recipe> {
    const data = await makeRequest<{ success: boolean; data: Recipe }>(`/recipes/${recipeId}`);
    return data.data;
  },

  async saveRecipe(recipe: Recipe): Promise<Recipe> {
    const data = await makeRequest<{ success: boolean; data: Recipe }>("/recipes/save", {
      method: "POST",
      body: JSON.stringify(recipe),
    });

    return data.data;
  },

  async deleteRecipe(recipeId: string): Promise<{ success: boolean }> {
    return makeRequest(`/recipes/${recipeId}`, {
      method: "DELETE",
    });
  },
};

export const preferencesAPI = {
  async getPreferences(): Promise<Preferences> {
    const data = await makeRequest<{ success: boolean; data: Preferences }>("/preferences");
    return data.data;
  },

  async updatePreferences(preferences: Preferences): Promise<Preferences> {
    const data = await makeRequest<{ success: boolean; data: Preferences }>("/preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });

    return data.data;
  },

  async resetPreferences(): Promise<Preferences> {
    const data = await makeRequest<{ success: boolean; data: Preferences }>("/preferences/reset", {
      method: "POST",
    });

    return data.data;
  },
};
