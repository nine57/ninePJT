import axios, { AxiosInstance } from 'axios';

import handleCustomExceptionError from './Core/Exception';

function initializeAxios(): AxiosInstance {
  const axiosInstance = axios.create({
    xsrfCookieName: 'crm_csrf_token',
    xsrfHeaderName: 'X-CSRFToken',
    baseURL: 'http://127.0.0.1:8000/api', // 기본 API URL 설정
    timeout: 5000, // 요청 제한 시간
    headers: {'Content-Type': 'application/json'},
  });

  // 응답 인터셉터
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      handleCustomExceptionError(error); // 에러 처리
      return Promise.reject(error);
    }
  );

  // 요청 인터셉터 (필요 시 추가)
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token'); // 예제: 토큰 추가
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
}

const apiClient = initializeAxios();

export default apiClient;
