/**
 * 폼 검증 유틸리티 함수
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Username 검증
 */
export function validateUsername(username: string): ValidationResult {
  if (!username.trim()) {
    return { isValid: false, error: '사용자명을 입력해주세요.' };
  }
  if (username.length < 3) {
    return { isValid: false, error: '사용자명은 최소 3자 이상이어야 합니다.' };
  }
  if (username.length > 20) {
    return { isValid: false, error: '사용자명은 최대 20자까지 가능합니다.' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: '사용자명은 영문, 숫자, 언더스코어만 사용 가능합니다.' };
  }
  return { isValid: true };
}

/**
 * Password 검증
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { isValid: false, error: '비밀번호를 입력해주세요.' };
  }
  if (password.length < 8) {
    return { isValid: false, error: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  if (password.length > 50) {
    return { isValid: false, error: '비밀번호는 최대 50자까지 가능합니다.' };
  }
  return { isValid: true };
}

/**
 * Password 확인 검증
 */
export function validatePasswordConfirm(
  password: string,
  passwordConfirm: string
): ValidationResult {
  if (!passwordConfirm) {
    return { isValid: false, error: '비밀번호 확인을 입력해주세요.' };
  }
  if (password !== passwordConfirm) {
    return { isValid: false, error: '비밀번호가 일치하지 않습니다.' };
  }
  return { isValid: true };
}

/**
 * 전화번호 검증
 */
export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) {
    return { isValid: false, error: '이메일을 입력해주세요.' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '올바른 이메일 형식이 아닙니다.' };
  }
  return { isValid: true };
}

/**
 * 닉네임 검증
 */
export function validateNickname(nickname: string): ValidationResult {
  if (!nickname.trim()) {
    return { isValid: false, error: '닉네임을 입력해주세요.' };
  }
  if (nickname.length < 2) {
    return { isValid: false, error: '닉네임은 최소 2자 이상이어야 합니다.' };
  }
  if (nickname.length > 20) {
    return { isValid: false, error: '닉네임은 최대 20자까지 가능합니다.' };
  }
  return { isValid: true };
}

