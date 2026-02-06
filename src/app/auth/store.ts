const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_EMAIL_KEY = "userEmail";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setUserEmail(email: string) {
  localStorage.setItem(USER_EMAIL_KEY, email);
}

export function getUserEmail(): string | null {
  return localStorage.getItem(USER_EMAIL_KEY);
}
