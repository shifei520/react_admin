const USER_KEY = "user_key";

const localStorageActions = {
  saveUser(user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser() {
    return JSON.parse(window.localStorage.getItem(USER_KEY || "{}"));
  },
  removeUser() {
    window.localStorage.removeItem(USER_KEY);
  },
};

export default localStorageActions;
