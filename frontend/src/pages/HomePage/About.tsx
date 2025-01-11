import React from 'react';

const About: React.FC = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row items-center justify-center px-8 bg-gray-50">
      <div className="w-full md:w-1/2 flex justify-center bg-gray-500">
      {/* 왼쪽 이미지 영역 */}
        <img
          src="/path-to-your-image.jpg"
          alt="About Me"
          className="max-w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* 오른쪽 텍스트 영역 */}
      <div className="w-full flex flex-col items-start mt-8 md:w-1/2 md:mt-0 md:pl-12">
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold text-gray-800">About Me</h1>
          <p className="text-gray-600 mt-2 leading-relaxed">
            설명란
          </p>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Name:</strong>
            <span className="text-gray-400">강현구</span>
          </div>
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Email:</strong>
            <span className="text-gray-400">gusrn015@gmail.com</span>
          </div>
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Phone:</strong>
            <span className="text-gray-400">+82-10-3997-0157</span>
          </div>
          <div className="flex items-center">
            <strong className="w-24 text-gray-700">Github:</strong>
            <span className="text-gray-400">
              <a href="https://github.com/nine57">https://github.com/nine57</a>
            </span>
          </div>
        </div>

        <button
          className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-all duration-300"
        >
          이력서 다운로드
        </button>
      </div>
    </div>
  );
};

export default About;
