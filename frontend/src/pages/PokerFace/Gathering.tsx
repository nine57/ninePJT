const GatheringPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">동물원</h1>
          <p className="text-sm mt-1">✨ 날짜: 24.08.31 ~ 24.09.01</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Section: Information */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">📍 숙소</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <p className="text-lg font-medium">지지팡입니다. 딱 1팀만을 위한 프라이빗한 공간</p>
            <div className="mt-4">
              <p className="font-medium">주소:</p>
              <ul className="list-disc pl-6">
                <li>Imchobamangol-ro 1층, 가평군, 경기도 12447, 한국</li>
                <li>경기도 가평군 상면 임초리 578-3</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section: Candidate List */}
        <section>
          <h2 className="text-xl font-semibold mb-2">📋 숙소 후보</h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 font-medium">번호</th>
                  <th className="p-2 font-medium">투표 수</th>
                  <th className="p-2 font-medium">이름</th>
                  <th className="p-2 font-medium">링크</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 1, votes: 3, name: '가평 아쿠아베타 스파&수영장펜션', link: 'https://example.com' },
                  { id: 2, votes: 1, name: '용인 브라운도트', link: 'https://example.com' },
                  // 더 많은 데이터 추가 가능
                ].map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="p-2">{item.id}</td>
                    <td className="p-2">{item.votes}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                        링크
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GatheringPage;