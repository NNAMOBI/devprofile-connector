import React from 'react'
import '../../../src/landing.css'
import { Link } from 'react-router-dom';


const Landing = () => {
    return (
        <section class="landing">
            <div class="dark-overlay">
                <div class="landing-inner">
                    <h1 class="x-large">Developer Connector</h1>
                    <p class="lead">
                        <span>Create a developer profile/portfolio, share post and get help from
                        other developers</span>
                    </p>
                    <div class="buttons">
                        <Link to="/register" class="btn btn-danger hover">Signup</Link>   
                        <Link to="/login" class="btn btn-primary hover2">Login</Link>
                   </div>
                </div>

            </div>

        </section>
    )
}

export default Landing

