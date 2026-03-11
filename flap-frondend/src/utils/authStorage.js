const USER_KEY = "loginUser";

export function saveLoginUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getLoginUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearLoginUser() {
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return !!getLoginUser();
}

export function getAccessToken() {
  const user = getLoginUser();
  return user?.accessToken || null;
}