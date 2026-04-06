import React, { useEffect, useState } from 'react';
import api from '../../api';
import {
    FaCheckCircle, FaTimesCircle, FaEye, FaIdCard, FaUser, FaPhone,
    FaEnvelope, FaFileSignature, FaClock, FaSearch, FaFilter, FaSortAmountDown,
    FaArrowLeft, FaShieldAlt
} from 'react-icons/fa';

const PendingDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        fetchDocuments();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [documents, searchQuery, filterType, sortBy]);

    const fetchDocuments = async () => {
        try {
            const res = await api.get('/docs/pending');
            setDocuments(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching documents:', err);
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let results = [...documents];

        // Search
        if (searchQuery) {
            results = results.filter(doc =>
                (doc.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doc.regNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doc.documentId || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by Type
        if (filterType !== 'All') {
            results = results.filter(doc => doc.documentType === filterType);
        }

        // Sort
        if (sortBy === 'newest') {
            results.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        } else if (sortBy === 'oldest') {
            results.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
        }

        setFilteredDocs(results);
    };

    const handleVerify = async (status) => {
        if (!selectedDoc) return;

        const confirmMsg = `Are you sure you want to ${status.toLowerCase()} this document?`;
        if (!window.confirm(confirmMsg)) return;

        try {
            await api.put(`/docs/verify/${selectedDoc._id}`, { status, adminRemarks: remarks });
            setDocuments(documents.filter(d => d._id !== selectedDoc._id));
            setSelectedDoc(null);
            setRemarks('');
        } catch (err) {
            console.error('Error verifying document:', err);
        }
    };

    const docTypes = ['All', ...new Set(documents.map(d => d.documentType))];

    return (
        <div className="space-y-8 pb-20 max-w-[1400px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pending Verifications</h1>
                    <p className="text-slate-500 mt-2 font-medium text-lg">Validate institutional authenticity of submitted student records</p>
                </div>
                <div className="bg-amber-50 px-6 py-3 rounded-2xl border border-amber-100 flex items-center space-x-3 shadow-sm shadow-amber-900/5">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span className="text-amber-800 font-black text-xs uppercase tracking-widest">{documents.length} Items in Queue</span>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="glass-card p-4 border-none flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search student name, register ID or document ID..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 lg:w-48">
                        <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <select
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:border-blue-500 font-bold text-xs uppercase tracking-widest"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            {docTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>
                    <div className="relative flex-1 lg:w-48">
                        <FaSortAmountDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <select
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl appearance-none focus:outline-none focus:border-blue-500 font-bold text-xs uppercase tracking-widest"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content: Table/List */}
            <div className="glass-card border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Profile</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Document Metadata</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Timeline</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Action Terminal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredDocs.length > 0 ? (
                                filteredDocs.map(doc => (
                                    <tr key={doc._id} className="hover:bg-blue-50/10 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black uppercase border border-blue-200 shadow-sm group-hover:scale-110 transition-transform">
                                                    {(doc.studentName || doc.studentId?.name || 'U').charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{doc.studentName || doc.studentId?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{doc.regNo || doc.studentId?.regNo || 'NO-REF'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="space-y-1.5">
                                                <span className="px-2.5 py-1 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                                    ID: {doc.documentId || 'LEGACY-REF'}
                                                </span>
                                                <p className="text-xs text-slate-500 font-bold italic">{doc.documentType}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-slate-700 font-bold">{new Date(doc.uploadDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                <span className="text-[10px] text-slate-400 font-medium uppercase">{new Date(doc.uploadDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedDoc(doc)}
                                                className="group inline-flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-blue-100 hover:border-blue-600 shadow-sm shadow-blue-500/5 active:scale-95"
                                            >
                                                <FaEye className="group-hover:animate-pulse" />
                                                <span>Initiate Review</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                <FaSearch className="text-3xl text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">No pending records found</p>
                                            <button onClick={() => { setSearchQuery(''); setFilterType('All'); }} className="mt-4 text-blue-600 font-bold text-[10px] uppercase tracking-widest hover:underline">Clear all filters</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Review Terminal Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 lg:p-10 z-50 animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full max-w-[1600px] h-full lg:h-[90vh] overflow-hidden border border-white/20 flex flex-col scale-in-center">
                        <div className="px-6 lg:px-10 py-6 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div className="flex items-center space-x-4">
                                <button onClick={() => setSelectedDoc(null)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all shadow-sm">
                                    <FaArrowLeft className="text-slate-400" />
                                </button>
                                <div>
                                    <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none">Document Verification Console</h2>
                                    <p className="text-[9px] text-slate-400 font-black tracking-[0.2em] mt-2 flex items-center">
                                        <FaShieldAlt className="mr-2 text-blue-500" /> SECURE AUDIT IN PROGRESS • SESSION_{selectedDoc._id.slice(-6).toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedDoc(null)} className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all text-slate-400 font-bold">✕</button>
                        </div>
                        
                        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                            {/* Left: Document Preview (65% Width) */}
                            <div className="lg:w-[65%] h-[50vh] lg:h-full bg-slate-50 p-4 lg:p-8 flex flex-col border-r border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                                        Live Certificate Preview
                                    </span>
                                    <div className="flex space-x-4">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                            <span className="text-[9px] font-bold text-slate-300 uppercase">FITTED</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 bg-white rounded-[1.5rem] lg:rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex items-center justify-center relative group">
                                    <div className="absolute inset-0 bg-slate-900 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none"></div>
                                    {selectedDoc.filePath.endsWith('.pdf') ? (
                                        <iframe 
                                            src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${selectedDoc.filePath}#toolbar=0&navpanes=0`} 
                                            className="w-full h-full border-none" 
                                            title="Document Viewport"
                                        ></iframe>
                                    ) : (
                                        <div className="w-full h-full p-4 flex items-center justify-center overflow-auto custom-scrollbar">
                                            <img 
                                                src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${selectedDoc.filePath}`} 
                                                alt="Document" 
                                                className="max-w-full max-h-full object-contain shadow-2xl transition-transform duration-500 hover:scale-[1.5] origin-center cursor-zoom-in" 
                                            />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="px-3 py-1.5 bg-slate-900/80 backdrop-blur-md rounded-lg text-[8px] font-black text-white uppercase tracking-widest border border-white/10">
                                            High-Resolution Scan
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions & Metadata (35% Width) */}
                            <div className="lg:w-[35%] overflow-y-auto p-6 lg:p-10 space-y-10 modern-scrollbar bg-white">
                                <div className="space-y-10">
                                    <section className="space-y-6">
                                        <div className="flex items-center space-x-3 pb-3 border-b border-slate-50">
                                            <FaUser className="text-blue-600" />
                                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Student Profile</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Full Name</span>
                                                <p className="font-black text-slate-900 text-base">{selectedDoc.studentName || `${selectedDoc.firstName} ${selectedDoc.lastName}`}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">ID NUMBER</span>
                                                    <p className="font-black text-slate-900 text-xs tracking-wider">{selectedDoc.regNo || selectedDoc.studentId?.regNo}</p>
                                                </div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">DEPARTMENT</span>
                                                    <p className="font-black text-blue-600 text-[10px] uppercase">{selectedDoc.department || 'GENERAL'}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2 px-1">
                                                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                                                    <FaEnvelope className="text-blue-400 shrink-0" />
                                                    <span className="truncate">{selectedDoc.email || selectedDoc.studentId?.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500">
                                                    <FaPhone className="text-blue-400 shrink-0" />
                                                    <span>{selectedDoc.phoneNumber || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-6">
                                        <div className="flex items-center space-x-3 pb-3 border-b border-slate-50">
                                            <FaIdCard className="text-indigo-600" />
                                            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-900">Document Meta</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Category</span>
                                                        <p className="font-black text-indigo-900 text-sm tracking-tight">{selectedDoc.documentType}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Public ID</span>
                                                        <p className="font-mono text-[10px] text-slate-600 font-bold">{selectedDoc.documentId || 'CERT-NONE'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                                                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest flex items-center mb-2">
                                                    <FaFileSignature className="mr-2 text-emerald-500" /> SHA-256 INTEGRITY HASH
                                                </span>
                                                <p className="text-[9px] font-mono break-all text-slate-400 leading-relaxed uppercase tracking-tighter">{selectedDoc.fileHash}</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Decision Remarks</label>
                                            <textarea
                                                className="w-full min-h-[100px] p-4 text-sm resize-none bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="Enter validation summary or rejection reason here..."
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleVerify('Approved')}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-500/10 active:scale-95 transition-all text-[10px] flex items-center justify-center"
                                            >
                                                <FaCheckCircle className="mr-2" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleVerify('Rejected')}
                                                className="bg-rose-600 hover:bg-rose-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-rose-500/10 active:scale-95 transition-all text-[10px] flex items-center justify-center"
                                            >
                                                <FaTimesCircle className="mr-2" /> Reject
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingDocuments;
