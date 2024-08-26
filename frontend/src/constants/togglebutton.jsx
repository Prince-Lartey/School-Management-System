import React, { useState } from 'react';
import { FaEllipsisV, FaEllipsisH } from 'react-icons/fa';

const ToggleButton = ({ onToggle }) => {
    const [isToggled, setIsToggled] = useState(false);

    const handleToggle = () => {
        setIsToggled(!isToggled);
        onToggle(!isToggled);
    };

    return (
        <button onClick={handleToggle} className="relative p-2">
            {isToggled ? <FaEllipsisH /> : <FaEllipsisV />}
        </button>
    );
};

export default ToggleButton;
