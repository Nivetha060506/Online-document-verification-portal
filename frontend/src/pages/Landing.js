import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 mb-6 bg-white rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                <img src="/logo.png" alt="Doc Verify Logo" className="w-full h-full object-cover scale-110" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-black mb-6 text-slate-900 tracking-tighter leading-none">Doc Verify</h1>
            <p className="text-slate-500 font-medium mb-12 max-w-lg mx-auto">
                Secure institutional document verification protocol. Establish trust through cryptographic integrity.
            </p>
            <div className="space-x-4">
                <Link to="/login?role=admin" className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
                    Login as Admin
                </Link>
                <Link to="/login?role=student" className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition">
                    Login as User (Student)
                </Link>
            </div>
        </div>
    );
};

export default Landing;
