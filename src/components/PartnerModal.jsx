
import React from 'react';

const PartnerModal = ({ isOpen, onClose, onSave, editingPartner }) => {
  if (!isOpen) return null;

  const isEditing = !!editingPartner;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6">
          {isEditing ? 'Edit Delivery Partner' : 'Add New Delivery Partner'}
        </h2>
        
        <form onSubmit={onSave}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-300">Full Name</label>
              <input type="text" id="fullName" name="fullName" defaultValue={editingPartner?.fullName || ''} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
              <input type="email" id="email" name="email" defaultValue={editingPartner?.email || ''} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500" required disabled={isEditing} />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Phone Number</label>
              <input type="tel" id="phone" name="phone" defaultValue={editingPartner?.mobileNumber || ''} className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500" required />
            </div>
            {!isEditing && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                <input type="password" id="password" name="password" className="mt-1 block w-full bg-slate-700 border-slate-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500" required />
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 rounded-md hover:bg-slate-600">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700">
              {isEditing ? 'Save Changes' : 'Save Partner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnerModal;
