function handleCustomExceptionError(error: any): void {
  console.error('Custom Exception:', error.message || error);
  // 필요에 따라 에러 로그를 전송하거나 UI 알림 추가
}

export default handleCustomExceptionError;
