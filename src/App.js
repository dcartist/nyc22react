import './style.scss';
import {Route, Link, Redirect, Switch} from "react-router-dom";
import Home from "./pages/intro/Intro"
import About from "./pages/about/About"
import Dashboard from "./pages/dashboard/Client"
import Zombies from "./pages/dashboard/Zombie"

function App() {
 
 

  return (
    <div className="main">
      <Switch>
      <Route path="/about"><About /></Route>
      <Route path="/dashboard"><Dashboard /></Route>
      <Route exact path="/"><Home /></Route>
      <Route path="/zombie"><Zombies /></Route>

        </Switch>
    </div>
  );
}

export default App;
