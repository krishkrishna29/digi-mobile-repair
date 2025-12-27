import React from 'react';

const Invoice = ({ repair, onDownload, onBack }) => {
    // Dummy data for now, will be replaced with admin-configurable data
    const companyDetails = {
        name: "DIGI Repair",
        address: "123 Tech Street, Silicon Valley, CA 94107",
        phone: "(123) 456-7890",
        email: "support@digirepair.com"
    };

    return (
        <div id="invoice" className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto text-black">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{companyDetails.name}</h1>
                    <p className="text-gray-600">{companyDetails.address}</p>
                    <p className="text-gray-600">{companyDetails.phone}</p>
                    <p className="text-gray-600">{companyDetails.email}</p>
                </div>
                <h2 className="text-2xl font-bold text-gray-700">Invoice</h2>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Repair Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p><strong>Repair ID:</strong> {repair.id}</p>
                        <p><strong>Device:</strong> {repair.deviceBrand} {repair.deviceModel}</p>
                        <p><strong>IMEI:</strong> {repair.imei}</p>
                    </div>
                    <div>
                        <p><strong>Issue:</strong> {repair.issueCategory} - {repair.subIssue}</p>
                        <p><strong>Status:</strong> {repair.status}</p>
                        <p><strong>Payment Method:</strong> {repair.paymentMethod}</p>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Charges</h3>
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="border-b-2 border-gray-300 py-2">Description</th>
                            <th className="border-b-2 border-gray-300 py-2 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="py-2">Service Fee</td>
                            <td className="py-2 text-right">₹1000</td>
                        </tr>
                        <tr>
                            <td className="py-2">Parts</td>
                            <td className="py-2 text-right">₹1500</td>
                        </tr>
                        <tr className="font-bold">
                            <td className="py-2">Total</td>
                            <td className="py-2 text-right">₹2500</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Warranty Information</h3>
                <p className="text-gray-600">All repairs come with a 90-day warranty on parts and labor. This warranty does not cover accidental damage.</p>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
                <button onClick={onBack} className="bg-gray-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-md">Back</button>
                <button onClick={onDownload} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md">Download PDF</button>
            </div>
        </div>
    );
};

export default Invoice;
