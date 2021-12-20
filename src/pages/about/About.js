import React from 'react'
import helmet from "../../images/photos/helmets.png"
// import "animate.css/animate.min.css";
import 'animate.css';
import ScrollAnimation from 'react-animate-on-scroll';

export default function About() {
    return (
        <div className='about'>
            <div>
            <ScrollAnimation duration={3} animateIn="fadeIn" className='animate__fadeIn' >
            <img src={helmet}/>
</ScrollAnimation>
          
                </div>
            <div><p>NYC22 is a demo application based on the New York Department of Buildings (DOB)'s job application filings. It contains all job applications submitted through the Borough Offices, through eFiling, or the HUB, from January 1, 2000, to 2019.</p>
          <p>In this react node application, the users can view the demo as either a contract or a construction job client.</p>
         
          <h2>Technology Used</h2>
<ul>
    <li>Node</li>
    <li>Javascript</li>
    <li>React JS</li>
    <li>Axios</li>
    <li>Express</li>
    <li>Mongo</li>
    <li>CSS</li>
    <li>Vercel (Front-End)</li>
    <li>Heroku (Back-End)</li>
</ul>
          </div>
        </div>
    )
}
