import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../src/navbar.css';
import Icon from '../../../src/img/developer-icon.png'


const Navbar = () => {
    return (
        <div class="nav">
            
                <nav class="navbar navbar-inverse">
                <div className="navbar-header fixed">
                    <h1>
                        <a className="navbar-brand" href="#index.html"><i class="material-icons">
                            code
                            </i><span>DevConnector</span></a></h1>
                </div>
                
                  
                <a className="navbar-brand dev" href="#profile.html"><img src={Icon} alt=""/>Developers</a>
                

                <a className="navbar-brand dev" href="#register.html"><div class="me"><i class="material-icons">
                    person
              </i></div>register </a>
               
                    
                <a className="navbar-brand dev" href="#login.html"><div class="me"> <i class="material-icons">
                    input
              </i>  </div> Login </a>
                
                
            </nav>
        </div>
       
    );
}


export default Navbar;
