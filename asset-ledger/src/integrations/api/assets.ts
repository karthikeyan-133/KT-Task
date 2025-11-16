import apiClient from './client';

export interface Asset {
  id: string;
  asset_code: string;
  name: string;
  category_id: string;
  branch_id: string;
  purchase_date: string | null;
  purchase_value: number | null;
  current_value: number | null;
  status: 'stock' | 'issued' | 'scrapped';
  issued_to: string | null;
  issued_at: string | null;
  specifications: any | null;
  created_at?: string;
  updated_at?: string;
  AssetCategory?: { name: string };
  Branch?: { name: string };
  Employee?: { full_name: string };
}

export const getAssets = async (): Promise<Asset[]> => {
  try {
    const response = await apiClient.get('/assets/api');
    return response.data;
  } catch (error) {
    console.error('Error fetching assets:', error);
    throw error;
  }
};

export const getAssetById = async (id: string): Promise<Asset> => {
  try {
    const response = await apiClient.get(`/assets/api/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching asset ${id}:`, error);
    throw error;
  }
};

export const createAsset = async (asset: Omit<Asset, 'id'>): Promise<Asset> => {
  try {
    const response = await apiClient.post('/assets', asset);
    return response.data;
  } catch (error) {
    console.error('Error creating asset:', error);
    throw error;
  }
};

export const updateAsset = async (id: string, asset: Partial<Asset>): Promise<Asset> => {
  try {
    const response = await apiClient.put(`/assets/${id}`, asset);
    return response.data;
  } catch (error) {
    console.error(`Error updating asset ${id}:`, error);
    throw error;
  }
};

export const deleteAsset = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`/assets/${id}/delete`);
  } catch (error) {
    console.error(`Error deleting asset ${id}:`, error);
    throw error;
  }
};