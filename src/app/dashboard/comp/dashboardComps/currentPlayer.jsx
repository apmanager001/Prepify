"use client";
import React, { useState, useRef } from "react";
import Img from "next/image";
import Link from "next/link";
import { Play, Pause, Undo, Redo } from "lucide-react";

const songs = [
  {
    title: "Interstellar - Hans Zimmer",
    image: "/albumnArt/interstellar.webp",
    audio: "/audio/interstellar.mp3",
  },
  {
    title: "Social Network - Trent Reznor",
    image: "/albumnArt/socialNetwork.webp",
    audio: "/audio/social.mp3",
  },
  {
    title: "Inception - Hans Zimmer",
    image: "/albumnArt/inception.webp",
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
];

const CurrentPlayer = () => {
  const [currentSong, setCurrentSong] = useState(songs[2]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  // const audioRefs = useRef({});

  const timeStringToSeconds = (time) => {
    if (!time) return 0;
    const parts = time.split(":").map(Number);
    if (parts.length === 3) {
      // HH:MM:SS
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    } else if (parts.length === 2) {
      // MM:SS
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 1) {
      // SS
      return parts[0];
    }
    return 0;
  };

  const togglePlay = () => {
    const audio = document.querySelector("audio");
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const seekAudio = (delta) => {
    const audio = document.querySelector("audio");
    if (!audio) return;
    let newTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + delta)
    );
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="w-full max-h-[400px] flex justify-center md:justify-left ">
      <div className="w-[350px] bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl h-full shadow-2xl border border-gray-700">
        <div className="h-[250px] rounded-t-2xl flex items-center justify-center relative">
          <Img
            src={currentSong.image}
            alt="Album Art"
            fill
            className="object-cover rounded-t-xl overflow-hidden"
          />
          <audio
            src={currentSong.audio}
            autoPlay={isPlaying}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          <div className="absolute inset-0 bg-black/50 rounded-t-lg z-10 h-[250px]"></div>

          <details className="dropdown dropdown-right absolute top-2 left-2 z-10">
            <summary className="btn btn-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              Change Song
            </summary>
            <ul className="menu dropdown-content bg-gray-800 text-white rounded-lg w-48 p-2">
              {songs.map((song, index) => (
                <li key={index}>
                  <button
                    onClick={() => changeSong(song)}
                    className="hover:bg-gray-700 rounded-md p-2"
                  >
                    {song.title}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="h-[150px] text-center text-white border-t-2 border-white/40">
          <span className="text-xl font-semibold h-1/3 flex items-center justify-center">
            {currentSong.title || "No song is playing"}
          </span>
          <div className="mx-4 h-2/3 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between">
              <span>
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(2, "0")}
              </span>
              <div className="relative w-full mx-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500"
                  style={{
                    width: `${
                      (currentTime /
                        timeStringToSeconds(currentSong.duration)) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <span>{currentSong.duration || "0:00"}</span>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div
                className="bg-gray-700 hover:bg-gray-600 z-30 rounded-full p-2 inline-block mr-4 cursor-pointer transition-transform duration-100 active:scale-105 tooltip tooltip-top"
                onClick={() => seekAudio(-10)}
                data-tip="Rewind 10 seconds"
              >
                <Undo className="text-white" />
              </div>

              <div
                className="bg-primary hover:bg-primary/80 z-30 rounded-full p-3 inline-block cursor-pointer "
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="text-white" />
                ) : (
                  <Play className="text-white" />
                )}
              </div>
              <div
                className="bg-gray-700 hover:bg-gray-600 z-30 rounded-full p-2 inline-block ml-4 cursor-pointer transition-all duration-100 active:scale-105 tooltip tooltip-top"
                onClick={() => seekAudio(10)}
                data-tip="Forward 10 seconds"
              >
                <Redo className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlayer;
