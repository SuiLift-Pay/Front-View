import React from "react";
import {
  FaUser,
  FaCreditCard,
  FaWallet,
  FaExchangeAlt,
  FaCog,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="bg-blue-700 text-white h-screen w-64 p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src="/images/logo.svg" alt="SuiLift Logo" className="h-10 mr-2" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li className="flex items-center p-2 bg-gray-500 bg-opacity-30 rounded">
            <FaUser className="mr-3" />
            <span>Profile View</span>
          </li>
          <li className="flex items-center p-2 hover:bg-gray-500 hover:bg-opacity-30 rounded">
            <FaCreditCard className="mr-3" />
            <span>Card Details</span>
          </li>
          <li className="flex items-center p-2 hover:bg-gray-500 hover:bg-opacity-30 rounded">
            <FaWallet className="mr-3" />
            <span>Funding Option</span>
          </li>
          <li className="flex items-center p-2 hover:bg-gray-500 hover:bg-opacity-30 rounded">
            <FaExchangeAlt className="mr-3" />
            <span>Transaction</span>
          </li>
          <li className="flex items-center p-2 hover:bg-gray-500 hover:bg-opacity-30 rounded">
            <FaCog className="mr-3" />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
