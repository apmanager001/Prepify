"use client";
import React, { useEffect } from "react";
import Img from "next/image";
import { Play, Pause, Undo, Redo } from "lucide-react";
import useToolStore from "@/lib/toolStore";

const CurrentPlayer = () => {
  const playlist = useToolStore((s) => s.playlist);
  const isPlaying = useToolStore((s) => s.isPlaying);
  const toggle = useToolStore((s) => s.toggle);
  const seekAudio = useToolStore((s) => s.seekAudio);
  const currentSong = useToolStore((s) => s.currentSong());
  const currentTime = useToolStore((s) => s.currentTime);
  const duration = useToolStore((s) => s.duration);
  const changeSong = useToolStore((s) => s.changeSong);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    useToolStore.getState().updateSrc();
  }, []);

  return (
    <div className="w-full max-h-96 flex justify-center md:justify-left ">
      <div className="w-80 bg-linear-to-br from-gray-800 via-gray-900 to-black rounded-2xl h-full shadow-2xl border border-gray-700">
        <div className="h-60 rounded-t-2xl flex items-center justify-center relative">
          <Img
            src={currentSong.image}
            alt="Album Art"
            width={700}
            height={700}
            className="h-full w-full object-cover rounded-t-xl overflow-hidden"
          />
          <div className="absolute inset-0 bg-black/50 rounded-t-lg z-10 h-60"></div>

          <details className="dropdown dropdown-right absolute top-2 left-2 z-10">
            <summary className="btn btn-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              Change Song
            </summary>
            <ul className="menu dropdown-content bg-gray-800 text-white rounded-lg w-48 p-2">
              {playlist.map((song, index) => (
                <li key={index}>
                  <button
                    onClick={() => changeSong(index)}
                    className="hover:bg-gray-700 rounded-md p-2"
                  >
                    {song.title}
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
        <div className="h-36 text-center text-white border-t-2 border-white/40">
          <span className="text-xl font-semibold h-1/3 flex items-center justify-center">
            {currentSong.title || "No song is playing"}
          </span>
          <div className="mx-4 h-2/3 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between">
              <span>{formatTime(currentTime)}</span>
              <div className="relative w-full mx-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500"
                  style={{
                    width: `${
                      duration > 0 ? (currentTime / duration) * 100 : 0
                    }%`,
                  }}
                ></div>
              </div>
              <span>{formatTime(duration)}</span>
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
                onClick={toggle}
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
