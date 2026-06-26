export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string; // e.g. "04:12"
  coverUrl: string;
  genre: string;
  listeners?: string; // e.g. "1.2M"
  audioUrl?: string; // dynamic synthesized beep frequency or placeholder
}

export enum Screen {
  LANDING = "LANDING",
  NOW_SPINNING = "NOW_SPINNING",
  DISCOVER = "DISCOVER",
  SEARCH = "SEARCH",
  LIKED_MUSIC = "LIKED_MUSIC",
  PLAYLIST = "PLAYLIST",
  JAM_TOGETHER = "JAM_TOGETHER",
  PROFILE = "PROFILE",
  LOGIN = "LOGIN",
  REGISTER = "REGISTER"
}

export interface ChatMessage {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  isDj?: boolean;
  isSystem?: boolean;
}

export interface Listener {
  id: string;
  name: string;
  avatarUrl: string;
  isDj?: boolean;
}

export interface UserProfile {
  name: string;
  idCode: string;
  isPremium: boolean;
  location: string;
  memberSince: string;
  level: number;
  minutesCount: number;
  tracksCount: number;
  collectionCount: number;
  avatarUrl: string;
  uid?: string;
  email?: string;
}
