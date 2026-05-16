import axios from 'axios';

const api = axios.create({
  baseURL: "https://bidarena.onrender.com/api",
  withCredentials: true,
  },
);

export default api;