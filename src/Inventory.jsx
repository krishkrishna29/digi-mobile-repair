import React from 'react';
import { PlusIcon, FunnelIcon, ChevronDownIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

const inventoryData = [
    {
        name: 'iPhone 13 Screen',
        category: 'Screens',
        stock: 50,
        price: 120.00,
        supplier: 'GadgetParts Inc.',
        imageUrl: 'https://images.unsplash.com/photo-1632055644917-069507a7395e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Samsung S21 Battery',
        category: 'Batteries',
        stock: 35,
        price: 45.00,
        supplier: 'MobileFix Supplies',
        imageUrl: 'https://images.unsplash.com/photo-1595941029090-099451475772?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'USB-C Charging Port',
        category: 'Components',
        stock: 120,
        price: 15.00,
        supplier: 'GadgetParts Inc.',
        imageUrl: 'https://images.unsplash.com/photo-1618397249723-e45c4533e76a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        name: 'Pixel 6 Camera Module',
        category: 'Cameras',
        stock: 15,
        price: 85.00,
        supplier: 'MobileFix Supplies',
        imageUrl: 'https://images.unsplash.com/photo-1635515252873-c60f6714081c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

const getStockStatus = (stock) => {
    if (stock > 50) return { text: 'In Stock', className: 'bg-green-100 text-green-800' };
    if (stock > 0) return { text: 'Low Stock', className: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Out of Stock', className: 'bg-red-100 text-red-800' };
};

const Inventory = () => {
    return (
        <div className="bg-gray-50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Inventory Management</h2>
                    <p className="text-gray-600 mt-1">Keep track of all your parts and supplies.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center shadow-lg transform hover:scale-105 transition-transform">
                    <PlusIcon className="h-6 w-6 mr-2" />
                    Add New Item
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left bg-white rounded-2xl shadow-xl">
                    <thead>
                        <tr className="text-gray-500 font-semibold border-b border-gray-200">
                            <th className="py-4 px-6">Item</th>
                            <th className="py-4 px-6">Category</th>
                            <th className="py-4 px-6">Stock</th>
                            <th className="py-4 px-6">Price</th>
                            <th className="py-4 px-6">Supplier</th>
                            <th className="py-4 px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item, index) => {
                            const stockStatus = getStockStatus(item.stock);
                            return (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-6 flex items-center">
                                        <img src={item.imageUrl} alt={item.name} className="h-12 w-12 rounded-lg object-cover mr-4 shadow-md" />
                                        <span className="font-medium text-gray-800">{item.name}</span>
                                    </td>
                                    <td className="py-4 px-6 text-gray-600">{item.category}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${stockStatus.className}`}>{stockStatus.text}</span>
                                        <span className="ml-2 text-gray-800 font-semibold">({item.stock})</span>
                                    </td>
                                    <td className="py-4 px-6 font-semibold text-gray-800">${item.price.toFixed(2)}</td>
                                    <td className="py-4 px-6 text-gray-600">{item.supplier}</td>
                                    <td className="py-4 px-6 flex space-x-2">
                                        <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><PencilIcon className="h-5 w-5" /></button>
                                        <button className="p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;
