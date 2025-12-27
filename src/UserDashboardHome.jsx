import React from 'react';
import { BookOpenIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

const UserDashboardHome = ({ setActiveComponent }) => {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
                className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/new-repair-request')}
            >
                <WrenchScrewdriverIcon className="h-10 w-10 text-purple-600"/>
                <div>
                    <h3 className="font-bold text-lg">Submit a new Repair Request</h3>
                    <p className="text-gray-600">Got a broken device? Get it fixed by our expert technicians.</p>
                </div>
            </div>
            <div 
                className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setActiveComponent('Repairs')}
            >
                <BookOpenIcon className="h-10 w-10 text-blue-600"/>
                <div>
                    <h3 className="font-bold text-lg">View Your Repair History</h3>
                    <p className="text-gray-600">Check the status and details of all your past and current repairs.</p>
                </div>
            </div>
        </div>
    );
};

export default UserDashboardHome;
