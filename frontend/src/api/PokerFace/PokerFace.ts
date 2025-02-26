import type {AxiosPromise} from 'axios';

import http from '../http';

export default {
  fetchNotices(): AxiosPromise {
    return http.get('/poker-face/notices/');
  },
  fetchNotice(): AxiosPromise {
    return http.get('/poker-face/notice/');
  },
  fetchPoll(): AxiosPromise {
    return http.get('/poker-face/poll/');
  }
}