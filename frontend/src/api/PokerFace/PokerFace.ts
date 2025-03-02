import type {AxiosPromise} from 'axios';

import http from '../http';

export default {
  login(payload: object): AxiosPromise {
    return http.post('/login/', payload);
  },
  fetchNotices(): AxiosPromise {
    return http.get('/poker-face/notices/');
  },
  fetchMainNotice(): AxiosPromise {
    return http.get('/poker-face/notices/main/');
  },
  fetchPolls(): AxiosPromise {
    return http.get('/poker-face/polls/');
  },
  fetchMainPoll(): AxiosPromise {
    return http.get('/poker-face/polls/main/');
  }
}