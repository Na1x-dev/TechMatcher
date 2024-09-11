// import axios from 'axios';

// const apiClient = axios.create({
//     baseURL: 'http://localhost:8000/api', // базовый URL вашего API
//     headers: {
//         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Передача токена авторизации
//         'Content-Type': 'application/json',
//     }
// });

// // Общий метод для выполнения POST-запросов
// const postReq= async (endpoint, data) => {
//     try {
//         const response = await apiClient.post(endpoint, data);
//         return response.data;
//     } catch (error) {
//         throw error; // выбрасываем ошибку для обработки в вызывающем коде
//     }
// };

// // Общий метод для выполнения GET-запросов
// const getReq = async (endpoint, config = {}) => {
//     try {
//         const response = await apiClient.get(endpoint, config);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };


// // Общий метод для выполнения PUT-запросов (обновление)
// const putReq = async (endpoint, data) => {
//     try {
//         const response = await apiClient.put(endpoint, data);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };

// // Общий метод для выполнения DELETE-запросов
// const deleteReq = async (endpoint) => {
//     try {
//         const response = await apiClient.delete(endpoint);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

// // Экспортируем методы
// export { postReq, getReq, putReq, deleteReq };
