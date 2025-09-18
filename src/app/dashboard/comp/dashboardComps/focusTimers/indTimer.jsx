'use client'
import React, {useState} from 'react'
import {Play, Pause} from 'lucide-react'

const IndTimer = ({ timer}) => {
    const [isActive, setIsActive] = useState(false);
  return (
    <>
        <div>
            {timer.name|| ''}
        </div>
        <div>
            {timer.duration || '00:00'}
        </div>
        <div>
            <button className='btn btn-sm btn-primary rounded-lg mx-2'>
                {isActive ? 
                    <Pause onClick={() => setIsActive(false)} className='cursor-pointer' /> : 
                    <Play onClick={() => setIsActive(true)} className='cursor-pointer' />
                }
            </button>
        </div>
    </>
  )
}

export default IndTimer