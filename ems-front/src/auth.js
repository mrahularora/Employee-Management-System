const TOKEN_KEY = "emsToken";
const USER_KEY = "emsUser";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => localStorage.getItem(USER_KEY);
export const isLoggedIn = () => Boolean(getToken());

export const saveLogin = ({ token, username }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
