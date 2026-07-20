const TOKEN_KEY = "emsToken";
const USER_KEY = "emsUser";
const ROLE_KEY = "emsRole";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => localStorage.getItem(USER_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);
export const isLoggedIn = () => Boolean(getToken() && getRole());
export const isAdmin = () => getRole() === "ADMIN";

export const saveLogin = ({ token, username, role }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, username);
  localStorage.setItem(ROLE_KEY, role);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(ROLE_KEY);
};
