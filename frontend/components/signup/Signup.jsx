import React, { useState } from 'react';

function Signup() {

    const [userInfo, setUserInfo] = useState({
       name:"",
        email: "",
        password: ""
    });

    let name, value;

    const data = (event) => {
        name = event.target.name;
        value = event.target.value;
        setUserInfo({ ...userInfo, [name]: value });
    }

    const handleSignup = () => {
        alert("Clicked the signup button!");
    }

    return (
        <div className='container'>
            <div className='signup-container'>
                <h2 className='signup-heading'>SignUp</h2>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className='signup-form-container'>
                    <input
                        name="name"
                        type='text'
                        className='name'
                        placeholder='Name'
                        onChange={data}
                        required
                        value={userInfo.name}
                    />
                    <input
                        name="email"
                        type='email'
                        className='email'
                        placeholder='E-mail'
                        onChange={data}
                        required
                        value={userInfo.email}
                    />
                    <input
                        name="password"
                        type='password'
                        className='password'
                        placeholder='Password'
                        onChange={data}
                        required
                        value={userInfo.password}
                    />
                    {/* add a onClick function here to handle what you want to do when the signup button is pressed */}
                    <button
                        type='submit'
                        className='signup-button'
                        onClick={handleSignup}>SignUp</button>
                </form>
                {/* use in case need redirection to the login page with the sutable  path */}
                {/* <p
                    className='login-text'>Already have an account?
                    <Link to="/user-login">Login
                    </Link> 
                </p> */}
            </div>
        </div>
    )
}
export default Signup