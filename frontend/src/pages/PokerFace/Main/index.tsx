import './index.css';

import AlbumList from '../../../components/Album/List';
import ContentSection from '../../../components/ContentSection';
import TabMenu from '../../../components/TabMenu';
import { useState } from 'react';
import Title from "../../../components/Title";

const PokerFaceMain = () => {
  const [selectedTab, setSelectedTab] = useState('공지사항');
  const tabs = ['공지사항', '갤러리', '회비 관리', '22’ Poker Face 하계 모임'];

  return (
    <div className="container">
      <Title
        title="Poker Face"
        coverImage="your-cover-image-url.jpg"
      />
      <TabMenu tabs={tabs} onSelect={setSelectedTab} />
      {selectedTab === '공지사항' && (
        <ContentSection title="공지사항">
          <p>사진 추가, 수정, 삭제 등 문의는 말해주세요!</p>
        </ContentSection>
      )}
      {selectedTab === '갤러리' && (
        <ContentSection title="갤러리">
          <p>사진 갤러리 영역</p>
          <h1 style={{ color: 'white', textAlign: 'center' }}>:: Poker Face 앨범</h1>
          <AlbumList />
        </ContentSection>
      )}
    </div>
  );
};

export default PokerFaceMain;
