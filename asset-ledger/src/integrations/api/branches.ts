import apiClient from './client';

export interface Branch {
  id: string;
  name: string;
  location: string | null;
  created_at?: string;
  updated_at?: string;
}

export const getBranches = async (): Promise<Branch[]> => {
  try {
    const response = await apiClient.get('/branches/api');
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const getBranchById = async (id: string): Promise<Branch> => {
  try {
    const response = await apiClient.get(`/branches/api/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching branch ${id}:`, error);
    throw error;
  }
};

export const createBranch = async (branch: Omit<Branch, 'id'>): Promise<Branch> => {
  try {
    const response = await apiClient.post('/branches', branch);
    return response.data;
  } catch (error) {
    console.error('Error creating branch:', error);
    throw error;
  }
};

export const updateBranch = async (id: string, branch: Partial<Branch>): Promise<Branch> => {
  try {
    const response = await apiClient.put(`/branches/${id}`, branch);
    return response.data;
  } catch (error) {
    console.error(`Error updating branch ${id}:`, error);
    throw error;
  }
};

export const deleteBranch = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`/branches/${id}/delete`);
  } catch (error) {
    console.error(`Error deleting branch ${id}:`, error);
    throw error;
  }
};