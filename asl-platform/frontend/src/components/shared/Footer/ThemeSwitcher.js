import React, { useState, useEffect } from "react";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import './ThemeSwitcher.scss'

function ThemeSwitcher(props) {

    const [mode, setMode] = useState(() => localStorage.getItem("mode"));

    useEffect(() => {
        window.addEventListener("storage", setPreferedTheme);
        return () => {
            window.removeEventListener("storage", setPreferedTheme);
        };
    }, []);

    const setPreferedTheme = () => {
        const _mode = localStorage.getItem("mode");
        if (_mode) {
            setMode(_mode);
        } else {
            setMode("light");
        }
    };

    useEffect(() => {
        if (mode === "dark") {
            document.body.classList.add("dark-mode");
            localStorage.setItem("mode", "dark");
        } else {
            document.body.classList.remove("dark-mode");
            localStorage.setItem("mode", "light");
        }
    }, [mode]);

    return (
      <div className="switcher">
          <div className="sun"><BsSunFill/></div>
            <a
            className="mode-switcher-container"
        > 
            {mode === "dark" ? 
                <div className='mode-switch' onClick={() =>
                    setMode(mode => (mode === "dark" ? "light" : "dark"))   
                }>
                    <div className="icon"></div>
                    <div className="icon active"></div>
                </div> 
                :
                <div className='mode-switch' onClick={() =>
                    setMode(mode => (mode === "dark" ? "light" : "dark"))   
                }>
                    <div className="icon active"></div>
                    <div className="icon"></div>
                </div> 
            }                           
        </a>
       <div className="moon"> <BsMoonFill/></div>
      </div>
    );
}

export default ThemeSwitcher;