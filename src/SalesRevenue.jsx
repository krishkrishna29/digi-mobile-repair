import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import {
    ArrowDownTrayIcon,
    ArrowTrendingUpIcon,
    CurrencyRupeeIcon,
    WrenchScrewdriverIcon,
    UsersIcon,
} from '@heroicons/react/24/solid';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee'];

const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center shadow-sm";
    switch (status) {
        case 'Completed':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
        case 'Paid':
                return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Paid</span>;
        case 'Pending':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
        case 'Cancelled':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
        default:
            return <span className={`${baseClasses} bg-gray-200 text-gray-800`}>{status}</span>;
    }
};

const SalesAndRevenue = () => {
    const [timeRange, setTimeRange] = useState('30d');
    const [revenueData, setRevenueData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [stats, setStats] = useState({ totalRevenue: 0, completedJobs: 0, avgJobValue: 0, newCustomers: 0 });

    useEffect(() => {
        const fetchData = async () => {
            const getDays = () => {
                if (timeRange === '7d') return 7;
                if (timeRange === '30d') return 30;
                if (timeRange === '90d') return 90;
                if (timeRange === '12m') return 365; // Approx
                return 30;
            }
            const days = getDays();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            // Fetch repairs within the date range
            const repairsRef = collection(db, 'repairs');
            const q = query(repairsRef, where('createdAt', '>=', startDate));
            const querySnapshot = await getDocs(q);
            
            const repairs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Calculate Stats
            const completedRepairs = repairs.filter(r => r.status === 'Completed' || r.status === 'Paid');
            const totalRevenue = completedRepairs.reduce((acc, r) => acc + (r.finalQuote || 0), 0);
            const completedJobs = completedRepairs.length;
            const avgJobValue = completedJobs > 0 ? totalRevenue / completedJobs : 0;

            setStats({ totalRevenue, completedJobs, avgJobValue, newCustomers: 0 }); // New customers needs a different logic

            // Format for Revenue Chart (monthly aggregation if range is large)
            const chartData = {};
            repairs.forEach(repair => {
                if (!repair.createdAt) return;
                const date = repair.createdAt.toDate();
                const key = (days > 90)
                    ? date.toLocaleString('default', { month: 'short' })
                    : date.toLocaleDateString();
                if (!chartData[key]) chartData[key] = { name: key, revenue: 0, jobs: 0 };
                if (repair.status === 'Completed' || repair.status === 'Paid') {
                    chartData[key].revenue += (repair.finalQuote || 0);
                }
                chartData[key].jobs += 1;
            });
            setRevenueData(Object.values(chartData));

            // Format for Services Pie Chart
            const serviceCounts = {};
            completedRepairs.forEach(repair => {
                const category = repair.issueCategory || 'Other';
                serviceCounts[category] = (serviceCounts[category] || 0) + 1;
            });
            setServiceData(Object.entries(serviceCounts).map(([name, value]) => ({ name, value })));

            // Set recent transactions (assuming we can get user info)
            const recent = repairs.slice(0, 5).map(r => ({
                id: r.id.substring(0, 6).toUpperCase(),
                customer: r.userId.substring(0, 8), // Placeholder for customer name
                date: r.createdAt?.toDate().toLocaleDateString() || 'N/A',
                amount: `₹${r.finalQuote || 0}`,
                status: r.status
            }));
            setRecentTransactions(recent);
        };

        fetchData();
    }, [timeRange]);

    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Sales & Revenue</h2>
                    <p className="text-gray-600 mt-1">Track your business growth and financial performance.</p>
                </div>
                <div className="flex space-x-2">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center shadow-sm transition-all">
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Export Report
                    </button>
                    <div className="relative inline-block text-left">
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="7d">Last 7 days</option>
                            <option value="30d">Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                            <option value="12m">Last 12 months</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
                    <CurrencyRupeeIcon className="h-8 w-8 mb-4 opacity-75" />
                    <p className="text-sm font-medium text-indigo-100">Total Revenue</p>
                    <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <WrenchScrewdriverIcon className="h-8 w-8 mb-4 text-cyan-500" />
                    <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.completedJobs}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <CurrencyRupeeIcon className="h-8 w-8 mb-4 text-pink-500" />
                    <p className="text-sm font-medium text-gray-500">Avg. Job Value</p>
                    <p className="text-3xl font-bold text-gray-800">₹{stats.avgJobValue.toFixed(0)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <UsersIcon className="h-8 w-8 mb-4 text-amber-500" />
                    <p className="text-sm font-medium text-gray-500">New Customers</p>
                    <p className="text-3xl font-bold text-gray-800">{stats.newCustomers}</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                     <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Revenue Growth</h3>
                         <span className="flex items-center text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                            <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> Up 15%
                         </span>
                     </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" className="opacity-50" vertical={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        borderColor: '#e5e7eb',
                                        borderRadius: '0.75rem',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                                    }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Services Breakdown */}
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Services Breakdown</h3>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={serviceData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {serviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend iconSize={12} wrapperStyle={{ fontSize: '14px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Transactions Table */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-500 font-semibold uppercase text-sm border-b border-gray-200">
                                <th className="py-3 px-4">Transaction ID</th>
                                <th className="py-3 px-4">Customer</th>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentTransactions.map((transaction) => (
                                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium text-gray-700">{transaction.id}</td>
                                    <td className="py-4 px-4 text-gray-600">{transaction.customer}</td>
                                    <td className="py-4 px-4 text-gray-600">{transaction.date}</td>
                                    <td className="py-4 px-4 font-semibold text-gray-800">{transaction.amount}</td>
                                    <td className="py-4 px-4 text-center">{getStatusChip(transaction.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SalesAndRevenue;
