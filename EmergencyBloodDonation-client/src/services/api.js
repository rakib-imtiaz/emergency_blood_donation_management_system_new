import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = {
    // Donor services
    getAllDonors: () => axios.get(`${API_URL}/donors`),
    createDonor: (donorData) => axios.post(`${API_URL}/donors`, donorData),
    getDonorById: (id) => axios.get(`${API_URL}/donors/${id}`),

    // Request services
    getAllRequests: () => axios.get(`${API_URL}/requests`),
    createRequest: (requestData) => axios.post(`${API_URL}/requests`, requestData)
};

export const requestBlood = async (requestData) => {
  try {
    const response = await axios.post(`${API_URL}/requests`, requestData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/requests`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
