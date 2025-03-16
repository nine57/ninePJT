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
  },
  vote(pollId: number, optionIds: number[]): AxiosPromise<{ message: string }> {
    return http.post(`poker-face/polls/${pollId}/vote/`, { optionIds });
  }
}
