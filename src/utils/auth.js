import { supabase } from '../config/supabase.js';

export class AuthManager {
  static async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async checkAdminRole(userId) {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin role:', error);
      return false;
    }
  }

  static redirectToLogin() {
    window.location.href = '/login.html';
  }

  static redirectToDashboard() {
    window.location.href = '/admin.html';
  }
}