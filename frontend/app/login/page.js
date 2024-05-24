'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    const handleLogin = async () => {
        console.log('Clicked the login button!');
        const response = await fetch('http://localhost:8080/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        if (response.status === 200) {
            alert('Login successful');
            localStorage.setItem('email', email);
            router.push('/');
        } else {
            alert('Login failed');
        }
    };

    return (
        <div className="container">
            <div className="login-container">
                <h2 className="login-heading">Login</h2>
                <form onSubmit={(e) => e.preventDefault()} className="login-form-container">
                    <input
                        name={email}
                        type="email"
                        className="email"
                        placeholder="E-mail"
                        onChange={(event) => setEmail(event.target.value)}
                        value={email}
                        required
                    />
                    <input
                        name={password}
                        type="password"
                        className="password"
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        required
                    />
                    {/* add a onClick function here to handle what you want to do when the login button is pressed */}
                    <button type="submit" className="login-button" onClick={handleLogin}>
                        Continue
                    </button>
                </form>
                <p className="signup-text">
                    Don't have an account?
                    <Link href="/signup">Signup</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
