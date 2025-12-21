import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-gray-900 py-24">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="About Us" 
              className="rounded-lg shadow-2xl"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">ABOUT US</h2>
            <p className="text-gray-400 leading-relaxed">
              We, Venus Repair and Services, situated at Malad West, Mumbai, Maharashtra are a leading service provider providing various services such as mobile damage and others. We do this so that you can spend your time following your passions and doing things you actually love rather than moving around for mundane tasks. We focus on customer satisfaction. We have a proper and secure service for all the electronic items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
