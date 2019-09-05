import React, {Fragment, useState} from 'react'
import { Link } from 'react-router-dom'
import '../../../src/signup.css'

const Login = () => {

    const [formData, setFormData] = useState({

        email: "",
        password: ""


    })

    const {  email, password} = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log('SUCCESS')
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In </h1>
            <p className="lead">    <i class="material-icons you">
                input
</i>     <b> SignIn into Your Account</b></p>
            <form onSubmit={(e) => onSubmit(e)}>
                
                <div class="form-group">
                    <label for="pwd"></label>
                    <input type="Email" value={email} name="email" class="form-control" id="Email"
                        onChange={(e) => onChange(e)} placeholder="Email Address" required />
                </div>
                <div class="form-group">
                    <label for="pwd"></label>
                    <input type="password" name="password" value={password} class="form-control" id="Password"
                        onChange={(e) => onChange(e)} placeholder="Password" required />
                    
                </div>
                
                <div class="checkbox">
                    <label><input type="checkbox" /> Remember me</label>
                </div>
                <button type="submit" class="btn btn-primary" value="Register">Sign In</button>
            </form>
            <p className=""> Don't have an account? <Link to="/Signup">Sign Up</Link></p>
        </Fragment>
    )
}



export default Login;
