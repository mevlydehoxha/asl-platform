import React from 'react'
import './NotFound.scss'
import Navbar from '../Navbar/Navbar'

export default function NotFound() {
  return (
    <div>
        <Navbar/>
        <div className='not-found'>
            <h1>THIS ROUTE DOES NOT EXIST.</h1>
            <div className='confused'></div>
        </div>
    </div>
  )
}
