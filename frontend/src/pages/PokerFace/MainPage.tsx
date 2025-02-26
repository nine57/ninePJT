import {useEffect, useState} from 'react';
import Notice, {NoticeProps} from '../../components/Notice'
import Poll, {PollProps} from '../../components/Poll'
import API from '../../api'

const defaultNotice: NoticeProps = {title: '', content: ''};
const defaultPoll: PollProps = {id: 0, title: '', description: '', num: 0, options: []};

const MainPage = () => {
  const [notice, setNotice] = useState<NoticeProps>(defaultNotice);
  const [poll, setPoll] = useState<PollProps>(defaultPoll);

  useEffect(() => {
    API.pokerFace.fetchNotice().then(( response) => setNotice(response.data));
  }, []);

  useEffect(() => {
    API.pokerFace.fetchPoll().then(( response) => setPoll(response.data));
  }, []);

  return (
    <div className="flex flex-col space-y-4 p-4">
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
