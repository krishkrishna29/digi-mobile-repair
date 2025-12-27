import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Footer from '../components/Footer';
import WhyUs from '../components/WhyUs';
import OfferHighlight from '../components/OfferHighlight';

const services = [
  {
    title: 'Display Failure',
    description: 'Our experts repair any mobile display that looks active but does not respond to touch in one single go.',
    image: 'https://ts4.mm.bing.net/th?id=OIP.Lv0f4KEcmT25nmQbU5zh0gHaE7&pid=15.1'
  },
  {
    title: 'Liquid Damage',
    description: 'It does not matter whether it is one splash, one spill, or full immersion. We have got you fully covered for any liquid damage.',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Signal/Charging Issues',
    description: 'From minor charging issues to major signal detection faults, we fix all and replace the parts in no time.',
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Damaged Mobile',
    description: "Damaged screens to broken integral parts, we cover all major damages that even the service-center can't fix.",
    image: 'https://ts1.mm.bing.net/th?id=OIP.2h7fusP0-EeKmtV2i9MnYAHaE7&pid=15.1'
  },
  {
    title: 'Power Issues',
    description: 'We can fix all the power issues, including mobile battery and charging. We will keep your device running all the time.',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    title: 'Motherboard Replacement',
    description: 'We provide original motherboard repair and replacement service to all mobile phones at reasonable rates.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
];

const heroImages = [
  'https://img.freepik.com/premium-photo/photo-technician-repairing-smartphone_1056572-8471.jpg',
  'https://images.unsplash.com/photo-1512446816042-444d641267d4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Section */}
      <div 
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-down">Trusted Mobile Phone</h1>
            <h2 className="text-2xl md:text-3xl font-light mb-6 animate-fade-in-up">Repair and Services - Ballari</h2>
            <Link to="/new-repair-request" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 shadow-lg inline-block">
              Enquire Now
            </Link>
          </div>
        </div>
        
        {/* Slider Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>

      <OfferHighlight />

      {/* Services Section */}
      <div className="py-24 bg-black bg-opacity-60">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-bold text-center mb-12">SERVICES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                <img src={service.image} alt={service.title} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-400 mb-4">{service.description}</p>
                  <Link to="/new-repair-request" className="text-gray-400 hover:text-gray-300 font-medium flex items-center">
                    Enquire Now <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <WhyUs />
      <Footer />
    </div>
  );
};

export default Home;
