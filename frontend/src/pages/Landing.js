import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Simple Nav */}
            <nav className="border-b px-8 py-4 flex justify-between items-center max-w-7xl mx-auto">
                <div className="text-2xl font-black text-blue-600">ODV Portal</div>
                <div className="space-x-4">
                    <Link to="/login?role=admin" className="text-gray-600 hover:text-blue-600 font-bold transition">Admin Portal</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-8 pt-20 text-center">
                <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-6">
                    Institutional Document <span className="text-blue-600">Verification</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                    A secure platform for educational institutions to issue and verify academic credentials with absolute integrity.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
                    <Link to="/login?role=student" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-all">
                        Student Access Portal
                    </Link>
                    <Link to="/verify" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:scale-105 transition-all">
                        Quick Verification
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t">
                    <FeatureCard title="Anti-Forgery" desc="Advanced hashing algorithms to prevent document manipulation." />
                    <FeatureCard title="Instant Access" desc="Verify any credential instantly with a unique identifier." />
                    <FeatureCard title="Institutional Trust" desc="A standardized protocol for academic record management." />
                </div>
            </main>

            <footer className="py-10 text-center text-slate-400 text-xs border-t">
                &copy; {new Date().getFullYear()} Online Document Verification Secure Network. All rights reserved.
            </footer>
        </div>
    );
};

const FeatureCard = ({ title, desc }) => (
    <div className="p-6 bg-slate-50 rounded-2xl text-left border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500">{desc}</p>
    </div>
);

export default Landing;
