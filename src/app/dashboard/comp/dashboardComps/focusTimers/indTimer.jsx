'use client'
import React, {useState} from 'react'
import {Play, Pause, Plus} from 'lucide-react'

const IndTimer = ({ timer }) => {
  const [isActive, setIsActive] = useState(false);

  if (!timer) {
    return (
      <>
        <div className='text-center text-gray-400 cursor-default'>
          <div className="text-2xl font-semibold ">Add Timer</div>
          <button className="btn btn-sm btn-circle rounded-lg">
            <Plus />
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="text-sm font-semibold cursor-default">{timer.name || "Unnamed"}</div>
      <div className="text-3xl font-bold tracking-wide cursor-default">
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
};

export default IndTimer