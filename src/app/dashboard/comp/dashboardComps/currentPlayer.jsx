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
  const audioRefs = useRef({});

  
  const timeStringToSeconds = (time) => {
    if (!time) return 0;
    const [minutes, seconds] = time.split(":").map(Number);
    return minutes * 60 + seconds;
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
  
  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-[350px] bg-gradient-to-br from-primary to-secondary rounded-2xl h-full shadow-lg border-1 border-gray-600">
        <div className="h-[250px]  rounded-t-2xl flex items-center justify-center relative">
          <Img
            src={currentSong.image}
            alt="Album Art"
            fill
            className=" object-top rounded-t-xl overflow-hidden"
          />
          <audio
            src={currentSong.audio}
            autoPlay={isPlaying}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
          <div className="absolute inset-0 bg-black/40 rounded-t-lg z-10 h-[250px]"></div>

          <details className="dropdown dropdown-right absolute top-2 left-2 z-10">
            <summary className="btn btn-primary btn-sm rounded-lg">
              Change Song
            </summary>
            <ul className="menu dropdown-content bg-primary/50 rounded-lg w-48 p-2">
              {songs.map((song, index) => (
                <li key={index}>
                  <button onClick={() => changeSong(song)}>{song.title}</button>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="h-[200px] text-center">
          <span className="text-xl font-bold h-1/3 flex items-center justify-center">
            {currentSong.title || "No song is playing"}
          </span>
          <div className="mx-4 h-2/3 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between">
              <span>
                {Math.floor(currentTime / 60)}:
                {String(Math.floor(currentTime % 60)).padStart(2, "0")}
              </span>
              <progress
                className="progress w-full mx-2"
                value={currentTime}
                max={timeStringToSeconds(currentSong.duration)}
              />
              <span>{currentSong.duration || "0:00"}</span>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="bg-black/10 z-50 rounded-full p-2 inline-block mr-4 cursor-pointer transition-transform duration-100 active:scale-105">
                <Undo />
              </div>

              <div
                className="bg-black/10 z-50 rounded-full p-3 inline-block cursor-pointer"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause /> : <Play />}
              </div>
              <div className="bg-black/10 z-50 rounded-full p-2 inline-block ml-4 cursor-pointer transition-all duration-100 active:scale-105">
                <Redo />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlayer;
