import React, { Fragment, useState } from 'react'
import {Link} from 'react-router-dom'
import '../../../src/signup.css'
// import axios from 'axios'
import { connect } from 'react-redux'
import {setAlert} from '../../actions/alert' // import the action to be used in this component
import PropTypes from 'prop-types'

const Signup = (props) => {

    const { setAlert } = props;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""

    })

    const { name, email, password, password2 } = formData;

    const onChange = (e) => setFormData({...formData, [e.target.name]: e.target.value})

    const onSubmit = async (e) => {
        e.preventDefault();
        if(password !== password2){
            setAlert("password do not Match", 'danger') // instead of just alert(password dont match)
        } else{
            
            // An example of how to make a request inside the component else Redux can handle it.

            // const newUser = {
            //     name,
            //     email,
            //     password
            // }

            // try{
            //     const config = {
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     }

            //     const body = JSON.stringify(newUser);

            //     const res = await axios.post('/api/users', body, config)
            //     console.log(res.data)

            // }
            // catch(error){
            //     console.error(error.response.data)
            // }
            console.log('SUCCESS')
        }
    }


    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"> <i class="material-icons you">
                person
              </i>   <b> Create Your Account</b></p>
            <form onSubmit={(e) => onSubmit(e)}>
                <div class="form-group">
                    <label for="Name"></label>
                    <input type="Name" value={name} name="name" class="form-control" id="Name" placeholder="Name"
                    onChange={(e)=> onChange(e)} required/>
  </div>
                    <div class="form-group">
                        <label for="pwd"></label>
                        <input type="Email" value={email} name="email" class="form-control" id="Email" 
                        onChange={(e) => onChange(e) } placeholder="Email Address" required/>
                </div>
                <div class="form-group">
                    <label for="pwd"></label>
                    <input type="password" name="password" value={password} class="form-control" id="Password" 
                    onChange={(e) =>onChange(e) } placeholder="Password" required />
                    <small class="form-text">This site uses Gravatar so if you want a profile image, Use a Gravatar email</small>
                </div>
                <div class="form-group">
                    <label for="pwd"></label>
                    <input type="password" class="form-control" value={password2} name="password2" id="password2" 
                    onChange={(e) =>onChange(e)} placeholder="Confirm Password" required/>
                </div>
                        <div class="checkbox">
                            <label><input type="checkbox"/> Remember me</label>
  </div>
                            <button type="submit" class="btn btn-primary" value="Register">Register</button>
</form>
            <p className=""> Already have an account? <Link to="/login">Sign In</Link></p>
        </Fragment>
    )
}

Signup.propTypes = {
    setAlert: PropTypes.func.isRequired  // proptypes are used to validate the props used in the component
}

export default connect(null, {setAlert})(Signup);
