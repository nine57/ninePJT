module.exports = {
  content: [
    ".index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ], // TailwindCSS가 적용될 파일 경로
  theme: {
    extend: {}, // 사용자 정의 스타일 확장
  },
  plugins: [], // 추가 플러그인 설정
};
