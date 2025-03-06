import Notice, {NoticeProps} from '../../components/Notice'
import Poll, {PollProps} from '../../components/Poll'
import {useEffect, useState} from 'react';

import API from '../../api'
import axios from 'axios';

const defaultNotice: NoticeProps = {title: '', content: ''};
const defaultPoll: PollProps = {id: 0, title: '', description: '', num: 0, options: []};

const MainPage = () => {
  console.log('MainPage 렌더링');
  const [notice, setNotice] = useState<NoticeProps>(defaultNotice);
  const [poll, setPoll] = useState<PollProps>(defaultPoll);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [noticeResponse, pollResponse] = await Promise.all([
          API.pokerFace.fetchMainNotice(),
          API.pokerFace.fetchMainPoll()
        ]);
        setNotice(noticeResponse.data);
        setPoll(pollResponse.data);
        setError(null);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            window.location.href = '/login';
          } else if (err.response?.data?.code === 'token_not_valid') {
            setError('인증이 만료되었습니다. 다시 로그인해주세요.');
          } else {
            setError('데이터를 불러오는 중 오류가 발생했습니다.');
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col space-y-4 p-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      <section>
        <Notice
          title={notice.title}
          content={notice.content}
        />
      </section>
      <section>
        <Poll
          id={poll.id}
          title={poll.title}
          description={poll.description}
          num={poll.num}
          options={poll.options}
        />
      </section>
    </div>
  );
};

export default MainPage;
