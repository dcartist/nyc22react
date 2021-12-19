import React from 'react'
import logo from '../../images/logos/nyc29_large_white.png';
import AnchorLink from 'react-anchor-link-smooth-scroll'

export default function IntroNavigation() {
    return (
        <ul id="navbar">
            <span className='intro_logo_section'>
                <li><img src={logo} className='intro_nav_logo' /></li>
                <li><AnchorLink href='#home'>Home</AnchorLink></li>
            </span>
            <li><AnchorLink href='#about'>About</AnchorLink></li>
            <li><AnchorLink href='#user'>User Section</AnchorLink></li>
            <li><AnchorLink href='#contractor'>Contractor Section</AnchorLink></li>
      </ul>
    )
}
