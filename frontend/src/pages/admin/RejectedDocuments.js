import React, { useEffect, useState } from 'react';
import api from '../../api';
import { FaTimesCircle, FaInfoCircle, FaUser, FaFileAlt, FaCalendarTimes } from 'react-icons/fa';

const RejectedDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRejectedDocuments();
    }, []);

    const fetchRejectedDocuments = async () => {
        try {
            const res = await api.get('/docs/all');
            const rejected = res.data.filter(doc => doc.status === 'Rejected');
            setDocuments(rejected);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching rejected documents:', err);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-end space-x-4">
                <div className="p-3 bg-rose-50 rounded-2xl shadow-sm border border-rose-100">
                    <FaTimesCircle className="text-rose-500 text-3xl" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">Rejected Archives</h1>
                    <p className="text-gray-500 mt-2 font-medium">Review and track documents that failed verification standards</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Information</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Document ID</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Document Type</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Rejection Timeline</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest text-rose-500">Rejection Protocol / Reason</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {documents.length > 0 ? (
                                documents.map(doc => (
                                    <tr key={doc._id} className="hover:bg-rose-50/30 transition-colors duration-150">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-4 border border-gray-100 group-hover:bg-white transition-colors">
                                                    <FaUser className="text-gray-400 text-sm" />
                                                </div>
                                                <div>
                                                    <p className="font-extrabold text-gray-900 tracking-tight uppercase text-xs">{doc.studentId?.name || doc.studentName || 'Anonymous'}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold tracking-widest">ID: {doc.studentId?._id?.slice(-8).toUpperCase() || 'UNTRACKED'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-[10px] font-black uppercase tracking-tighter border border-gray-200">
                                                {doc.documentId || 'LEGACY-REF'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2 font-black text-gray-700 text-xs italic">
                                                <FaFileAlt className="text-gray-300" />
                                                <span>{doc.documentType}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center space-x-2 text-xs text-gray-500 font-bold">
                                                <FaCalendarTimes className="text-rose-300" />
                                                <span>{new Date(doc.verificationDate || doc.uploadDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="max-w-xs p-3 bg-rose-50/50 rounded-xl border border-rose-100 inline-block">
                                                <div className="flex items-start space-x-3">
                                                    <FaInfoCircle className="text-rose-400 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-rose-800 font-bold leading-relaxed">
                                                        {doc.adminRemarks || 'Document does not meet authenticity requirements.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="px-3 py-1 text-[10px] font-black bg-rose-100 text-rose-700 rounded-full border border-rose-200 uppercase tracking-tighter shadow-sm">
                                                Rejected
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-24 text-center">
                                        {loading ? (
                                            <div className="flex flex-col items-center space-y-4">
                                                <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin"></div>
                                                <p className="text-rose-300 font-black uppercase text-[10px] tracking-widest">fetching archives...</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                    <FaTimesCircle className="text-gray-200 text-5xl" />
                                                </div>
                                                <h3 className="text-xl font-black text-gray-400 tracking-tight">No Rejections Found</h3>
                                                <p className="text-gray-300 font-medium mt-2">All documents in the system seem to be in pending or approved states.</p>
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

export default RejectedDocuments;
