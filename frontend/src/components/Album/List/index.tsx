import './index.css';

import AlbumCard from '../Card';

const albumData = [
  {
    image: 'https://via.placeholder.com/300x200',
    title: '용인 에버랜드, 캐러밴',
    description: '에버랜드에서의 즐거운 하루!',
    icon: '📂',
  },
  {
    image: 'https://via.placeholder.com/300x200',
    title: '보모 청담',
    description: '청담에서의 소중한 추억',
    icon: '📷',
  },
  {
    image: 'https://via.placeholder.com/300x200',
    title: '단양',
    description: '단양의 아름다운 풍경',
    icon: '🔥',
  },
  {
    image: 'https://via.placeholder.com/300x200',
    title: '부산',
    description: '부산 해변에서의 추억!',
    icon: '🏖️',
  },
];

const AlbumList = () => {
  return (
    <div className="album-list">
      {albumData.map((album, index) => (
        <AlbumCard
          key={index}
          image={album.image}
          title={album.title}
          description={album.description}
          icon={album.icon}
        />
      ))}
    </div>
  );
};

export default AlbumList;
