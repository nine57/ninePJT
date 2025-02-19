import {ReactElement} from 'react';

export interface NoticeProps {
  title: string;
  content: string;
}

const Notice = ({title, content}: NoticeProps): ReactElement => (
  <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
    <h1 className="text-sm mb-2">📌 공지</h1>
    <h2 className="px-1 font-bold text-xl mb-2">{title}</h2>
    {content.length > 0 && <p className="px-1">{content}</p>}
  </div>
);

export default Notice;