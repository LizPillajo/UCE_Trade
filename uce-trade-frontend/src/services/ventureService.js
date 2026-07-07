import api from './axiosInstance';

// --- PÚBLICO ---
export const fetchFeaturedServices = async () => {
  try {
    const response = await api.get('/ventures/featured');
    return response.data;
  } catch (error) {
    return [];
  }
};

export const fetchServices = async (page = 1, search = '', category = 'All', sort = 'recent') => {
  const pageParam = page - 1; 
  const params = new URLSearchParams();

  params.append('page', pageParam);
  params.append('size', 10);

  if (search) params.append('q', search);
  if (category && category !== 'All') params.append('category', category);
  if (sort) params.append('sort', sort);

  const response = await api.get(`/ventures?${params.toString()}`);
  return response.data;
};

export const fetchServiceById = async (id) => {
  const response = await api.get(`/ventures/${id}`);
  return response.data;
};

export const fetchSuggestions = async (query) => {
  if (!query) return [];
  try {
    const response = await api.get(`/ventures/suggestions?query=${query}`);
    return response.data; 
  } catch (error) {
    return []; // El backend no tiene este endpoint, devolvemos vacío para evitar crashes
  }
};

// --- GESTIÓN ESTUDIANTE (CRUD) ---
export const fetchMyVentures = async () => {
  const response = await api.get('/ventures/my-ventures');
  return response.data;
};

export const createVenture = async (data) => {
    const response = await api.post('/ventures', data);
    return response.data;
};

export const updateVenture = async (id, data) => {
    const response = await api.put(`/ventures/${id}`, data);
    return response.data;
};

export const deleteVenture = async (id) => {
    const response = await api.delete(`/ventures/${id}`);
    return response.data;
};

export const fetchStudentStats = async (period = 'ALL') => {
  // El backend no tiene este endpoint, devolvemos mock temporal para evitar 404
  return {
    kpi: { sales: 0, rating: 0.0, totalEarnings: 0 }
  };
};

export const downloadStudentReport = async (period = 'ALL') => {
    const response = await api.get(`/dashboard/student/report?period=${period}`, {
        responseType: 'blob'
    });
    return response.data;
};

// --- REVIEWS ---
export const fetchReviews = async (ventureId) => {
  const response = await api.get(`/ventures/${ventureId}/reviews`);
  return response.data;
};

export const postReview = async (ventureId, reviewData) => {
  const response = await api.post(`/ventures/${ventureId}/reviews`, reviewData);
  return response.data;
};