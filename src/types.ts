export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: Preferences;
}

export interface Preferences {
  complexity: string[];
  spice: string[];
  dietary: string[];
  cuisine: string[];
  meal: string[];
  [key: string]: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: string;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  isSaved?: boolean;
  generatedFrom?: string[];
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  register: (email: string, password: string, name: string) => Promise<AuthResult>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
}

export interface PreferenceCategory {
  key: string;
  label: string;
  icon: string;
  options: string[];
}
