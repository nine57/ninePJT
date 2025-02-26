import AlbumList from '../../components/Album/List';

const GalleryPage = () => {

  return (
    <div className="flex flex-col p-4">
      <p>갤러리 영역</p>
      <h1 style={{color: 'white', textAlign: 'center'}}>:: 모임 앨범</h1>
      <AlbumList/>
    </div>
  );
};

export default GalleryPage;
