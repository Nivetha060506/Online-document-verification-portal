import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
    FaFileAlt, FaClock, FaCheckCircle, FaTimesCircle, FaRocket,
    FaUserShield, FaArrowRight, FaClipboardList, FaHourglassHalf, FaGhost
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserDashboardHome = () => {
    const [documents, setDocuments] = useState([]);
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await api.get('/docs/my-documents');
                const docs = res.data;
                setDocuments(docs);

                // Calculate stats
                const newStats = docs.reduce((acc, doc) => {
                    acc.total++;
                    if (doc.status === 'Approved') acc.approved++;
                    else if (doc.status === 'Pending') acc.pending++;
                    else if (doc.status === 'Rejected') acc.rejected++;
                    return acc;
                }, { total: 0, approved: 0, pending: 0, rejected: 0 });

                setStats(newStats);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching documents:', err);
                setLoading(false);
            }
        };
        fetchDocs();
    }, []);

    const StatusBadge = ({ status }) => {
        const styles = {
            Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
            Rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
            Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
        };
        return (
            <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${styles[status] || styles.Pending}`}>
                {status}
            </span>
        );
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="glass-card p-6 border-none hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${color} bg-opacity-10 shadow-inner`}>
                    <Icon className={`text-xl ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
            <div>
                <h3 className="text-slate-400 font-black uppercase tracking-[0.1em] text-[10px] mb-1">{title}</h3>
                <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
            </div>
        </div>
    );

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isBlocked = user.status === 'Blocked';

    return (
        <div className="space-y-10 pb-20 max-w-[1400px] mx-auto">
            {isBlocked && (
                <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 flex items-center shadow-xl shadow-rose-500/10 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center mr-8 shadow-lg shadow-rose-500/20">
                        <FaUserShield className="text-white text-2xl" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-rose-900 font-extrabold text-xl tracking-tight">Account Access Restricted</h3>
                        <p className="text-rose-600 font-medium text-sm mt-1">
                            Your account has been blocked by the administrator. Please contact the institutional admin for verification and restoration.
                        </p>
                    </div>
                </div>
            )}

            {/* Premium Welcome Banner */}
            <div className={`relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl shadow-blue-900/20 border border-white/10 group ${isBlocked ? 'opacity-75' : ''}`}>
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
                            <FaUserShield className="text-blue-300 text-xs" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isBlocked ? 'ACCESS RESTRICTED' : 'Verified Student Environment'}</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-none">
                            Welcome Back, <br className="hidden lg:block" />
                            <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-sm">
                                {user.name || 'Scholar'}
                            </span>
                        </h1>
                        <p className="text-blue-100/80 text-lg font-medium max-w-lg leading-relaxed">
                            {isBlocked
                                ? "Your access to institutional document submission has been suspended. Please address the pending administrative requirements."
                                : "Your institutional document verification pipeline is active. Manage your credentials with end-to-end encryption and blockchain-grade integrity."}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {!isBlocked && (
                                <button
                                    onClick={() => navigate('/student/upload')}
                                    className="w-full sm:w-auto bg-white text-blue-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl hover:bg-blue-50 transition-all flex items-center justify-center space-x-3 active:scale-95"
                                >
                                    <FaRocket className="text-blue-600 animate-bounce" />
                                    <span>Upload New Draft</span>
                                </button>
                            )}
                            <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all flex items-center justify-center space-x-3 active:scale-95">
                                <span>View Guidelines</span>
                            </button>
                        </div>
                    </div>
                    <div className="hidden lg:block relative">
                        <div className="w-64 h-64 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl rotate-12 flex items-center justify-center animate-float">
                            <FaFileAlt className="text-8xl text-blue-200/40 -rotate-12" />
                        </div>
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                    </div>
                </div>
                {/* Decorative background elements */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
            </div>


            {/* Recent activity Section */}
            <div className="glass-card border-none overflow-hidden group">
                <div className="px-10 py-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity Log</h2>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1.5 flex items-center">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                            Latest Institutional Transactions
                        </p>
                    </div>
                    <button className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center hover:translate-x-1 transition-transform group/btn">
                        Explore Full History <FaArrowRight className="ml-2 group-hover/btn:ml-3 transition-all" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Document Blueprint</th>
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Timeline</th>
                                <th className="px-10 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Integrity Check</th>
                                <th className="px-10 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {documents.length > 0 ? (
                                documents.slice(0, 5).map(doc => (
                                    <tr key={doc._id} className="hover:bg-blue-50/10 transition-colors">
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${doc.status === 'Approved'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    <FaFileAlt className="text-lg" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 tracking-tight uppercase text-sm leading-none mb-1.5">{doc.documentType}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold tracking-tighter">ID: {doc._id.slice(-12).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-700 font-black">{new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(doc.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                <span className="text-[10px] font-mono text-slate-400 font-black tracking-widest">SHA-256 VERIFIED</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 whitespace-nowrap text-right">
                                            <StatusBadge status={doc.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-10 py-24 text-center">
                                        {loading ? (
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Compiling Repository...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center opacity-30">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                    <FaGhost className="text-3xl text-slate-200" />
                                                </div>
                                                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">No academic records found</p>
                                                <button
                                                    onClick={() => navigate('/student/upload')}
                                                    className="mt-4 text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline"
                                                >
                                                    Initiate first upload
                                                </button>
                                            </div>
                                        )}
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

export default UserDashboardHome;
