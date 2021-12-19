import React from 'react'
import logo from '../../images/logos/nyc29_large_white.png';
import { Parallax, Background } from "react-parallax";
import firstBackground from "../../images/photos/construction1blkwhite.jpg"
import blueprint from "../../images/photos/blueprint.jpg"
import Nav from "../../components/navigation/IntroNavigation"
import About from "../about/About"
import { StickyNav } from 'react-js-stickynav'
import 'react-js-stickynav/dist/index.css'

export default function Intro() {
    const image1 =
  "https://images.unsplash.com/photo-1498092651296-641e88c3b057?auto=format&fit=crop&w=1778&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D";
  const insideStyles = {
    background: "white",
    padding: 20,
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)"
  };
    return (
        <div>
<Parallax bgImage={firstBackground} strength={500}>
      <div style={{ height: '100vh' }} id="home">
      <div className="intro_main">
      <div className="intro">
      <img src={logo} className="logo"/>
     <div className="contractor"><p>Contractor Management System Demo</p>
     <StickyNav length='40'><Nav></Nav></StickyNav>
     </div>
     
      </div>
    </div>
      </div>
    </Parallax>
<Parallax bgImage={blueprint} strength={500} blur={{ min: -1, max: 5 }}>
      <div style={{ height: '100vh' }} id="about">
        <div style={insideStyles}> <About></About>
          
          </div>
      </div>
    </Parallax>
<Parallax bgImage={image1} strength={500}>
      <div style={{ height: '100vh' }} id="user">
        <div style={insideStyles}>User</div>
      </div>
    </Parallax>
<Parallax bgImage={image1} strength={500}>
      <div style={{ height: '100vh' }} id="contractor">
        <div style={insideStyles}>Contractor</div>
      </div>
    </Parallax>
        </div>
    )
}
