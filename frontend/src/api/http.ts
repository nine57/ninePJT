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
    console.log('저장된 토큰:', token);  // 토큰 값 확인
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('요청 헤더:', config.headers);  // 헤더 확인
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
    console.log('에러 응답:', error.response?.data);
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log('저장된 리프레시 토큰:', refreshToken);
        
        if (!refreshToken) {
          throw new Error('리프레시 토큰이 없습니다.');
        }

        // 전체 URL을 사용하여 토큰 갱신 시도
        const response = await axios.post('http://127.0.0.1:8000/accounts/token/refresh/', {
          refresh: refreshToken
        });

        console.log('토큰 갱신 응답:', response.data);
        const { access } = response.data;
        
        localStorage.setItem('accessToken', access);
        console.log('새로운 액세스 토큰 저장됨:', localStorage.getItem('accessToken'));
        
        originalRequest.headers.Authorization = `Bearer ${access}`;
        console.log('새 헤더:', originalRequest.headers);
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('토큰 갱신 실패:', refreshError);
        if (refreshError.response) {
          console.error('갱신 에러 응답:', refreshError.response.data);
        }
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
