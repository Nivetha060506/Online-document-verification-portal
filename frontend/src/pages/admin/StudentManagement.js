import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
    FaUserGraduate, FaIdCard, FaUniversity, FaEnvelope,
    FaShieldAlt, FaUserSlash, FaUserCheck, FaSearch
} from 'react-icons/fa';

const StudentManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('/admin/students');
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching students:', err);
            setLoading(false);
        }
    };

    const toggleStatus = async (student) => {
        const newStatus = student.status === 'Active' ? 'Blocked' : 'Active';
        if (window.confirm(`Are you sure you want to ${newStatus === 'Blocked' ? 'block' : 'activate'} this student?`)) {
            try {
                await api.put(`/admin/student/${student._id}/status`, { status: newStatus });
                setStudents(students.map(s => s._id === student._id ? { ...s, status: newStatus } : s));
            } catch (err) {
                console.error('Error updating status:', err);
                const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Server connection error';
                alert('Operation failed: ' + errorMsg);
            }
        }
    };

    const filteredStudents = students.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.regNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Directory</h1>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        Institutional User Management Node
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Name, Reg No, or Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all shadow-sm group-hover:shadow-md"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 bg-blue-600/5 border-blue-100">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Total Enrolled</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{students.length}</p>
                </div>
                <div className="glass-card p-6 bg-emerald-600/5 border-emerald-100">
                    <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active Accounts</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{students.filter(s => s.status === 'Active').length}</p>
                </div>
                <div className="glass-card p-6 bg-rose-600/5 border-rose-100">
                    <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">Blocked Access</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">{students.filter(s => s.status === 'Blocked').length}</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="glass-card border-none overflow-hidden pb-4">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Student Credentials</th>
                                <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified Email</th>
                                <th className="px-8 py-5 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                                <th className="px-8 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Accessing Institutional Database...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length > 0 ? (
                                filteredStudents.map(student => (
                                    <tr key={student._id} className="hover:bg-blue-50/10 transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black">
                                                    <FaUserGraduate className="text-lg" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 tracking-tight uppercase text-sm leading-none mb-1">{student.name}</p>
                                                    <p className="text-[10px] text-blue-500 font-bold tracking-tighter flex items-center gap-1">
                                                        <FaIdCard className="text-[8px]" /> {student.regNo}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <FaUniversity className="text-slate-300" />
                                                {student.department}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <FaEnvelope className="text-slate-300" />
                                                {student.email}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-center">
                                            <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border ${student.status === 'Active'
                                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                                                : 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                                                }`}>
                                                {student.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => toggleStatus(student)}
                                                className={`flex items-center gap-2 ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${student.status === 'Active'
                                                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100'
                                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-100'
                                                    }`}
                                            >
                                                {student.status === 'Active' ? (
                                                    <><FaUserSlash className="text-xs" /> Restrict Access</>
                                                ) : (
                                                    <><FaUserCheck className="text-xs" /> Restore Access</>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center opacity-30">
                                        <FaShieldAlt className="text-5xl text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">No records matching current parameters</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentManagement;
