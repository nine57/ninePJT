import type {AxiosPromise} from 'axios';
import http from '../http';

interface LoginResponse {
  access: string;
  refresh: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

export default {
  login(payload: LoginPayload): AxiosPromise<LoginResponse> {
    return http.post('accounts/login/', payload);
  },
}
