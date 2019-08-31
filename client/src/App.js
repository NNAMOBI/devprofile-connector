import React,{Fragment} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import './App.css';
import Navbar from './component/layout/Navbar'
import Landing from './component/layout/Landing';

const App =()=> (

  <Fragment>

    <Navbar />
    <Landing />
    
  </Fragment>
  
)

export default App;
