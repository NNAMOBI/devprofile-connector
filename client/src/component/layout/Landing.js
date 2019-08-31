import React from 'react'
import '../../../src/landing.css'


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
                        <a class="btn btn-danger hover" href="#register.html">Signup</a>   
                        <a class="btn btn-primary hover2" href="#login.html">Login</a>
                   </div>
                </div>

            </div>

        </section>
    )
}

export default Landing

