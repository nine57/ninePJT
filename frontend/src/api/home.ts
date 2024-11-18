import apiClient from './http';

// 예제 데이터 가져오기
export const fetchExampleData = async () => {
  const response = await apiClient.get('/');
  return response.data;
};

// 새로운 데이터 생성
export const createExampleData = async (payload: { name: string }) => {
  const response = await apiClient.post('/', payload);
  return response.data;
};
