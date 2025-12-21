import React from 'react';
import { LifebuoyIcon, BookOpenIcon, ChatBubbleLeftRightIcon, PaperAirplaneIcon } from '@heroicons/react/24/solid';

const supportTopics = [
    { title: 'Getting Started', icon: BookOpenIcon, description: 'Learn the basics of the admin panel.' },
    { title: 'Managing Repairs', icon: BookOpenIcon, description: 'Everything you need to know about repair jobs.' },
    { title: 'Billing & Payments', icon: BookOpenIcon, description: 'Understand invoices, payments, and refunds.' },
];

const Support = () => {
    return (
        <div 
            className="bg-cover bg-center p-8"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }}
        >
            <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800">How can we help?</h2>
                    <p className="text-gray-600 mt-2">Search our knowledge base or contact us directly.</p>
                    <div className="mt-6 max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="Search for articles..." 
                            className="w-full p-4 border border-gray-300 rounded-full shadow-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {supportTopics.map((topic, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
                            <topic.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800">{topic.title}</h3>
                            <p className="text-gray-600 mt-2">{topic.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">Still need help?</h3>
                    <p className="text-gray-600 mt-2">Our support team is here for you 24/7.</p>
                    <button className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 flex items-center mx-auto shadow-lg transform hover:scale-105 transition-transform">
                        <ChatBubbleLeftRightIcon className="h-6 w-6 mr-3" />
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Support;
