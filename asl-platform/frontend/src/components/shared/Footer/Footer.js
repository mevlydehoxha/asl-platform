import React from 'react'
import './Footer.scss'
import {Link} from 'react-router-dom'
import SelectLanguage from '../SelectLanguage/SelectLanguage'
import ThemeSwitcher from './ThemeSwitcher'

export default function Footer(props) {
  return (
    <div className='footer'>
      <div className='socials'>
        <Link to="/" className='social-container'>
          <div className='instagram'></div>
        </Link>
        <Link to="/" className='social-container'>
          <div className='twitter'></div>
        </Link>
        <Link to="/" className='social-container'>
          <div className='linkedin'></div>
        </Link>
      </div>
      <h4>Address</h4>
      <p>Rr Nazim Gafurri Nr 28/2-1, 10000, Prishtinë - Kosovë</p>
      <p>Terms of Use • Privacy Policy</p>
      <p>© 2023 All rights reserved</p>
      <div className='select'>
        <ThemeSwitcher/>
        <SelectLanguage
          setLanguage={props.setLanguage}
          language={props.language}
        />
      </div>
    </div>
  )
}
