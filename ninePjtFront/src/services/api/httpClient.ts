import { API_BASE_URL } from '../../constants/api';
import { apiRequest } from '../../utils/api';

type Primitive = string | number | boolean | undefined | null;

type RequestParams = Record<string, Primitive | Primitive[]>;

interface RequestOptions extends Omit<RequestInit, 'method'> {
  params?: RequestParams;
}

const buildUrl = (path: string, params?: RequestParams) => {
  if (!params) {
    return `${API_BASE_URL}${path}`;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry !== undefined && entry !== null) {
          searchParams.append(key, String(entry));
        }
      });
    } else if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ''}`;
};

const createRequest = (method: string) => {
  return async <T>(path: string, options: RequestOptions = {}) => {
    const { params, ...rest } = options;
    const url = buildUrl(path, params);
    return apiRequest<T>(url, {
      ...rest,
      method,
    });
  };
};

export const httpClient = {
  get: createRequest('GET'),
  post: createRequest('POST'),
  put: createRequest('PUT'),
  patch: createRequest('PATCH'),
  delete: createRequest('DELETE'),
};


