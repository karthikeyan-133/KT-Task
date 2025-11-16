import apiClient from './client';

export interface AssetTransaction {
  id: string;
  asset_id: string;
  transaction_type: 'issue' | 'return' | 'scrap';
  employee_id: string | null;
  branch_id: string;
  transaction_date: string;
  notes: string | null;
  metadata: any | null;
  created_at?: string;
  Asset?: { asset_code: string; name: string };
  Employee?: { full_name: string };
  Branch?: { name: string };
}

export const getTransactions = async (): Promise<AssetTransaction[]> => {
  try {
    const response = await apiClient.get('/transactions/api');
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const issueAsset = async (data: {
  asset_id: string;
  employee_id: string;
  branch_id: string;
  notes?: string;
}): Promise<AssetTransaction> => {
  try {
    const response = await apiClient.post('/transactions/issue', data);
    return response.data;
  } catch (error) {
    console.error('Error issuing asset:', error);
    throw error;
  }
};

export const returnAsset = async (data: {
  asset_id: string;
  notes?: string;
}): Promise<AssetTransaction> => {
  try {
    const response = await apiClient.post('/transactions/return', data);
    return response.data;
  } catch (error) {
    console.error('Error returning asset:', error);
    throw error;
  }
};

export const scrapAsset = async (data: {
  asset_id: string;
  notes?: string;
}): Promise<AssetTransaction> => {
  try {
    const response = await apiClient.post('/transactions/scrap', data);
    return response.data;
  } catch (error) {
    console.error('Error scrapping asset:', error);
    throw error;
  }
};