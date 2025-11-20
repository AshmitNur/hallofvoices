export interface VoiceClip {
  id: string;
  title: string;
  duration: string; // Display format "1:24"
  durationSec: number;
  date: string;
  tags: string[];
  audioUrl: string; // URL for audio playback
  imageUrl?: string; // Custom picture
  color: string; // For the glowing orb effect
}

export interface User {
  name: string;
  avatar: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  PROFILE = 'PROFILE'
}

export interface AudioState {
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  currentClip: VoiceClip | null;
}