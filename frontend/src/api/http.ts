import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // 서버의 기본 URL
  timeout: 5000, // 요청 제한 시간
  headers: {'Content-Type': 'application/json'}, // 기본 헤더 설정
});

// 요청 인터셉터 (예: 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 필요한 경우 인증 토큰을 헤더에 추가
    const token = localStorage.getItem('token'); // 예제: localStorage에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 (예: 오류 처리)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 요청 오류:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
