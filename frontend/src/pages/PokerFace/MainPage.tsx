import Notice, {NoticeProps} from '../../components/Notice'
import PollCard, {Poll} from '../../components/Poll'
import {useEffect, useState} from 'react';

import API from '../../api'

const defaultNotice: NoticeProps = {title: '', content: ''};
const defaultPoll: Poll = {
  id: 0,
  title: '',
  description: '',
  voteCount: 0,
  options: [],
  isVoted: false,
};

const MainPage = () => {
  const [notice, setNotice] = useState<NoticeProps>(defaultNotice);
  const [poll, setPoll] = useState<Poll>(defaultPoll);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNoticeData = () => {
    setIsLoading(true);
    API.pokerFace.fetchMainNotice()
      .then((noticeResponse) => {
        setNotice(noticeResponse.data);
        setError(null);
      })
      .catch((err) => {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.log(err);
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
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      });
  };

  useEffect(() => {
    fetchNoticeData();
    fetchPollData();
  }, []);

  const handleVote = (optionIds: number[]) => {
    API.pokerFace.vote(poll.id, optionIds)
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
            <Notice title={notice.title} content={notice.content} />
          </section>
          <section>
            <PollCard poll={poll} onVote={handleVote} />
          </section>
        </>
      )}
    </div>
  );
};

export default MainPage;
