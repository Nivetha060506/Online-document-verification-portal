import React, { useEffect, useState } from 'react';
import api from '../../api';

const VerifiedDocuments = () => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                // Currently backend doesn't have a specific filtered endpoint, so we fetch all or pending+others?
                // Actually `getPendingDocuments` only returns Pending.
                // We need an endpoint for ALL docs or filtered by status.
                // Reusing `getPendingDocuments` logic but checking filtered status if possible or creating new endpoint?
                // Let's assume for now we use a generic GET /docs/all or similar.
                // But wait, `getPendingDocuments` is hardcoded to 'Pending'.
                // I should probably add a route for 'verified' and 'rejected' or a generic one.
                // For this step I will assume there is a route or I will filter if I can get all.
                // Let's quickly add a route `GET /docs/status/:status` in backend or just `GET /docs/admin?status=Approved`.
                // Since I can't easily change backend structure without more overhead, let's create a new component 
                // but realizes we need backend support.
                // WAIT: The previous plan mentioned "Fetch documents with status Approved". 
                // I will add a `GET /docs/all` route for admin to filter.

                const res = await api.get('/docs/all'); // Need to implement this in backend!
                const approvedDocs = res.data.filter(doc => doc.status === 'Approved');
                setDocuments(approvedDocs);
            } catch (err) {
                console.error(err);
                // Fallback / Mock for demo if backend route missing
                setDocuments([]);
            }
        };
        fetchDocs();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-green-700">Verified Documents</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified On</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents.map(doc => (
                            <tr key={doc._id}>
                                <td className="px-6 py-4 whitespace-nowrap">{doc.studentId?.name || doc.studentName || 'Unknown'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{doc.documentType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.verificationDate || doc.uploadDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Approved
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VerifiedDocuments;
