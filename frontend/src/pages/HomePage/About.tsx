import React from 'react';


const About: React.FC = () => {
  return (
    // <div>
    //   <h1>About Me</h1>
    //   <p>This is the about page.</p>
    // </div>
    <div>
      <div className="bg-blue-500 text-white font-bold p-4 rounded-lg">
        TailwindCSS 적용 완료!
      </div>
      <div className="bg-blue-500 text-white text-center p-10">
        <h1 className="text-4xl font-bold">TailwindCSS 테스트</h1>
        <p>TailwindCSS가 제대로 적용되었는지 확인하세요!</p>
      </div>
    </div>
  );
};

export default About;
