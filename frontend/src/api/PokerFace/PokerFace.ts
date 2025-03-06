import type {AxiosPromise} from 'axios';
import http from '../http';

export default {
  fetchNotices(): AxiosPromise {
    return http.get('poker-face/notices/');
  },
  fetchMainNotice(): AxiosPromise {
    return http.get('poker-face/notices/main/');
  },
  fetchPolls(): AxiosPromise {
    return http.get('poker-face/polls/');
  },
  fetchMainPoll(): AxiosPromise {
    return http.get('poker-face/polls/main/');
  }
}
