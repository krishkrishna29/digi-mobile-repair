import React, { useState } from 'react';
import {
    ArrowDownTrayIcon,
    ArrowTrendingUpIcon,
    CurrencyRupeeIcon,
    WrenchScrewdriverIcon,
    UsersIcon,
} from '@heroicons/react/24/solid';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

// Mock Data
const data = [
    { name: 'Jan', revenue: 4000, jobs: 24 },
    { name: 'Feb', revenue: 3000, jobs: 13 },
    { name: 'Mar', revenue: 5000, jobs: 32 },
    { name: 'Apr', revenue: 4780, jobs: 39 },
    { name: 'May', revenue: 5890, jobs: 48 },
    { name: 'Jun', revenue: 6390, jobs: 38 },
    { name: 'Jul', revenue: 7490, jobs: 43 },
];

const serviceData = [
    { name: 'Screen Repair', value: 400 },
    { name: 'Battery Replacement', value: 300 },
    { name: 'Water Damage', value: 300 },
    { name: 'Software Issue', value: 200 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#22d3ee'];

const recentTransactions = [
    { id: 'TRX001', customer: 'Ankit Singh', date: '2023-10-26', amount: '₹1,500', status: 'Completed' },
    { id: 'TRX002', customer: 'Priya Sharma', date: '2023-10-25', amount: '₹800', status: 'Completed' },
    { id: 'TRX003', customer: 'Rahul Verma', date: '2023-10-25', amount: '₹2,200', status: 'Pending' },
    { id: 'TRX004', customer: 'Sneha Patel', date: '2023-10-24', amount: '₹1,200', status: 'Completed' },
    { id: 'TRX005', customer: 'Amit Kumar', date: '2023-10-23', amount: '₹950', status: 'Cancelled' },
];

const getStatusChip = (status) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center shadow-sm";
    switch (status) {
        case 'Completed':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
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
                    <p className="text-3xl font-bold">₹89,400</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <WrenchScrewdriverIcon className="h-8 w-8 mb-4 text-cyan-500" />
                    <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
                    <p className="text-3xl font-bold text-gray-800">142</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <CurrencyRupeeIcon className="h-8 w-8 mb-4 text-pink-500" />
                    <p className="text-sm font-medium text-gray-500">Avg. Job Value</p>
                    <p className="text-3xl font-bold text-gray-800">₹630</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <UsersIcon className="h-8 w-8 mb-4 text-amber-500" />
                    <p className="text-sm font-medium text-gray-500">New Customers</p>
                    <p className="text-3xl font-bold text-gray-800">35</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Revenue Growth</h3>
                        <div className="flex items-center space-x-2">
                            <span className="flex items-center text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded">
                                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> Up 15%
                            </span>
                        </div>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
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
