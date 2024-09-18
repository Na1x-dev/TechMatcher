import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api', // базовый URL вашего API
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Передача токена авторизации
        'Content-Type': 'application/json',
    }
});

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

export { postReq, getReq, putReq, deleteReq };
