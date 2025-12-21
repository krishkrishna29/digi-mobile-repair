import React, { useState } from 'react';

const steps = ['Device Information', 'Issue Description', 'Contact Details', 'Review and Submit'];

const NewRepairRequest = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Device Type" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Brand" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Model" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" placeholder="Serial Number" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 1:
        return (
          <textarea placeholder="Briefly describe the issue" rows="4" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" placeholder="Email Address" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="tel" placeholder="Phone Number" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 3:
        return (
          <h3 className="text-xl font-semibold text-gray-800">Review your request and submit.</h3>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">New Repair Request</h2>
        <div className="mb-8">
          {/* Stepper for larger screens */}
          <div className="hidden md:flex items-center justify-between">
            {steps.map((label, index) => (
              <React.Fragment key={label}>
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= index ? 'bg-blue-600' : 'bg-gray-300'}`}>
                    {index + 1}
                  </div>
                  <span className={`ml-4 text-lg font-medium ${activeStep >= index ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
                </div>
                {index < steps.length - 1 && <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>}
              </React.Fragment>
            ))}
          </div>
          {/* Stepper for smaller screens */}
          <div className="md:hidden">
            <div className="flex items-center mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= 0 ? 'bg-blue-600' : 'bg-gray-300'}`}>
                {activeStep + 1}
              </div>
              <span className={`ml-4 text-lg font-medium text-gray-800`}>{steps[activeStep]}</span>
            </div>
            <div className="flex w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-full h-full bg-blue-600 transition-all duration-500 ease-in-out" style={{ transform: `scaleX(${(activeStep + 1) / steps.length})`, transformOrigin: 'left' }}></div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 md:p-6 border border-gray-200 rounded-lg mb-6">
            {getStepContent(activeStep)}
          </div>
          <div className="flex justify-end">
            {activeStep !== 0 && (
              <button type="button" onClick={handleBack} className="mr-4 bg-gray-200 text-gray-700 font-bold py-2 px-4 md:px-6 rounded-lg hover:bg-gray-300">
                Back
              </button>
            )}
            <button type="button" onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext} className="bg-blue-600 text-white font-bold py-2 px-4 md:px-6 rounded-lg hover:bg-blue-700">
              {activeStep === steps.length - 1 ? 'Submit Request' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRepairRequest;
