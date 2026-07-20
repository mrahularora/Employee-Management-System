const TOKEN_KEY = "emsToken";
const USER_KEY = "emsUser";
const ROLE_KEY = "emsRole";
export const NOTIFICATIONS_READ_EVENT = "ems-notifications-read";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => localStorage.getItem(USER_KEY);
export const getRole = () => localStorage.getItem(ROLE_KEY);
export const isLoggedIn = () => Boolean(getToken() && getRole());
export const isAdmin = () => getRole() === "ADMIN";
export const getNotificationsReadAt = () => Number(localStorage.getItem(`emsNotificationsReadAt:${getUser()}`)) || 0;
export const markNotificationsRead = () => {
  const readAt = Date.now();
  localStorage.setItem(`emsNotificationsReadAt:${getUser()}`, String(readAt));
  window.dispatchEvent(new Event(NOTIFICATIONS_READ_EVENT));
  return readAt;
};

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
