import './style.scss';
import {Route, Link, Redirect, Switch} from "react-router-dom";
import Home from "./pages/intro/Intro"
import About from "./pages/about/About"
function App() {
 
 

  return (
    <div className="main">
      <Switch>
      <Route path="/about">
            <About />
          </Route>

          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </div>
  );
}

export default App;
