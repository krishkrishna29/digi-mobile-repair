import React from 'react';
import { DocumentChartBarIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const salesData = [
    { name: 'Jan', revenue: 4000 }, { name: 'Feb', revenue: 3000 }, { name: 'Mar', revenue: 5000 }, 
    { name: 'Apr', revenue: 4500 }, { name: 'May', revenue: 6000 }, { name: 'Jun', revenue: 5500 },
];

const repairStatusData = [
    { name: 'Completed', value: 240 },
    { name: 'In Progress', value: 80 },
    { name: 'Pending', value: 30 },
];

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const Reports = () => {
    return (
        <div className="bg-gray-50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Reports & Analytics</h2>
                    <p className="text-gray-600 mt-1">Gain insights into your business performance.</p>
                </div>
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center shadow-sm">
                    Export Reports <ChevronDownIcon className="h-5 w-5 ml-2"/>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Overview */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Monthly Sales Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={salesData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Repair Status */}
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Repair Job Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={repairStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8">
                                {repairStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;
