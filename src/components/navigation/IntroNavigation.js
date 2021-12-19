import React from 'react'

import AnchorLink from 'react-anchor-link-smooth-scroll'

export default function IntroNavigation() {
    return (
        <div id="navbar">
         <AnchorLink href='#about'>About</AnchorLink>
        <AnchorLink href='#user'>User</AnchorLink>
        <AnchorLink href='#contractor'>Contractor</AnchorLink>
      </div>
    )
}
