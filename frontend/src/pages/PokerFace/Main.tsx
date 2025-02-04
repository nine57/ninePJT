import TextCard from '../../components/TextCard'
import Vote from '../../components/Vote'

const Main = () => {
  return (
    <div className="flex flex-col space-y-4 p-4">
      <section>
        <TextCard
          title="📌 공지 제목"
          content="공지 텍스트 영역 공지 텍스트 영역 공지 텍스트 영역 공지 텍스트 영역"
        />
      </section>
      <section>
        <Vote/>
      </section>
    </div>
  );
};

export default Main;
