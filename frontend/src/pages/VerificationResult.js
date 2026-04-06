import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { FaCheckCircle, FaExclamationCircle, FaClock, FaIdCard, FaUniversity, FaCalendarAlt, FaFingerprint, FaShieldAlt, FaCopy, FaCheck } from 'react-icons/fa';

const VerificationResult = () => {
    const { id } = useParams();
    const [docId, setDocId] = useState(id || '');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (id) {
            handleVerify(null, id);
        }
    }, [id]);

    const handleVerify = async (e, directId = null) => {
        if (e) e.preventDefault();
        const searchId = directId || docId;
        if (!searchId) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const res = await api.get(`/docs/verify/${searchId}`);
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError('Document could not be verified. Please ensure the Code/ID is correct and try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        const url = window.location.origin + '/verify/' + (result?.id || docId);
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const StatusCard = ({ status }) => {
        const configs = {
            Approved: {
                icon: FaCheckCircle,
                badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
                title: 'AUTHENTIC DOCUMENT',
                header: 'bg-emerald-600',
                shadow: 'shadow-emerald-500/10',
                glow: 'emerald-500'
            },
            Rejected: {
                icon: FaExclamationCircle,
                badge: 'bg-rose-100 text-rose-700 border-rose-200',
                title: 'INVALID DOCUMENT',
                header: 'bg-rose-600',
                shadow: 'shadow-rose-500/10',
                glow: 'rose-500'
            },
            Pending: {
                icon: FaClock,
                badge: 'bg-amber-100 text-amber-700 border-amber-200',
                title: 'VERIFICATION PENDING',
                header: 'bg-amber-600',
                shadow: 'shadow-amber-500/10',
                glow: 'amber-500'
            }
        };

        const config = configs[status] || configs.Pending;
        const Icon = config.icon;

        return (
            <div className={`glass-card overflow-hidden border-none ${config.shadow} animate-in zoom-in-95 duration-500`}>
                <div className={`h-2 ${config.header}`}></div>
                <div className="p-8 lg:p-10 space-y-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`p-5 rounded-full ${config.badge} bg-opacity-20 relative`}>
                            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 bg-${config.glow}`}></div>
                            <Icon className="text-5xl relative z-10" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{config.title}</h2>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-[0.3em] mt-3">Digital Audit Status Report</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <DetailItem icon={FaIdCard} label="Candidate Name" value={result.studentName} />
                        <DetailItem icon={FaUniversity} label="Institutional Data" value={`${result.regNo} — ${result.department}`} />
                        <DetailItem icon={FaShieldAlt} label="Document Blueprint" value={result.documentType} />
                        <DetailItem icon={FaIdCard} label="Credential ID" value={result.documentId || result.id} />
                        <DetailItem icon={FaCalendarAlt} label="Upload Timeline" value={new Date(result.uploadDate).toLocaleDateString(undefined, { dateStyle: 'long' })} />
                        {result.verificationDate && <DetailItem icon={FaCheckCircle} label="Authorized Date" value={new Date(result.verificationDate).toLocaleDateString(undefined, { dateStyle: 'long' })} />}
                        <div className="md:col-span-2">
                            <DetailItem icon={FaFingerprint} label="Digital Integrity Hash" value={result.fileHash} fullValue={result.fileHash} />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center space-x-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 w-full sm:w-auto justify-center"
                        >
                            {copied ? <FaCheck className="text-emerald-400" /> : <FaCopy />}
                            <span>{copied ? 'Link Copied' : 'Share Verification'}</span>
                        </button>

                        <Link to="/" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline px-4">
                            Institutional Portal
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    const DetailItem = ({ icon: Icon, label, value, fullValue }) => (
        <div className="space-y-1.5 group">
            <div className="flex items-center space-x-2">
                <Icon className="text-slate-300 text-xs" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
            </div>
            <p className="text-sm font-extrabold text-slate-800 tracking-tight break-all" title={fullValue}>{value}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 lg:p-10 font-inter">
            <div className="w-full max-w-2xl space-y-8">
                <div className="text-center space-y-3">
                    <div className="inline-block p-3.5 bg-blue-600 rounded-2xl shadow-2xl shadow-blue-500/20 mb-4 animate-bounce">
                        <FaShieldAlt className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">Global Verification</h1>


                    <p className="text-slate-500 font-medium text-sm">Validating institutional integrity through cryptographic proof-of-authenticity.</p>
                </div>

                {!id && !result && (
                    <form onSubmit={handleVerify} className="glass-card p-10 border-none shadow-2xl shadow-slate-200 animate-in slide-in-from-bottom-4 duration-700">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block text-center">Reference Credential Code</label>
                                <input
                                    type="text"
                                    value={docId}
                                    onChange={(e) => setDocId(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-center text-lg font-black tracking-widest focus:border-blue-500 focus:ring-0 transition-all placeholder:text-slate-200 outline-none"
                                    placeholder="64f1...XXXX"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-5 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] hover:bg-blue-700 transition-all active:scale-[0.98] shadow-2xl shadow-blue-500/30 disabled:opacity-50"
                            >
                                {loading ? 'Checking Records...' : 'Search'}
                            </button>
                        </div>
                    </form>
                )}

                {loading && !result && (
                    <div className="flex flex-col items-center space-y-6 py-24">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaShieldAlt className="text-blue-100 text-xl" />
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Loading data...</p>
                    </div>
                )}

                {error && (
                    <div className="glass-card p-10 border-none bg-rose-50/50 border border-rose-100 text-center space-y-6 animate-in shake-1">
                        <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-rose-200/50">
                            <FaExclamationCircle className="text-2xl text-rose-500" />
                        </div>
                        <div>
                            <h3 className="text-rose-900 font-black text-lg uppercase tracking-tight">Verification Aborted</h3>
                            <p className="text-rose-600/70 font-bold text-xs mt-1 leading-relaxed">{error}</p>
                        </div>
                        <button onClick={() => window.location.reload()} className="px-6 py-3 bg-white text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">Reset & Try Again</button>
                    </div>
                )}

                {result && <StatusCard status={result.status} />}
            </div>

            <footer className="mt-20 text-center space-y-6">
                <div className="flex items-center justify-center space-x-3 opacity-20">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <div className="w-8 h-[1px] bg-slate-400"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                    <div className="w-8 h-[1px] bg-slate-400"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">ODV Secure Network • Institutional Integrity Protocol</p>
            </footer>
        </div>
    );
};

export default VerificationResult;
