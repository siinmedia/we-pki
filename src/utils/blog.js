import { supabase } from '../config/supabase.js';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import slugify from 'slugify';

export class BlogManager {
  static async createArticle(articleData) {
    try {
      const slug = slugify(articleData.title, { lower: true, strict: true });
      
      const { data, error } = await supabase
        .from('articles')
        .insert([{
          ...articleData,
          slug,
          content_html: DOMPurify.sanitize(marked(articleData.content)),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateArticle(id, articleData) {
    try {
      const slug = slugify(articleData.title, { lower: true, strict: true });
      
      const { data, error } = await supabase
        .from('articles')
        .update({
          ...articleData,
          slug,
          content_html: DOMPurify.sanitize(marked(articleData.content)),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteArticle(id) {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getArticles(limit = 10, offset = 0) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getArticleBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getAllArticlesForAdmin() {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}