import Notice, {NoticeProps} from '../../components/Notice'
import Poll, {PollProps} from '../../components/Poll'
import {useEffect, useState} from 'react';

import API from '../../api'

const defaultNotice: NoticeProps = {title: '', content: ''};
const defaultPoll: PollProps = {id: 0, title: '', description: '', num: 0, options: [], onVote: () => {} };

const MainPage = () => {
  console.log('MainPage 렌더링');
  const [notice, setNotice] = useState<NoticeProps>(defaultNotice);
  const [poll, setPoll] = useState<PollProps>(defaultPoll);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = () => {
    setIsLoading(true);
    API.pokerFace.fetchMainNotice()
      .then((noticeResponse) => {
        setNotice(noticeResponse.data);
        setError(null);
      })
      .catch((error) => {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  };

  const fetchPollData = () => {
    API.pokerFace.fetchMainPoll()
      .then((pollResponse) => {
        setPoll(pollResponse.data);
        setError(null);
      })
      .catch((err) => {
        setError('투표 데이터를 불러오는 중 오류가 발생했습니다.');
        console.error('투표 데이터 에러:', err);
      });
  };

  useEffect(() => {
    fetchData();
    fetchPollData();
  }, []);

  const handleVote = (optionId: number) => {
    API.pokerFace.vote(poll.id, optionId)
      .then(() => {
        fetchPollData();
        setError(null);
  })
      .catch((err) => {
        setError('투표 중 오류가 발생했습니다.');
        console.error('투표 에러:', err);
      });
  };

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
      { isLoading ? (
        <div className="flex justify-center items-center h-screen">로딩 중...</div>
      ) : (
        <>
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
              onVote={handleVote}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default MainPage;
