import { create } from "zustand";

let audioElement = null;
let storeInstance = null;
let lastIndex = -1;

const getAudioElement = () => {
  if (typeof window === "undefined") return null;
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.addEventListener("loadedmetadata", (e) => {
      storeInstance.set({ duration: e.currentTarget.duration });
    });
    audioElement.addEventListener("timeupdate", (e) => {
      storeInstance.set({ currentTime: e.currentTarget.currentTime });
    });
    audioElement.addEventListener("ended", () => {
      storeInstance.get().pause();
    });
  }
  return audioElement;
};

const useToolStore = create((set, get) => {
  storeInstance = { set, get };

  return {
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
    currentTime: 0,
    duration: 0,
    currentSong: () => get().playlist[get().currentIndex] || null,
    // actions
    setPlaylist: (pl) => set({ playlist: pl, currentIndex: 0 }),
    setIndex: (i) =>
      set((s) => ({
        currentIndex: Math.max(0, Math.min(i, s.playlist.length - 1)),
      })),
    play: () => {
      const audio = getAudioElement();
      if (audio) {
        audio.play().catch(() => {});
        set({ isPlaying: true });
      }
    },
    pause: () => {
      const audio = getAudioElement();
      if (audio) {
        audio.pause();
        set({ isPlaying: false });
      }
    },
    toggle: () => {
      const state = get();
      if (state.isPlaying) {
        get().pause();
      } else {
        get().play();
      }
    },
    next: () => {
      set((s) => ({
        currentIndex: s.playlist.length
          ? (s.currentIndex + 1) % s.playlist.length
          : 0,
      }));
      get().updateSrc();
    },
    prev: () => {
      set((s) => ({
        currentIndex: s.playlist.length
          ? (s.currentIndex - 1 + s.playlist.length) % s.playlist.length
          : 0,
      }));
      get().updateSrc();
    },
    setCurrentTime: (time) => set({ currentTime: time }),
    setDuration: (dur) => set({ duration: dur }),
    seekAudio: (delta) => {
      const audio = getAudioElement();
      if (!audio) return;
      let newTime = Math.max(
        0,
        Math.min(
          get().duration || audio.duration || 0,
          get().currentTime + delta
        )
      );
      audio.currentTime = newTime;
      set({ currentTime: newTime });
    },
    changeSong: (idx) => {
      get().setIndex(idx);
      get().pause();
      get().setCurrentTime(0);
      get().updateSrc();
    },
    updateSrc: () => {
      const currentIndex = get().currentIndex;
      if (currentIndex !== lastIndex) {
        const song = get().currentSong();
        const audio = getAudioElement();
        if (audio && song) {
          audio.src = song.audio || "";
          audio.load();
        }
        lastIndex = currentIndex;
      }
    },
  };
});

export default useToolStore;
