import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../src/navbar.css';
import Icon from '../../../src/img/developer-icon.png'
import { Link } from 'react-router-dom';


const Navbar = () => {
    return (
        <div class="nav">
            
                <nav class="navbar navbar-inverse">
                <div className="navbar-header fixed">
                    <h1>
                        <Link className="navbar-brand" to="/"><i class="material-icons">
                            code
                            </i><span>DevConnector</span></Link></h1>
                </div>
                
                  
                <a className="navbar-brand dev" href="#profile.html"><img src={Icon} alt=""/>Developers</a>
                

                <Link to="register" className="navbar-brand dev"><div class="me"><i class="material-icons">
                    person
              </i></div>register</Link>
               
                    
                <Link to="login" className="navbar-brand dev"><div class="me"> <i class="material-icons">
                    input
              </i>  </div> Login </Link>
                
                
            </nav>
        </div>
       
    );
}


export default Navbar;
