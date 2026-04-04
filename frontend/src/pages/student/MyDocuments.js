import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
    FaFileAlt, FaCalendarCheck, FaInfoCircle, FaCheckCircle,
    FaExclamationCircle, FaClock, FaTimes, FaDownload,
    FaQrcode, FaSearch, FaFilter
} from 'react-icons/fa';

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        Rejected: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
    };
    const Icon = status === 'Approved' ? FaCheckCircle : status === 'Rejected' ? FaExclamationCircle : FaClock;

    return (
        <span className={`px-2.5 py-1 inline-flex items-center space-x-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg border ${styles[status] || styles.Pending}`}>
            <Icon className="text-[10px]" />
            <span>{status}</span>
        </span>
    );
};

const MyDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/docs/my-documents');
            setDocuments(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setLoading(false);
        }
    };

    const downloadQRCode = (qrCode, docName) => {
        const link = document.createElement('a');
        link.href = qrCode;
        link.download = `QR_${docName.replace(/\s+/g, '_')}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const DocumentCard = ({ doc }) => (
        <div className="glass-card overflow-hidden border-none hover:translate-y-[-4px] transition-all duration-300 group">
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl ${doc.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'} transition-colors`}>
                        <FaFileAlt className="text-xl" />
                    </div>
                    <StatusBadge status={doc.status} />
                </div>

                <div>
                    <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1 group-hover:text-blue-600 transition-colors uppercase">{doc.documentType}</h3>
                    <p className="text-[10px] text-slate-400 font-bold tracking-tight uppercase">ID: {doc.documentId || doc._id.slice(-12).toUpperCase()}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Uploaded On</span>
                        <span className="text-xs font-bold text-slate-600">{new Date(doc.uploadDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center -space-x-2">
                        <div className="p-1 px-3 bg-slate-50 rounded-lg text-[9px] font-black text-slate-400 border border-slate-100 uppercase italic">
                            SHA-256 Validated
                        </div>
                    </div>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-3">
                    <button
                        onClick={() => setSelectedDoc(doc)}
                        className="flex items-center justify-center space-x-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
                    >
                        <FaInfoCircle />
                        <span>Insight</span>
                    </button>
                    <button
                        onClick={() => downloadQRCode(doc.qrCode, doc.documentType)}
                        className="flex items-center justify-center space-x-2 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                    >
                        <FaDownload />
                        <span>QR Code</span>
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="pb-20 space-y-10 max-w-[1400px] mx-auto animate-in fade-in duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">My Repository</h1>
                    <p className="text-slate-400 font-medium max-w-md">Access and manage your verified institutional credentials with decentralized validation tools.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="p-4 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <FaSearch className="text-slate-300" />
                    </div>
                    <div className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/20 text-white cursor-pointer hover:bg-blue-700 transition-colors">
                        <FaFilter className="text-sm" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-40">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Accessing Blockchain Records...</p>
                </div>
            ) : documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {documents.map(doc => <DocumentCard key={doc._id} doc={doc} />)}
                </div>
            ) : (
                <div className="glass-card p-20 text-center border-none shadow-2xl shadow-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaFileAlt className="text-3xl text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight uppercase">Repository Empty</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 font-medium">You haven't initiated any document verification drafts yet.</p>
                    <a href="/student/upload" className="btn-primary inline-flex">Upload First Draft</a>
                </div>
            )}

            {/* View Details Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
                    <div className="glass-card bg-white w-full max-w-xl overflow-hidden border-none shadow-2xl animate-in zoom-in-95 duration-300 rounded-[2.5rem]">
                        <div className="bg-slate-50/50 px-10 py-8 border-b border-slate-50 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{selectedDoc.documentType}</h2>
                                <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                                    Document Intelligence Report
                                </p>
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="p-3 hover:bg-slate-200 rounded-2xl transition-all text-slate-400">
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Health Status</span>
                                    <div><StatusBadge status={selectedDoc.status} /></div>
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seal Date</span>
                                    <p className="font-black text-slate-900 text-sm tracking-tight">{selectedDoc.verificationDate ? new Date(selectedDoc.verificationDate).toLocaleString() : 'Pending Authorization'}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cryptographic Signature (SHA-256)</span>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Validated Integrity</p>
                                </div>
                                <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group">
                                    <p className="text-[10px] font-mono break-all text-slate-500 leading-relaxed uppercase font-bold">{selectedDoc.fileHash}</p>
                                </div>
                            </div>

                            {selectedDoc.adminRemarks && (
                                <div className="space-y-2 animate-in slide-in-from-left-4 duration-500">
                                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Institutional Feedback</span>
                                    <div className="p-5 bg-rose-50 rounded-[1.5rem] border border-rose-100">
                                        <p className="text-xs text-rose-700 font-bold leading-relaxed italic">"{selectedDoc.adminRemarks}"</p>
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 flex flex-col items-center">
                                <div className="flex items-center space-x-3 mb-6 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                    <FaQrcode className="text-blue-600 text-xs" />
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Portable Validation Token</span>
                                </div>

                                <div className="p-6 bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] relative group cursor-pointer hover:border-blue-400 transition-all duration-500">
                                    <img src={selectedDoc.qrCode} alt="QR Code" className="w-32 h-32 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-[2px] rounded-[2.5rem] transition-all">
                                        <button
                                            onClick={() => downloadQRCode(selectedDoc.qrCode, selectedDoc.documentType)}
                                            className="p-4 bg-blue-600 text-white rounded-2xl shadow-2xl animate-bounce"
                                        >
                                            <FaDownload />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-[9px] text-slate-400 mt-6 text-center max-w-xs font-bold leading-relaxed uppercase tracking-widest">
                                    Authorized agents may scan this token to verify the cryptographic fingerprint in real-time.
                                </p>
                            </div>
                        </div>

                        <div className="bg-slate-50/50 px-10 py-6 text-center border-t border-slate-50">
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                            >
                                Terminate Session
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDocuments;
