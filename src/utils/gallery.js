import { supabase } from '../config/supabase.js';

export class GalleryManager {
  static async uploadImage(file, folder = 'gallery') {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl, path: filePath };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async addGalleryImage(imageData) {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{
          ...imageData,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getGalleryImages() {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteGalleryImage(id) {
    try {
      // Get image path first
      const { data: image } = await supabase
        .from('gallery_images')
        .select('image_path')
        .eq('id', id)
        .single();

      if (image?.image_path) {
        // Delete from storage
        await supabase.storage
          .from('images')
          .remove([image.image_path]);
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}