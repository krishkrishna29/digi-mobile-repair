import React from 'react';
import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

const promotionsData = [
    {
        title: 'Summer Screen Repair Sale',
        description: 'Get 25% off on all screen repairs. Don\'t let a cracked screen ruin your summer!',
        discount: '25%',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1583573636332-35633b586953?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Battery Replacement Bonanza',
        description: 'Is your battery draining too fast? Get a new one for 30% off!',
        discount: '30%',
        status: 'Active',
        imageUrl: 'https://images.unsplash.com/photo-1614821594918-a8324424c3e8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
        title: 'Student Discount Days',
        description: 'Show your student ID and get 15% off any repair service.',
        discount: '15%',
        status: 'Inactive',
        imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
];

const Promotions = () => {
    return (
        <div className="bg-gray-50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Offers & Promotions</h2>
                    <p className="text-gray-600 mt-1">Create and manage special offers to attract more customers.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center shadow-lg transform hover:scale-105 transition-transform">
                    <PlusIcon className="h-6 w-6 mr-2" />
                    Create New Promotion
                </button>
            </div>

            <div className="mb-6">
                <input 
                    type="text" 
                    placeholder="Search for promotions..." 
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {promotionsData.map((promo, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out group">
                        <div className="relative">
                            <img src={promo.imageUrl} alt={promo.title} className="w-full h-48 object-cover" />
                            <div className={`absolute top-4 right-4 px-3 py-1 text-sm font-bold text-white rounded-full ${promo.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {promo.status}
                            </div>
                            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black to-transparent w-full p-4">
                                <h3 className="text-2xl font-bold text-white shadow-lg">{promo.title}</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">{promo.description}</p>
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-3xl font-bold text-blue-600">{promo.discount} OFF</div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button className="p-2 text-gray-500 hover:text-blue-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button className="p-2 text-gray-500 hover:text-red-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Promotions;
