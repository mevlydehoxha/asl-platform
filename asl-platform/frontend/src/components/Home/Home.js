import React from 'react';
import Navbar from '../shared/Navbar/Navbar';
import './Home.scss'
import Frontpage from './Frontpage/Frontpage';
import Footer from '../shared/Footer/Footer';


const Home = () => {
    return (
      <div>
        <Navbar/>
        <Frontpage/>
        <Footer/>
      </div>
    );
};

export default Home;
