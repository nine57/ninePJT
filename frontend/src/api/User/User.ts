import type {AxiosPromise} from 'axios';
import http from '../http';

interface LoginResponse {
  access: string;
  refresh: string;
  next: string;
}

interface LoginPayload {
  username: string;
  password: string;
}

interface SignupPayload {
  username: string;
  password: string;
}

export default {
  login(payload: LoginPayload): AxiosPromise<LoginResponse> {
    return http.post('accounts/login/', payload);
  },
  signup(payload: SignupPayload): AxiosPromise<{ message: string }> {
    return http.post('accounts/signup/', payload);
  },
}
