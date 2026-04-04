import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
    FaChartPie, FaClock, FaCheckCircle, FaTimesCircle,
    FaUserGraduate, FaUpload, FaFileAlt, FaUserCircle, FaSignOutAlt, FaShieldAlt
} from 'react-icons/fa';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/');
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <li>
                <Link
                    to={to}
                    className={`flex items-center space-x-4 py-3.5 px-6 rounded-2xl transition-all duration-300 group ${isActive
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 font-black scale-[1.02]'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white font-bold'
                        }`}
                >
                    <Icon className={`text-lg shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                    <span className="text-xs uppercase tracking-[0.15em]">{children}</span>
                </Link>
            </li>
        );
    };

    return (
        <div className="w-72 h-screen bg-slate-950 text-white fixed top-0 left-0 flex flex-col shadow-2xl z-30 border-r border-white/5">
            {/* Branding Section */}
            <div className="p-8 pb-10 flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <FaShieldAlt className="text-white text-xl" />
                </div>
                <div>
                    <span className="text-xl font-black tracking-tighter text-white block leading-none">VERIFY</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mt-1 block">Institutional</span>
                </div>
            </div>

            {/* Navigation Mesh */}
            <nav className="flex-1 p-4 overflow-y-auto modern-scrollbar">
                <ul className="space-y-2">
                    {role === 'admin' ? (
                        <>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-6 mb-4 mt-4">Core Intelligence</div>
                            <NavLink to="/admin/dashboard" icon={FaChartPie}>Analytics</NavLink>
                            <NavLink to="/admin/pending" icon={FaClock}>Review Queue</NavLink>

                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-6 mb-4 mt-8">Database</div>
                            <NavLink to="/admin/verified" icon={FaCheckCircle}>Certifications</NavLink>
                            <NavLink to="/admin/rejected" icon={FaTimesCircle}>Revocations</NavLink>
                            <NavLink to="/admin/students" icon={FaUserGraduate}>Directory</NavLink>
                        </>
                    ) : (
                        <>
                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-6 mb-4 mt-4">Dashboard</div>
                            <NavLink to="/student/dashboard" icon={FaChartPie}>Overview</NavLink>
                            <NavLink to="/student/upload" icon={FaUpload}>Submit Draft</NavLink>
                            <NavLink to="/student/my-documents" icon={FaFileAlt}>Repository</NavLink>

                            <div className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-6 mb-4 mt-8">Identity</div>
                            <NavLink to="/student/profile" icon={FaUserCircle}>My Profile</NavLink>
                        </>
                    )}
                </ul>
            </nav>

            {/* Footer Profile Section */}
            <div className="p-6 border-t border-white/5 bg-slate-900/50">
                <div className="flex items-center space-x-4 mb-6 px-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 font-black border border-white/5 relative">
                        {user.name?.charAt(0) || 'U'}
                        <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-slate-950 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-white truncate uppercase tracking-tight">{user.name || 'Unknown User'}</p>
                        <p className="text-[10px] text-slate-500 truncate font-bold lowercase tracking-normal">{user.email || 'offline_node@sys'}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-3 w-full py-4 px-4 bg-slate-800/50 hover:bg-rose-500/10 hover:text-rose-500 text-slate-400 rounded-2xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest border border-white/5"
                >
                    <FaSignOutAlt className="text-sm" />
                    <span>Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
