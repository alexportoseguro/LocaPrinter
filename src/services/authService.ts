import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization_id: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData extends LoginCredentials {
  name: string;
  organization_id: string;
}

class AuthService {
  async login({ email, password }: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signUp({ email, password, name, organization_id }: SignUpData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          organization_id,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async logout() {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw new Error(error.message);
    }
  }

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return user;
  }

  async updateProfile(updates: Partial<User>) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw new Error(error.message);
    }
  }

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
