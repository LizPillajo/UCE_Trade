import api from './axiosInstance';

export const fetchAdminStats = async (period = 'ALL') => {
  const response = await api.get(`/admin/stats?period=${period}`);
  return response.data;
};

export const fetchAdminUsers = async (page = 1, size = 10) => {
    const response = await api.get(`/admin/users?page=${page - 1}&size=${size}`);
    return response.data;
};

export const deleteAdminUser = async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};

export const exportUsersReport = async () => {
    const response = await api.get('/admin/export/users', { responseType: 'blob' });
    return response.data;
};

export const exportVenturesReport = async () => {
  const response = await api.get('/admin/export/ventures', { responseType: 'blob' });
  return response.data;
};

export const updateVentureStatus = async (id, status) => {
    const response = await api.put(`/admin/ventures/${id}/status`, { status });
    return response.data;
};

export const fetchAdminVentures = async (page = 1, search = '', category = 'All', sort = 'status') => {
  const pageParam = page - 1;
  const params = new URLSearchParams();

  params.append('page', pageParam);
  params.append('size', 10); 
  params.append('sort', sort);

  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);

  const response = await api.get(`/admin/ventures?${params.toString()}`);
  return response.data;
};