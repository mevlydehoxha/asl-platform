import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './SideBar.scss';
import home from '../../../assets/dashboard/home.svg';
import donation from '../../../assets/dashboard/donation.png';
import events from '../../../assets/dashboard/events.png';
import dashboard from '../../../assets/dashboard/dashboard.png';
import logout from '../../../assets/logout.png';
import SelectLanguage from '../SelectLanguage/SelectLanguage';
import { FormattedMessage } from 'react-intl';
import ThemeSwitcher from '../Footer/ThemeSwitcher';

const SideBar = (props) => {
  const [isVisible, setIsVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
  };

  const isLinkActive = (to) => {
    return location.pathname === to;
  };

  return (
    <div>
      <div className={isVisible ? 'side-menu' : 'side-menu-hidden'}>
        <div className={isVisible ? 'right' : 'left'} onClick={toggleVisibility}></div>
        {isVisible && 
          <div>
            <Link to='/home' className='main-container2'>
              <div className='main-logo'></div>
              <h1>ASL</h1>
            </Link>
            <div className='items'>
              <Link to='/admin' className={`item ${isLinkActive('/admin') ? 'active-bar' : ''}`}>
                <img className='side-icon' src={dashboard} alt='dashboard'/>
                <h3><FormattedMessage id="sidebar1"/></h3>
              </Link>
              <Link to='/home-admin' className={`item ${isLinkActive('/home-admin') ? 'active-bar' : ''}`}>
                <img className='side-icon' src={home} alt='home'/>
                <h3><FormattedMessage id="sidebar2"/></h3>
              </Link>
              <Link to='/donations-admin' className={`item ${isLinkActive('/donations-admin') ? 'active-bar' : ''}`}>
                <img className='side-icon' src={donation} alt='donation'/>
                <h3><FormattedMessage id="sidebar3"/></h3>
              </Link>
              <Link to='/news-admin' className={`item ${isLinkActive('/news-admin') ? 'active-bar' : ''}`}>
                <img className='side-icon' src={events} alt='events'/>
                <h3><FormattedMessage id="sidebar4"/></h3>
              </Link>
              <div className="sidebar-footer">
                <SelectLanguage
                  setLanguage={props.setLanguage}
                  language={props.language}
                />
                <div className="theme">
                  <ThemeSwitcher/>
                </div>
                <div className='item logout' onClick={handleLogout}>
                  <img className='side-icon' src={logout} alt='logout'/>
                  <h3><FormattedMessage id="sidebar5"/></h3>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default SideBar;
