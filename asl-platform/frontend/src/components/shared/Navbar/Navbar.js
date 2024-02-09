import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import clsx from "clsx";
import './navbar.scss'
import MobileNav from '../MobileNav/MobileNav';
import useAuth from '../../Auth/useAuth';
import Cookies from 'js-cookie';
import axios from 'axios'
import {FormattedMessage} from 'react-intl'

const Navbar = (props) => {  

    const [isSticky, setIsSticky] = useState(false);
    const [role, setRole] = useState()
   
    useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.pageYOffset;
      setIsSticky(scrollHeight > 20 ? true : false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    
    const isAuthenticated = useAuth();
    const navigate = useNavigate(); 
  
    const handleLogout = () => {
      Cookies.remove('token');
      navigate('/login')
    }

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) { 
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          axios
            .get('http://localhost:8000/api/user')
            .then((response) => {
              setRole(response.data.user.role)
            })
            .catch((error) => {
              console.error('Error fetching user:', error);
            });
        }
      }, []);

    return (
        <div id="navbar" className={clsx(`navbar ${props.styles}`, isSticky ? "nav__sticky" : "")} >
            <Link to='/' className='nav-logo'>
                <div className='logo-container'>
                    <div className="logo"></div>
                </div>
                <h1>ASL</h1>
            </Link>
            <div className='nav-links'>
                <Link to='/'><h6 className='nav-link'><FormattedMessage id="sidebar2"/></h6></Link>
                <Link to='/donations'><h6 className='nav-link'><FormattedMessage id="sidebar3"/></h6></Link>
                <Link to='/news'><h6 className='nav-link'><FormattedMessage id="sidebar4"/></h6></Link>
                <Link to='/hand-recognition'><h6 className='nav-link'><FormattedMessage id="hand-gesture"/></h6></Link>
             </div>
            {isAuthenticated ?
                <div className='nav-auth'>
                   {role==='admin' ?  
                        <Link to='/admin' className='link1'>
                            Dashboard
                        </Link> : ''}
                    <div onClick={handleLogout} className='link2'>
                        <span>
                        <FormattedMessage id="sidebar5" defaultMessage='Log out'/>
                        </span>
                    </div>
                </div>
            :
            <div className='nav-auth'>
                <Link to='/login' className='link1'>
                    Login
                </Link>
                <Link to='/register' className='link2'>
                    <span>
                    <FormattedMessage id="sidebar7"/>
                    </span>
                </Link>
            </div>
        }
            <MobileNav />
        </div>
    )
}

export default Navbar