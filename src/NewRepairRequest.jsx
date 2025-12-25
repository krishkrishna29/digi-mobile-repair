import React, { useState } from 'react';
import { db } from './firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext'; 

const steps = ['Device Information', 'Issue Description', 'Contact Details', 'Review and Submit'];

const NewRepairRequest = () => {
  const { currentUser } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    deviceType: '',
    brand: '',
    model: '',
    serialNumber: '',
    issue: '',
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error'
  const [submissionMessage, setSubmissionMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) {
        setSubmissionStatus('error');
        setSubmissionMessage('You must be logged in to submit a request.');
        return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);
    setSubmissionMessage('');

    try {
      // 1. Add repair request to 'repairs' collection
      await addDoc(collection(db, 'repairs'), {
        userId: currentUser.uid,
        device: `${formData.brand} ${formData.model}`,
        issue: formData.issue,
        deviceType: formData.deviceType,
        serialNumber: formData.serialNumber,
        contactDetails: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber
        },
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      // 2. Create a notification for the admin
      await addDoc(collection(db, 'notifications'), {
        userId: 'admin', // Specific ID for admin user
        type: 'repair_request_new',
        title: 'New Repair Request',
        message: `A new repair request has been submitted by ${formData.fullName || currentUser.email}.`,
        read: false,
        createdAt: serverTimestamp(),
      });
      
      setSubmissionStatus('success');
      setSubmissionMessage('Your repair request has been submitted successfully! We will get back to you shortly.');
      setActiveStep(steps.length); // Move to a "completed" step

    } catch (error) {
      console.error('Error submitting repair request:', error);
      setSubmissionStatus('error');
      setSubmissionMessage('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="deviceType" value={formData.deviceType} onChange={handleInputChange} placeholder="Device Type (e.g., Smartphone, Laptop)" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand (e.g., Apple, Samsung)" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="model" value={formData.model} onChange={handleInputChange} placeholder="Model (e.g., iPhone 13, Galaxy S22)" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} placeholder="Serial Number (Optional)" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 1:
        return (
          <textarea name="issue" value={formData.issue} onChange={handleInputChange} placeholder="Briefly describe the issue" rows="4" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-gray-100 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        );
      case 3:
        return (
            <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Review Your Request</h3>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Device:</strong> {formData.deviceType} {formData.brand} {formData.model}</p>
                    <p><strong>Issue:</strong> {formData.issue}</p>
                    <p><strong>Contact:</strong> {formData.fullName} ({formData.email}, {formData.phoneNumber})</p>
                </div>
            </div>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">New Repair Request</h2>
        {activeStep === steps.length ? (
            <div className="text-center py-12">
                {submissionStatus === 'success' && (
                    <>
                        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="text-2xl font-bold text-gray-800 mt-4">Submission Successful!</h3>
                        <p className="text-gray-600 mt-2">{submissionMessage}</p>
                    </>
                )}
                {submissionStatus === 'error' && (
                    <>
                         <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="text-2xl font-bold text-gray-800 mt-4">Submission Failed</h3>
                        <p className="text-red-600 mt-2">{submissionMessage}</p>
                        <button onClick={() => setActiveStep(0)} className="mt-6 bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700">
                            Try Again
                        </button>
                    </>
                )}
            </div>
        ) : (
            <>
                <div className="mb-8">
                  <div className="hidden md:flex items-center justify-between">
                    {steps.map((label, index) => (
                      <React.Fragment key={label}>
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${activeStep >= index ? 'bg-blue-600' : 'bg-gray-300'}`}>{index + 1}</div>
                          <span className={`ml-4 text-lg font-medium ${activeStep >= index ? 'text-gray-800' : 'text-gray-500'}`}>{label}</span>
                        </div>
                        {index < steps.length - 1 && <div className="flex-auto border-t-2 border-gray-300 mx-4"></div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-4 md:p-6 border border-gray-200 rounded-lg mb-6">
                        {getStepContent(activeStep)}
                    </div>
                    <div className="flex justify-end">
                        {activeStep !== 0 && (
                            <button type="button" onClick={handleBack} disabled={isSubmitting} className="mr-4 bg-gray-200 text-gray-700 font-bold py-2 px-4 md:px-6 rounded-lg hover:bg-gray-300 disabled:opacity-50">
                                Back
                            </button>
                        )}
                        {activeStep === steps.length - 1 ? (
                            <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white font-bold py-2 px-4 md:px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        ) : (
                            <button type="button" onClick={handleNext} className="bg-blue-600 text-white font-bold py-2 px-4 md:px-6 rounded-lg hover:bg-blue-700">
                                Next
                            </button>
                        )}
                    </div>
                </form>
            </>
        )}
      </div>
    </div>
  );
};

export default NewRepairRequest;
