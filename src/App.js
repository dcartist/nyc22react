import './style.scss';
import React, { useState, useEffect } from 'react';
import {Route, Link, Redirect, Switch} from "react-router-dom";
import Home from "./pages/intro/Intro"
import About from "./pages/about/About"
import AboutMain from "./pages/about/AboutMain"
import Dashboard from "./pages/dashboard/Client"
import Zombies from "./pages/dashboard/Zombie"
import axios from 'axios'
function App() {
 
  // const getGames = () => {
  //   return fetch('http://localhost:3001/games/').then(response => response.json());
  // };
  

  useEffect(() =>
  axios.get("https://ancient-fjord-10674.herokuapp.com/").then(res => console.log(res.data))
  // .then(setBook)
    
)

  return (
    <div className="main">
      <Switch>
      <Route path="/about"><AboutMain /></Route>
      <Route path="/dashboard"><Dashboard /></Route>
      <Route exact path="/"><Home /></Route>
      <Route path="/zombie"><Zombies /></Route>
      {/* <Route path="/zombie"><Zombies /></Route> */}

        </Switch>
    </div>
  );
}

export default App;
