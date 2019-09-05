import React,{Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './App.css';
import Navbar from './component/layout/Navbar'
import Landing from './component/layout/Landing';
import Signup from '../src/component/auth/signup';
import Login from '../src/component/auth/login';

// Router library makes it possible to use the routing on the front end instead of using a http mehtod

const App =()=> (
  <Router> 

  <Fragment>

    <Navbar />
      {/* <Landing /> // instead of landing as a child component been called under app.js, we can use route tag */}
      <Route exact path='/' component={Landing}></Route>
      <section className="container">
        <switch>
          <Route exact path='/register' component={Signup}></Route>
          <Route exact path="/login" component={Login}></Route>
        </switch>
      </section>
    
    </Fragment>
  </Router>
  
)

export default App;
