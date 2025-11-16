import apiClient from './client';

export interface AssetCategory {
  id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
}

export const getCategories = async (): Promise<AssetCategory[]> => {
  try {
    const response = await apiClient.get('/categories/api');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getCategoryById = async (id: string): Promise<AssetCategory> => {
  try {
    const response = await apiClient.get(`/categories/api/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    throw error;
  }
};

export const createCategory = async (category: Omit<AssetCategory, 'id'>): Promise<AssetCategory> => {
  try {
    const response = await apiClient.post('/categories', category);
    return response.data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

export const updateCategory = async (id: string, category: Partial<AssetCategory>): Promise<AssetCategory> => {
  try {
    const response = await apiClient.put(`/categories/${id}`, category);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw error;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`/categories/${id}/delete`);
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    throw error;
  }
};