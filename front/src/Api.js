import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        // 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Передача токена авторизации
        'Content-Type': 'application/json',
        // 'content-type': 'multypart/form-data',
    }
});

const addAuthToken = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        apiClient.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers['Authorization']; 
    }
};

addAuthToken();

const postReq = async (endpoint, data) => {
    try {
        const response = await apiClient.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getReq = async (endpoint, config = {}) => {
    try {
        const response = await apiClient.get(endpoint, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const putReq = async (endpoint, data) => {
    try {
        const response = await apiClient.put(endpoint, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteReq = async (endpoint) => {
    try {
        const response = await apiClient.delete(endpoint);
        return response;
    } catch (error) {
        throw error;
    }
};

export { postReq, getReq, putReq, deleteReq, baseURL };
