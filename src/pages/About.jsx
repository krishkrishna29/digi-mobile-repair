import React from 'react';
import { CheckCircleIcon, UsersIcon, LightBulbIcon, HeartIcon } from '@heroicons/react/24/solid';

const AboutUs = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-pink-500">
            About Venus Repair & Services
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300">
            Your trusted partner in keeping your digital life running smoothly. We're passionate about technology and dedicated to providing fast, reliable, and transparent repair services.
          </p>
        </div>

        {/* Mission & Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative h-full flex items-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-pink-600 rounded-2xl transform -rotate-2 scale-105"></div>
            <img 
              src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Our Team at Work" 
              className="rounded-2xl shadow-2xl relative z-10 w-full h-[450px] object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-6 flex items-center"><LightBulbIcon className="h-10 w-10 mr-4 text-yellow-400"/>Our Mission</h2>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              To deliver exceptional repair services with a focus on quality, speed, and customer satisfaction. We strive to be the most reliable and transparent tech repair service in the industry, making technology accessible and stress-free for everyone.
            </p>
            <h3 className="text-3xl font-bold mb-6 flex items-center"><HeartIcon className="h-9 w-9 mr-4 text-red-500"/>Our Core Values</h3>
            <ul className="space-y-4 text-gray-300 text-lg">
              <li className="flex items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <CheckCircleIcon className="h-7 w-7 mr-3 text-green-500 flex-shrink-0 mt-0.5"/>
                <span><strong>Customer-Centric:</strong> You are at the heart of everything we do.</span>
              </li>
              <li className="flex items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <CheckCircleIcon className="h-7 w-7 mr-3 text-green-500 flex-shrink-0 mt-0.5"/>
                <span><strong>Quality:</strong> We use only the best parts and skilled technicians.</span>
              </li>
              <li className="flex items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <CheckCircleIcon className="h-7 w-7 mr-3 text-green-500 flex-shrink-0 mt-0.5"/>
                <span><strong>Transparency:</strong> Clear communication and honest pricing. No surprises.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Meet the Team Section */}
        <div className="text-center mb-24">
            <h2 className="text-4xl font-bold mb-16 flex items-center justify-center"><UsersIcon className="h-10 w-10 mr-4 text-blue-400"/>Meet Our Experts</h2>
            <div className="flex flex-wrap justify-center gap-12 lg:gap-20">
                {[
                    { name: "Mr.Shashank", role: "Developer and Designer", img: "/Shashank.jpeg" },
                    { name: "Mr.Krishna", role: "Developer and Designer", img: "/Krishna.jpeg" },
                    { name: "Coding Star", role: "Hardware Specialist", img: "/App_Logo.svg" },
                ].map(member => (
                     <div key={member.name} className="group text-center">
                        <div className="relative mb-6 mx-auto w-40 h-40">
                          <div className="absolute inset-0 bg-blue-500 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300 blur-md opacity-20"></div>
                          <img src={member.img} alt={member.name} className="w-40 h-40 rounded-full relative z-10 bg-gray-700 object-cover shadow-2xl border-4 border-gray-800 group-hover:border-blue-500 transition-colors"/>
                        </div>
                        <h4 className="text-2xl font-bold mb-1">{member.name}</h4>
                        <p className="text-blue-400 font-medium text-lg">{member.role}</p>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-3xl shadow-2xl border border-white/5">
          <h2 className="text-4xl font-bold mb-6">Device acting up?</h2>
          <p className="text-gray-300 text-xl mb-8 max-w-2xl mx-auto">Don't let a broken device ruin your day. Our expert technicians are ready to bring your tech back to life.</p>
          <a href="/login" className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold py-4 px-10 rounded-full hover:scale-105 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)] transform transition-all duration-300 inline-block text-lg">
            Request a Repair Now
          </a>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
