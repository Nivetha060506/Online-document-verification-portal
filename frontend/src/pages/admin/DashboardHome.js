import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    FaUserGraduate, FaFileAlt, FaCheckCircle, FaTimesCircle, FaClock, FaArrowRight, FaChartLine, FaChartPie, FaChartBar
} from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
);

const DashboardHome = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalDocuments: 0,
        pendingDocs: 0,
        approvedDocs: 0,
        rejectedDocs: 0,
        recentDocs: []
    });
    const [chartData, setChartData] = useState(null);
    const [lineData, setLineData] = useState(null);
    const [pieData, setPieData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const statRes = await api.get('/admin/stats');
                setStats(statRes.data);

                const docRes = await api.get('/docs/all');
                const allDocs = docRes.data;

                // 1. Bar Chart: Document Status Distribution
                const approved = allDocs.filter(d => d.status === 'Approved').length;
                const rejected = allDocs.filter(d => d.status === 'Rejected').length;
                const pending = allDocs.filter(d => d.status === 'Pending').length;

                setChartData({
                    labels: ['Approved', 'Pending', 'Rejected'],
                    datasets: [
                        {
                            label: 'Document Count',
                            data: [approved, pending, rejected],
                            backgroundColor: [
                                'rgba(16, 185, 129, 0.8)', // Emerald
                                'rgba(245, 158, 11, 0.8)', // Amber
                                'rgba(239, 68, 68, 0.8)'   // Rose
                            ],
                            borderRadius: 12,
                            borderWidth: 0,
                            barThickness: 40,
                        },
                    ],
                });

                // 2. Line Chart: Uploads Over Time (Daily - Last 7 days)
                let labels, counts;

                if (statRes.data.uploadTrends) {
                    labels = statRes.data.uploadTrends.map(t => new Date(t.date).toLocaleDateString(undefined, { weekday: 'short' }));
                    counts = statRes.data.uploadTrends.map(t => t.count);
                } else {
                    const last7Days = [...Array(7)].map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - i);
                        return d.toISOString().split('T')[0];
                    }).reverse();

                    labels = last7Days.map(date => new Date(date).toLocaleDateString(undefined, { weekday: 'short' }));
                    counts = last7Days.map(date =>
                        allDocs.filter(doc => doc.uploadDate && doc.uploadDate.split('T')[0] === date).length
                    );
                }

                setLineData({
                    labels,
                    datasets: [
                        {
                            label: 'New Uploads',
                            data: counts,
                            fill: true,
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderColor: '#3B82F6',
                            pointBackgroundColor: '#3B82F6',
                            pointBorderColor: '#fff',
                            pointBorderWidth: 2,
                            pointRadius: 4,
                            tension: 0.4,
                        },
                    ],
                });

                // 3. Pie Chart: Approval Percentage
                const totalReviewed = approved + rejected;
                const approvalRate = totalReviewed > 0 ? Math.round((approved / totalReviewed) * 100) : 0;
                const rejectionRate = 100 - approvalRate;

                setPieData({
                    labels: ['Approved %', 'Rejected %'],
                    datasets: [
                        {
                            data: [approvalRate, rejectionRate],
                            backgroundColor: ['#10B981', '#F43F5E'],
                            hoverOffset: 10,
                            borderWidth: 2,
                            borderColor: '#ffffff',
                        },
                    ],
                });

                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, color, icon: Icon, description }) => (
        <div className="glass-card p-6 border-none hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} shadow-lg`}>
                    <Icon className="text-white text-xl" />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-full">Live</span>
            </div>
            <div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</h3>
                <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
                    <span className="text-[10px] font-bold text-emerald-500">{description}</span>
                </div>
            </div>
        </div>
    );

    const StatusBadge = ({ status }) => {
        const styles = {
            Approved: 'bg-emerald-50 text-emerald-600 border-emerald-100',
            Rejected: 'bg-rose-50 text-rose-600 border-rose-100',
            Pending: 'bg-amber-50 text-amber-600 border-amber-100'
        };
        return (
            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border ${styles[status] || styles.Pending}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Initializing Analytics...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-20 max-w-[1600px] mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Dashboard</h1>
                    <p className="text-slate-500 mt-2 font-medium text-lg">Real-time institutional document verification metrics</p>
                </div>
                <div className="flex items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100">
                        Admin Terminal
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Documents" value={stats.totalDocuments} color="bg-blue-600" icon={FaFileAlt} description="+12% total" />
                <StatCard title="Pending Review" value={stats.pendingDocs} color="bg-amber-500" icon={FaClock} description="Action required" />
                <StatCard title="Approved Files" value={stats.approvedDocs} color="bg-emerald-500" icon={FaCheckCircle} description="Verified" />
                <StatCard title="Rejected Files" value={stats.rejectedDocs} color="bg-rose-500" icon={FaTimesCircle} description="Failed integrity" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bar Chart - Status Distribution */}
                <div className="lg:col-span-2 glass-card p-8 border-none flex flex-col h-[450px]">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <FaChartBar />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight">Status Distribution</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Document lifecycle summary</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f1f5f9', drawBorder: false },
                                        ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { font: { weight: 'bold', size: 10 }, color: '#64748b' }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Pie Chart - Success Rate */}
                <div className="glass-card p-8 border-none flex flex-col h-[450px]">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                            <FaChartPie />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Approval Rate</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verification success %</p>
                        </div>
                    </div>
                    <div className="flex-1 relative p-4 flex items-center justify-center">
                        <Pie
                            data={pieData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'bottom',
                                        labels: {
                                            usePointStyle: true,
                                            padding: 25,
                                            font: { weight: 'black', size: 10 },
                                            color: '#64748b'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Line Chart - Upload Trends */}
                <div className="lg:col-span-3 glass-card p-8 border-none flex flex-col h-[400px]">
                    <div className="flex items-center space-x-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <FaChartLine />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Upload Trends</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Volume over last 7 days</p>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <Line
                            data={lineData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        grid: { color: '#f1f5f9', drawBorder: false },
                                        ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' }
                                    },
                                    x: {
                                        grid: { color: '#f1f5f9', drawBorder: false },
                                        ticks: { font: { weight: 'bold', size: 10 }, color: '#64748b' }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Uploads Table */}
            <div className="glass-card border-none overflow-hidden pb-4">
                <div className="px-8 py-8 flex justify-between items-center border-b border-slate-50">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Submissions</h2>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Audit log of latest uploads</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/pending')}
                        className="group flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                    >
                        <span>Manage Queue</span>
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
                <div className="overflow-x-auto px-4">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Student Profile</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Document Type</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Date Uploaded</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.recentDocs.length > 0 ? (
                                stats.recentDocs.map(doc => (
                                    <tr key={doc._id} className="group hover:bg-slate-50/50 transition-colors duration-150">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mr-4 text-xs font-black text-blue-700 uppercase border border-blue-200">
                                                    {(doc.studentName || doc.studentId?.name || 'U').charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900 tracking-tight">{doc.studentId?.name || doc.studentName || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-500 font-bold uppercase">{doc.documentType}</td>
                                        <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-400 font-bold italic">
                                            {new Date(doc.uploadDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <StatusBadge status={doc.status} />
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <FaClock className="text-2xl text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No recent activity detected</p>
                                        </div>
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

export default DashboardHome;
