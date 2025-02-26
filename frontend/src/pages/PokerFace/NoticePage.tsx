import {useEffect, useState} from 'react';
import Notice, {NoticeProps} from '../../components/Notice'
import API from '../../api'

const defaultNotices: NoticeProps[] = [{title: '', content: ''}];

const NoticePage = () => {
  const [notices, setNotices] = useState<NoticeProps[]>(defaultNotices);
  useEffect(() => {
    API.pokerFace.fetchNotices().then(( response) => setNotices(response.data));
  }, []);
  
  return (
    <div className="flex flex-col space-y-4 p-4">
      <h1 className="px-1 font-bold text-2xl mb-2">
        공지
      </h1>
      {notices.length > 0 ? notices.map((notice) => (
        <div>
          <Notice title={notice.title} content={notice.content}/>
        </div>
      )):
        <div>
          <Notice title='공지가 없습니다!' content='이건 공지입니다'/>
        </div>
      }
    </div>
  );
}

export default NoticePage;
