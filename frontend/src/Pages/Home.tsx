import React from 'react'
import CreateRoom from '../Components/CreateRoom'

const Home:React.FC = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
        <CreateRoom />
    </div>
  )
}

export default Home