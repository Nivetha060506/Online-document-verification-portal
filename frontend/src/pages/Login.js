import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
// // // import { GoogleLogin } from '@react-oauth/google';
import api from '../api';

const Login = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get('role') || 'student';
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = role === 'admin' ? '/auth/admin/login' : '/auth/login';
            const res = await api.post(endpoint, { email, password });

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.role);
            localStorage.setItem('user', JSON.stringify(res.data.user));

            if (res.data.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/student/dashboard');
            }
        } catch (err) {
            console.error('Login Error:', err);
            if (!err.response) {
                setError('Network Error: Unable to connect to server. Please ensure backend is running.');
            } else {
                // Display the specific error message from backend (e.g., "Invalid Email or Password")
                setError(err.response.data?.message || 'Login failed. Please try again.');
            }
        }
    };

    // const handleGoogleSuccess = async (credentialResponse) => {
    //     try {
    //         const res = await api.post('/auth/google-login', {
    //             token: credentialResponse.credential,
    //             role: role // Pass the current role to backend
    //         });

    //         localStorage.setItem('token', res.data.token);
    //         localStorage.setItem('role', res.data.role);
    //         localStorage.setItem('user', JSON.stringify(res.data.user));

    //         if (res.data.role === 'admin') {
    //             navigate('/admin/dashboard');
    //         } else {
    //             navigate('/student/dashboard');
    //         }

    //     } catch (err) {
    //         console.error('Google Login Error:', err);
    //         setError('Google Sign-In Failed');
    //     }
    // };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
            <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl mx-auto mb-6 flex items-center justify-center overflow-hidden border border-slate-200">
                    <img src="/logo.png" alt="Doc Verify Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Doc Verify</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">Secure Node Access</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
                <h2 className="text-xl font-black mb-8 text-center capitalize text-slate-800 tracking-tight">{role} Authentication</h2>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                            autoComplete="off"
                            name="email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                            autoComplete="new-password"
                            name="password"
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                        Login
                    </button>

                    <div className="mt-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500"></span>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center">
                            {/* <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                    setError('Google Sign-In Failed');
                                }}
                            /> */}
                        </div>
                    </div>
                </form>
                {role === 'student' && (
                    <div className="mt-4 text-center text-sm">
                        Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
