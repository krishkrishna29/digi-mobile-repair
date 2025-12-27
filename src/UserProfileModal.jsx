import React, { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const UserProfileModal = ({ isOpen, onClose }) => {
  const { userProfile, loading, refreshUserProfile } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...userProfile });

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...userProfile });
      setIsEditMode(false);
    }
  }, [isOpen, userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async () => {
    if (!userProfile) return;

    try {
      const userRef = doc(db, 'users', userProfile.uid);
      await updateDoc(userRef, formData);
      await refreshUserProfile(); // Refresh the user profile from context
      toast.success('Profile updated successfully!');
      setIsEditMode(false);
    } catch (error) { 
      toast.error('Failed to update profile.');
    }
  };

  if (!isOpen) return null;
  if (loading) return <div>Loading...</div>

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white rounded-lg p-8 w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Profile Settings</h2>

        {isEditMode ? (
          <div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Name</label>
              <input
                type='text'
                name='name'
                value={formData.name || ''}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Email</label>
              <input
                type='email'
                name='email'
                value={formData.email || ''}
                readOnly // Email is not editable
                className='w-full border rounded px-3 py-2 bg-gray-200'
              />
            </div>
            <div className='mb-4'>
              <label className='block text-gray-700'>Address</label>
              <input
                type='text'
                name='address'
                value={formData.address || ''}
                onChange={handleInputChange}
                className='w-full border rounded px-3 py-2'
              />
            </div>

            <div className='flex justify-end space-x-4'>
              <button
                onClick={() => setIsEditMode(false)}
                className='bg-gray-500 text-white px-4 py-2 rounded'
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                className='bg-blue-500 text-white px-4 py-2 rounded'
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p><strong>Name:</strong> {userProfile?.name}</p>
            <p><strong>Email:</strong> {userProfile?.email}</p>
            <p><strong>Address:</strong> {userProfile?.address}</p>

            <div className='flex justify-end space-x-4 mt-4'>
              <button
                onClick={onClose}
                className='bg-gray-500 text-white px-4 py-2 rounded'
              >
                Close
              </button>
              <button
                onClick={() => setIsEditMode(true)}
                className='bg-blue-500 text-white px-4 py-2 rounded'
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileModal;
