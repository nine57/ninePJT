import React from 'react';

const Experience: React.FC = () => {
  return (
    <div className="flex flex-row min-h-screen bg-white">
      {/* 사이드바 */}
      <aside className="w-1/4 md:w-1/5 bg-white shadow-lg p-6">
        <nav>
          <ul className="space-y-4 text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-500">
                Education
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-500 font-semibold">
                Experience
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Skills
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-500">
                Projects
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* 오른쪽 컨텐츠 */}
      <main className="w-4/5 p-8">
        {/* 제목 */}
        <h1 className="text-4xl font-extrabold text-blue-600 mb-10 text-center md:text-left">
          Work Experience
        </h1>

        <div className="mb-12 border-b border-gray-200 pb-8">
          <h2 className="text-2xl font-semibold mb-2">Full Stack Developer</h2>
          <p className="text-gray-500 mb-1">
            2019.09–2021.04 <span className="ml-2">(1년 8개월)</span>
          </p>
          <p className="text-gray-700 font-medium mb-4">주식회사 더라퍼스</p>

          <div className="mb-4">
            <h3 className="font-bold text-lg mb-2">기술 스택</h3>
            <p className="text-gray-600">
              ReactJS, Next.js, Typescript, Styled-components, AWS S3 static
              hosting
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">주요 업무</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600">
              <li>React + Typescript 기반 웹 서비스 개발/운영</li>
              <li>
                디자인 시스템 도입을 위한 UI 컴포넌트 관리용 Storybook 도입
              </li>
              <li>SEO를 위한 Next.js 도입</li>
              <li>Serverless 환경을 위한 S3 기반 static hosting 구축</li>
            </ul>
          </div>
        </div>

        {/* 첫 번째 경력 */}
        <div className="flex flex-row items-start space-x-6 mb-12">
          {/* 아이콘 */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
        <span role="img" aria-label="icon" className="text-white text-2xl">
          🎁
        </span>
          </div>

          {/* 경력 상세 */}
          <div>
            <p className="text-blue-500 font-medium">2019.09–2021.04 (1년 8개월)</p>
            <h2 className="text-2xl font-bold text-gray-800">Full Stack Developer</h2>
            <p className="text-gray-600 mb-4">주식회사 더라퍼스</p>
            <p className="font-semibold text-gray-700 mb-2">기술 스택</p>
            <p className="text-gray-600 mb-2">
              ReactJS, Next.js, Typescript, Styled-components, AWS S3 static hosting
            </p>
            <p className="font-semibold text-gray-700 mb-2">주요 업무</p>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>React + Typescript 기반 웹 서비스 개발/운영</li>
              <li>디자인 시스템 도입을 위한 UI 컴포넌트 관리용 storybook 도입</li>
              <li>SEO를 위한 Next.js 도입</li>
              <li>Serverless 환경을 위한 S3 기반 static hosting 구축</li>
            </ul>
          </div>
        </div>

        {/* 두 번째 경력 */}
        <div className="flex flex-row items-start space-x-6">
          {/* 아이콘 */}
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
        <span role="img" aria-label="icon" className="text-white text-2xl">
          🎁
        </span>
          </div>

          {/* 경력 상세 */}
          <div>
            <p className="text-blue-500 font-medium">2014–2015</p>
            <h2 className="text-2xl font-bold text-gray-800">Web Designer</h2>
            <p className="text-gray-600 mb-4">Cambridge University</p>
            <p className="text-gray-600">
              A small river named Duden flows by their place and supplies it with the necessary
              regelialia. It is a paradisematic country, in which roasted parts of sentences fly into
              your mouth.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Experience;
