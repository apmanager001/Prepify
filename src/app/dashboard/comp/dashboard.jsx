import React from 'react'
import StatusBar from './dashboardComps/statusBar'
import CurrentPlayer from './dashboardComps/currentPlayer'
import MainTimer from './dashboardComps/focusTimers/mainTimer'

const DashboardPage = () => {
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row gap-4 md:gap-0'>
            <div className='flex-2 '>
                <StatusBar />
            </div>
            <div className='flex-1'>
                <CurrentPlayer />
            </div>
        </div>
        <div>
            <MainTimer />
        </div>
        
    </div>
  )
}

export default DashboardPage;