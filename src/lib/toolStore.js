import { create } from "zustand";

// Shared playback store for CompactPlayer <-> CurrentPlayer
export const useToolStore = create((set) => ({
  playlist: [
    {
      title: "Interstellar - Hans Zimmer",
      image: "/albumnArt/studyPicture.webp",
      audio: "/ambient/interstellar.mp3",
      duration: null,
    },
    {
      title: "Social Network - Trent Reznor",
      image: "/albumnArt/studyPicture2.webp",
      audio: "/ambient/socialNetwork.mp3",
      duration: null,
    },
    {
      title: "Inception - Hans Zimmer",
      image: "/albumnArt/studyPicture3.webp",
      audio: "/ambient/inception.mp3",
      duration: "1:00:00",
    },
    {
      title: "Rain - Ambient",
      image: "/albumnArt/rain.webp",
      audio: "/ambient/rain.mp3",
      duration: "59:59",
    },
    {
      title: "40Hz",
      image: "/albumnArt/40hz.webp",
      audio: "/ambient/40hz.mp3",
      duration: "30:06",
    },
  ],
  currentIndex: 0,
  isPlaying: false,
  // actions
  setPlaylist: (pl) => set({ playlist: pl, currentIndex: 0 }),
  setIndex: (i) =>
    set((s) => ({
      currentIndex: Math.max(0, Math.min(i, s.playlist.length - 1)),
    })),
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  toggle: () => set((s) => ({ isPlaying: !s.isPlaying })),
  next: () =>
    set((s) => ({
      currentIndex: s.playlist.length
        ? (s.currentIndex + 1) % s.playlist.length
        : 0,
    })),
  prev: () =>
    set((s) => ({
      currentIndex: s.playlist.length
        ? (s.currentIndex - 1 + s.playlist.length) % s.playlist.length
        : 0,
    })),
}));

export default useToolStore;
