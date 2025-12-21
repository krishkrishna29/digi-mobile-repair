import React from 'react';
import { GlobeAltIcon, ShieldCheckIcon, CogIcon, TruckIcon } from '@heroicons/react/24/outline';

const features = [
  {
    icon: <GlobeAltIcon className="h-12 w-12 text-blue-500" />,
    title: '24x7 Support Availability',
    description: 'We are a click away from you. We are always available to support you via Phone, email and chat to resolve your queries.'
  },
  {
    icon: <ShieldCheckIcon className="h-12 w-12 text-blue-500" />,
    title: 'Money Back Guarantee',
    description: 'Although we are 100% sure of our work, we offer full money back within 90 days for our client satisfaction.'
  },
  {
    icon: <CogIcon className="h-12 w-12 text-blue-500" />,
    title: 'Genuine Hardware',
    description: 'Our Team of expert technicians use the best and genuine hardware for all the repairs. If not available it will be replaced with the client\'s approval.'
  },
  {
    icon: <TruckIcon className="h-12 w-12 text-blue-500" />,
    title: 'Pickup & Drop Facility',
    description: 'We ensure the safety of your Mobile device picked up from your doorstep to deliver the same by our technicians.'
  }
];

const WhyUs = () => {
  return (
    <div className="bg-black bg-opacity-60 py-24">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="text-4xl font-bold text-center mb-12">WHY US</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;