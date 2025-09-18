"use client";
import React, { useState } from "react";
import Img from "next/image";
import { Play, Pause, Undo, Redo } from "lucide-react";

const CurrentPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const title = "Song Title - Artist Name";

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full">
      <div className="bg-primary rounded-2xl h-full shadow-lg">
        <div className="h-1/2 rounded-t-2xl flex items-center justify-center relative">
          <Img
            src="/albumnArt/peaceful.jpg"
            alt="Album Art"
            width={200}
            height={150}
            className="w-full h-full rounded-t-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/40 rounded-t-lg"></div>
          {/* <button className="btn btn-sm btn-primary rounded-lg mt-2 absolute top-2 left-2">
            Change Song
          </button> */}
          <details className="dropdown mt-2 absolute top-2 left-2">
            <summary className="btn btn-primary rounded-t-lg btn-sm">
              Change Song
            </summary>
            <ul className="menu dropdown-content bg-primary/50 rounded-b-lg z-1 w-24 p-2 ">
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </details>
        </div>
        <div className="h-1/2 text-center">
          <span className="text-xl font-bold h-1/3 flex items-center justify-center">
            {title || "No song is playing"}
          </span>
          <div className="mx-4 h-2/3 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between">
              <span>0:00</span>
              <progress
                className="progress w-full mx-2"
                value={10}
                max="100"
              ></progress>
              <span>59:00</span>
            </div>
            <div className="flex items-center justify-center mt-4">
              <div className="bg-black/10 z-50 rounded-full p-2 inline-block mr-4 cursor-pointer transition-all duration-100 active:p-2.5">
                <Undo />
              </div>

              <div
                className="bg-black/10 z-50 rounded-full p-3 inline-block cursor-pointer"
                onClick={togglePlay}
              >
                {isPlaying ? <Play /> : <Pause />}
              </div>
              <div className="bg-black/10 z-50 rounded-full p-2 inline-block ml-4 cursor-pointer transition-all duration-100 active:p-2.5">
                <Redo className="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlayer;
