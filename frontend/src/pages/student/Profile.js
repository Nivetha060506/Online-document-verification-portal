import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
    FaUser, FaEnvelope, FaIdCard, FaUniversity, FaShieldAlt,
    FaCalendarAlt, FaFileAlt, FaHourglassHalf, FaSignInAlt,
    FaEdit, FaKey, FaChevronRight, FaTimesCircle
} from 'react-icons/fa';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [editModal, setEditModal] = useState(false);
    const [passwordModal, setPasswordModal] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', department: '', regNo: '' });
    const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pending, setPending] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/auth/profile');
                setProfileData(res.data.user);
                setFormData({
                    name: res.data.user.name,
                    email: res.data.user.email,
                    department: res.data.user.department,
                    regNo: res.data.user.regNo
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Failed to load profile information');
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setPending(true);
        try {
            const res = await api.put('/auth/profile/update', formData);
            setProfileData({ ...profileData, ...res.data.user });
            // Update local storage user info as well
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.data.user }));
            setEditModal(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Update Profile Error:', err);
            const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Update failed';
            alert(`Error: ${errorMsg}`);
        } finally {
            setPending(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            return alert('Passwords do not match');
        }
        setPending(true);
        try {
            await api.put('/auth/profile/change-password', {
                currentPassword: pwdData.currentPassword,
                newPassword: pwdData.newPassword
            });
            setPasswordModal(false);
            setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            alert('Password changed successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Password change failed');
        } finally {
            setPending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass-card p-10 text-center max-w-lg mx-auto mt-10">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaShieldAlt className="text-2xl text-rose-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Access Interrupted</h3>
                <p className="text-slate-500 text-sm mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary w-full">Retry Connection</button>
            </div>
        );
    }

    const { name, email, regNo, department, status, createdAt, lastLogin, stats } = profileData;
    const initial = name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase();

    const InfoCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-white/50 border border-slate-100 p-6 rounded-2xl hover:border-blue-200 transition-all group">
            <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                    <Icon className={`text-lg ${color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{value || 'Not Provided'}</p>
                </div>
            </div>
        </div>
    );

    const StatMiniCard = ({ icon: Icon, label, value, color }) => (
        <div className="flex-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
                    <Icon className={`text-sm ${color.replace('bg-', 'text-')}`} />
                </div>
                <span className="text-xl font-black text-slate-900">{value}</span>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-3">{label}</p>
        </div>
    );

    const Modal = ({ isOpen, onClose, title, children }) => {
        if (!isOpen) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <FaTimesCircle className="text-xl" />
                        </button>
                    </div>
                    <div className="p-8">
                        {children}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Profile Header */}
            <div className="glass-card p-8 lg:p-10 relative overflow-hidden group">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-blue-500/30 border-4 border-white">
                            {initial}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                            <div className={`w-3 h-3 rounded-full ${status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{name}</h1>
                            <span className={`w-fit mx-auto md:mx-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-rose-500/10 text-rose-600 border-rose-200'
                                }`}>
                                {status}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 italic">
                            <FaEnvelope className="text-slate-300 text-sm" />
                            {email}
                        </p>
                        <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
                            <button
                                onClick={() => setEditModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                            >
                                <FaEdit className="text-xs" /> Edit Profile
                            </button>
                            <button
                                onClick={() => setPasswordModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                            >
                                <FaKey className="text-xs" /> Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl -ml-24 -mb-24"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Information Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Personal Credentials</h2>
                            <FaIdCard className="text-slate-200 text-2xl" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoCard
                                icon={FaIdCard}
                                label="Registration Number"
                                value={regNo}
                                color="bg-blue-600"
                            />
                            <InfoCard
                                icon={FaUniversity}
                                label="Department"
                                value={department}
                                color="bg-indigo-600"
                            />
                            <InfoCard
                                icon={FaCalendarAlt}
                                label="Account Created"
                                value={new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                color="bg-emerald-600"
                            />
                            <InfoCard
                                icon={FaShieldAlt}
                                label="Institutional Role"
                                value="Student"
                                color="bg-amber-600"
                            />
                        </div>
                    </div>

                    {/* Security Timeline */}
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                    <FaSignInAlt className="text-blue-400" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Security Timeline</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-white/5">
                                    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Last Login Attempt</span>
                                    <span className="text-xs font-bold">{new Date(lastLogin).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Login IP Address</span>
                                    <span className="text-xs font-bold text-blue-400">Authorized Session</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 opacity-10 translate-x-1/4 translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                            <FaShieldAlt className="text-[200px]" />
                        </div>
                    </div>
                </div>

                {/* Account Activity Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight mb-8">Activity Pulse</h2>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <StatMiniCard
                                    icon={FaFileAlt}
                                    label="Total Drafts"
                                    value={stats?.totalDocuments || 0}
                                    color="bg-blue-600"
                                />
                                <StatMiniCard
                                    icon={FaHourglassHalf}
                                    label="In Review"
                                    value={stats?.pendingDocuments || 0}
                                    color="bg-amber-600"
                                />
                            </div>
                            <div className="flex gap-4">
                                <StatMiniCard
                                    icon={FaShieldAlt}
                                    label="Verified"
                                    value={stats?.approvedDocuments || 0}
                                    color="bg-emerald-600"
                                />
                                <div className="flex-1 bg-slate-50 p-5 rounded-2xl border border-transparent flex flex-col justify-center items-center group cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition-all">
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">View All</p>
                                    <FaChevronRight className="text-blue-600 text-xs mt-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Institutional Profile">
                <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all text-slate-900"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all text-slate-900"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Reg No</label>
                            <input
                                type="text"
                                value={formData.regNo}
                                onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all text-slate-900"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Department</label>
                            <input
                                type="text"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all text-slate-900"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={pending}
                        className={`w-full py-4 mt-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {pending ? 'Processing...' : 'Save Changes'}
                    </button>
                </form>
            </Modal>

            {/* Change Password Modal */}
            <Modal isOpen={passwordModal} onClose={() => setPasswordModal(false)} title="Update Security Credentials">
                <form onSubmit={handleChangePassword} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Current Password</label>
                        <input
                            type="password"
                            value={pwdData.currentPassword}
                            onChange={(e) => setPwdData({ ...pwdData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">New Password</label>
                        <input
                            type="password"
                            value={pwdData.newPassword}
                            onChange={(e) => setPwdData({ ...pwdData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Confirm New Password</label>
                        <input
                            type="password"
                            value={pwdData.confirmPassword}
                            onChange={(e) => setPwdData({ ...pwdData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-blue-500 text-sm font-bold transition-all"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={pending}
                        className={`w-full py-4 mt-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-[0.98] ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {pending ? 'Processing...' : 'Update Password'}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Profile;
