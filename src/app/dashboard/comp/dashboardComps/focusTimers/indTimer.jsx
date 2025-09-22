'use client'
import React, {useState} from 'react'
import {Play, Pause} from 'lucide-react'

const IndTimer = ({ timer}) => {
    const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div className="text-sm font-semibold">{timer.name || ""}</div>
      <div className="text-3xl font-bold tracking-wide">
        {timer.duration || "00:00"}
      </div>
      <div>
        <button className="btn btn-sm btn-primary btn-outline btn-circle rounded-lg">
          {isActive ? (
            <Pause
              onClick={() => setIsActive(false)}
              className="cursor-pointer"
            />
          ) : (
            <Play
              onClick={() => setIsActive(true)}
              className="cursor-pointer"
            />
          )}
        </button>
      </div>
    </>
  );
}

export default IndTimer