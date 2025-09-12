import { useCallback, useEffect, useState } from "react";

export type Profile = {
  nickname: string | null;
  avatarUrl: string | null;
  mannerTemp: number; // 기본값 85
};

const STORAGE_KEY = "mypage-profile";

const getInitial = (): Profile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Profile;
  } catch {}
  return { nickname: null, avatarUrl: null, mannerTemp: 85 };
};

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(getInitial);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetProfile = useCallback(() => {
    setProfile({ nickname: null, avatarUrl: null, mannerTemp: 85 });
  }, []);

  const isComplete = !!(profile.nickname && profile.avatarUrl);

  return { profile, updateProfile, resetProfile, isComplete };
}
