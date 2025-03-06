import axios, {AxiosInstance} from 'axios';

function initializeAxios(): AxiosInstance {
  return axios.create({
    baseURL: 'http://127.0.0.1:8000/',  // API 경로 수정
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const axiosInstance = initializeAxios();

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('리프레시 토큰이 없습니다.');
        }
        const response = await axios.post('http://127.0.0.1:8000/accounts/token/refresh/', {
          refresh: refreshToken
        });
        const { access } = response.data;
        localStorage.setItem('accessToken', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
