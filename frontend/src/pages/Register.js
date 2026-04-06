import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        regNo: '',
        department: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/student/dashboard'); // Or login page
        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
            <div className="mb-10 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-xl mx-auto mb-6 flex items-center justify-center overflow-hidden border border-slate-200">
                    <img src="/logo.png" alt="Doc Verify Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Doc Verify</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">New Node Registration</p>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
                <h2 className="text-xl font-black mb-8 text-center text-slate-800 tracking-tight">Student Enrollment</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input name="name" placeholder="Full Name" onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" required />
                    <input name="regNo" placeholder="Register Number" onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" required />
                    <input name="department" placeholder="Department" onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" required />
                    <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full mb-3 px-3 py-2 border rounded" required />
                    <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full mb-4 px-3 py-2 border rounded" required />
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Register</button>
                </form>
                <div className="mt-4 text-center text-sm">
                    Already have an account? <Link to="/login?role=student" className="text-blue-600 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
