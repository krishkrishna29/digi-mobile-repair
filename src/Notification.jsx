import React, { useState } from 'react';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

function Notification({ newRequestCount, onClear }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      onClear();
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <ChatBubbleLeftRightIcon className="h-8 w-8" />
        {newRequestCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {newRequestCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-8 w-80 bg-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">New Repair Requests!</h3>
            <button onClick={handleToggle}>
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            You have {newRequestCount} new repair request{newRequestCount > 1 ? 's' : ''}.
          </p>
        </div>
      )}
    </div>
  );
}

export default Notification;
