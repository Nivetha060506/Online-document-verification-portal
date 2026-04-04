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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Student Registration</h2>
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
