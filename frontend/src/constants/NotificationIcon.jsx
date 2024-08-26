import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

const NotificationIcon = ({ count }) => {
    return (
        <div className="relative">
            <FontAwesomeIcon icon={faBell} className="text-3xl text-gray-700" />
            <span className={`absolute top-0 right-0 w-4 h-4 text-xs text-white ${count > 0 ? 'bg-red-500' : 'bg-red-500'} rounded-full flex items-center justify-center`}>
                {count}
            </span>
        </div>
    );
};

export default NotificationIcon