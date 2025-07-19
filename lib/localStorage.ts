import { db, ref, set } from "./firebase";

interface UserInfo {
  name: string;
  avatar: string;
}

export const saveUserInfo = async (name: string, avatar: string) => {
  // Save to localStorage
  const userInfo: UserInfo = { name, avatar };
  localStorage.setItem("poker_user", JSON.stringify(userInfo));

  // Save to Firebase
  try {
    const userRef = ref(db, `users/${name}`);
    await set(userRef, userInfo);
  } catch (error) {
    console.error("Error saving user info to Firebase:", error);
  }
};

export const loadUserInfo = (): UserInfo | null => {
  // Try to load from localStorage first
  const data = localStorage.getItem("poker_user");
  if (data) {
    return JSON.parse(data);
  }
  return null;
};
