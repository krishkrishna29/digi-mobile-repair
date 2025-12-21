import React, { useState } from 'react';
import { FunnelIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const customersData = [
    { name: 'Alex Johnson', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', email: 'alex.j@email.com', phone: '(123) 456-7890', location: 'New York', status: 'Active', loyaltyTier: 'Gold', tags: ['High-Spender', 'Warranty Active'] },
    { name: 'Sarah Smith', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', email: 'sarahs@email.com', phone: '(967) 654-3210', location: 'Los Angeles', status: 'Active', loyaltyTier: 'Silver', tags: ['Frequent Visitor'] },
    { name: 'Michael Lee', avatar: 'https://randomuser.me/api/portraits/men/33.jpg', email: 'michael@email.com', phone: '(456) 788-0123', location: 'Chicago', status: 'Inactive', loyaltyTier: 'Bronze', tags: [] },
    { name: 'Emma Garcia', avatar: 'https://randomuser.me/api/portraits/women/47.jpg', email: 'emmag@email.com', phone: '(321) 654-9870', location: 'Houston', status: 'Active', loyaltyTier: 'Gold', tags: ['High-Spender'] },
    { name: 'Daniel Rodriguez', avatar: 'https://randomuser.me/api/portraits/men/35.jpg', email: 'daniel.r@email.com', phone: '(789) 012-3456', location: 'Phoenix', status: 'Inactive', loyaltyTier: 'Silver', tags: ['Warranty Active'] },
    { name: 'Olivia Taylor', avatar: 'https://randomuser.me/api/portraits/women/50.jpg', email: 'oliviat@email.com', phone: '(654) 321-0987', location: 'Miami', status: 'Active', loyaltyTier: 'Bronze', tags: ['Frequent Visitor'] },
];

const getStatusChip = (status) => {
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${status === 'Active' ? 'text-green-800 bg-green-100' : 'text-gray-800 bg-gray-200'}`}>{status}</span>;
};

const getTierChip = (tier) => {
    const tierColors = {
        Gold: 'bg-yellow-100 text-yellow-800',
        Silver: 'bg-gray-200 text-gray-800',
        Bronze: 'bg-orange-100 text-orange-800',
    };
    return <span className={`px-3 py-1 text-sm font-medium rounded-full ${tierColors[tier]}`}>{tier}</span>;
}

const Customers = () => {
    const [selectedCustomers, setSelectedCustomers] = useState([]);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedCustomers(customersData.map(c => c.email));
        } else {
            setSelectedCustomers([]);
        }
    };

    const handleSelectOne = (e, email) => {
        if (e.target.checked) {
            setSelectedCustomers([...selectedCustomers, email]);
        } else {
            setSelectedCustomers(selectedCustomers.filter(c => c !== email));
        }
    };

    return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
            <div className="flex items-center space-x-2">
                <input type="text" placeholder="Search..." className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-auto" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 whitespace-nowrap">New Customer</button>
            </div>
        </div>

        <div className="flex flex-wrap gap-2 items-center mb-4">
            <button className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold">
                <FunnelIcon className="h-5 w-5 mr-2"/>Filter
            </button>
            {selectedCustomers.length > 0 && (
                <div className="relative">
                    <button className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">
                        Bulk Actions <ChevronDownIcon className="h-5 w-5 ml-2"/>
                    </button>
                    {/* Dropdown for bulk actions can be added here */}
                </div>
            )}
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500 font-semibold">
                        <th className="py-3 px-4 w-4">
                            <input type="checkbox" onChange={handleSelectAll} checked={selectedCustomers.length === customersData.length} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        </th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Loyalty Tier</th>
                        <th className="py-3 px-4">Tags</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customersData.map(customer => (
                        <tr key={customer.email} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-4 px-4">
                                <input type="checkbox" onChange={(e) => handleSelectOne(e, customer.email)} checked={selectedCustomers.includes(customer.email)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </td>
                            <td className="py-4 px-4 flex items-center">
                                <img src={customer.avatar} alt={customer.name} className="h-10 w-10 rounded-full mr-4"/>
                                <span className="font-medium text-gray-800">{customer.name}</span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-sm text-gray-800">{customer.email}</div>
                                <div className="text-sm text-gray-500">{customer.phone}</div>
                            </td>
                            <td className="py-4 px-4">{getTierChip(customer.loyaltyTier)}</td>
                            <td className="py-4 px-4">
                                <div className="flex flex-wrap gap-1">
                                    {customer.tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </td>
                            <td className="py-4 px-4">{getStatusChip(customer.status)}</td>
                            <td className="py-4 px-4 flex space-x-2">
                                <PencilIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-blue-600"/>
                                <TrashIcon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-red-600"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

}

export default Customers;
