import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-8 text-blue-900">Online Document Verification Portal</h1>
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
