import apiClient from './client';

export interface Employee {
  id: string;
  employee_code: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  department: string | null;
  branch_id: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  Branch?: { name: string };
}

export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await apiClient.get('/employees/api');
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const getEmployeeById = async (id: string): Promise<Employee> => {
  try {
    const response = await apiClient.get(`/employees/api/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching employee ${id}:`, error);
    throw error;
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  try {
    const response = await apiClient.post('/employees', employee);
    return response.data;
  } catch (error) {
    console.error('Error creating employee:', error);
    throw error;
  }
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  try {
    const response = await apiClient.put(`/employees/${id}`, employee);
    return response.data;
  } catch (error) {
    console.error(`Error updating employee ${id}:`, error);
    throw error;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await apiClient.post(`/employees/${id}/delete`);
  } catch (error) {
    console.error(`Error deleting employee ${id}:`, error);
    throw error;
  }
};