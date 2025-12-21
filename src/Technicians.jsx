import React from 'react';
import { PlusIcon, StarIcon } from '@heroicons/react/24/solid';

const techniciansData = [
    {
        name: 'John Brown',
        specialization: 'Apple & Samsung Certified',
        avatar: 'https://randomuser.me/api/portraits/men/85.jpg',
        jobsCompleted: 128,
        rating: 4.9,
        status: 'Available',
    },
    {
        name: 'Kevin Wilson',
        specialization: 'Google & OnePlus Specialist',
        avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
        jobsCompleted: 94,
        rating: 4.7,
        status: 'On Job',
    },
    {
        name: 'Linda Martinez',
        specialization: 'General Repairs & Diagnostics',
        avatar: 'https://randomuser.me/api/portraits/women/87.jpg',
        jobsCompleted: 152,
        rating: 4.8,
        status: 'Available',
    },
    {
        name: 'Joshua Davis',
        specialization: 'Software & Malware Removal',
        avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
        jobsCompleted: 78,
        rating: 4.6,
        status: 'On Leave',
    },

];

const Technicians = () => {
    return (
        <div className="bg-gray-50 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Technician Management</h2>
                    <p className="text-gray-600 mt-1">Manage your team of skilled technicians.</p>
                </div>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center shadow-lg transform hover:scale-105 transition-transform">
                    <PlusIcon className="h-6 w-6 mr-2" />
                    Add New Technician
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {techniciansData.map((tech, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-xl overflow-hidden text-center group transform hover:-translate-y-2 transition-transform duration-300 ease-in-out">
                        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                            <div className={`absolute top-4 right-4 px-3 py-1 text-sm font-bold text-white rounded-full ${tech.status === 'Available' ? 'bg-green-500' : tech.status === 'On Job' ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                {tech.status}
                            </div>
                        </div>
                        <div className="p-6">
                            <img src={tech.avatar} alt={tech.name} className="w-24 h-24 rounded-full mx-auto -mt-16 border-4 border-white shadow-lg" />
                            <h3 className="text-xl font-bold text-gray-800 mt-4">{tech.name}</h3>
                            <p className="text-gray-600">{tech.specialization}</p>
                            <div className="flex justify-around mt-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{tech.jobsCompleted}</p>
                                    <p className="text-gray-500 text-sm">Jobs Done</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600 flex items-center justify-center">
                                        <StarIcon className="h-6 w-6 text-yellow-400 mr-1" />
                                        {tech.rating}
                                    </p>
                                    <p className="text-gray-500 text-sm">Rating</p>
                                </div>
                            </div>
                            <button className="mt-6 w-full bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Technicians;
