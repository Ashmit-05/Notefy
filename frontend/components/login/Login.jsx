import { ClientPageRoot } from 'next/dist/client/components/client-page';
import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLogin = () => {
        alert("Clicked the login button!");
    }

    return (
        <div className='container'>
            <div className='login-container'>
                <h2 className='login-heading'>Login</h2>
                <form
                    onSubmit={handleSubmit}
                    className='login-form-container'>
                    <input
                        name={email}
                        type='email'
                        className='email'
                        placeholder='E-mail'
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                        required
                    />
                    <input
                        name={password}
                        type='password'
                        className='password'
                        placeholder='Password'
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        required
                    />
                    {/* add a onClick function here to handle what you want to do when the login button is pressed */}
                    <button
                        type='submit'
                        className='login-button'
                    onClick={handleLogin}>Continue</button>
                </form>
                <p
                    className='signup-text'>Don't have an account?
                    <Link to="/user-signup" style={styledLink}>Signup
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login