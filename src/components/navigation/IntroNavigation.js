import React from 'react'

import AnchorLink from 'react-anchor-link-smooth-scroll'

export default function IntroNavigation() {
    return (
        <ul id="navbar">
            <li><AnchorLink href='#about'>About</AnchorLink></li>
            <li><AnchorLink href='#user'>User</AnchorLink></li>
            <li><AnchorLink href='#contractor'>Contractor</AnchorLink></li>
      </ul>
    )
}
