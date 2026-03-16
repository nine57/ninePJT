export const WELCOME_MESSAGES = [
  '오늘 하루도 당신은 충분히 잘하고 있어요',
  '작은 한 걸음이 큰 변화의 시작입니다',
  '당신의 존재만으로도 세상은 더 따뜻해져요',
  '당신은 생각보다 훨씬 멋진 사람이에요',
];

export const getRandomWelcomeMessage = (): string => {
  const index = Math.floor(Math.random() * WELCOME_MESSAGES.length);
  return WELCOME_MESSAGES[index];
};
