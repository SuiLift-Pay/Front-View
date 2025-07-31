import {
  FaCreditCard,
  FaWallet,
  FaHistory,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import { useState } from "react";
import Logout from "./Logout";

interface SidebarProps {
  onSelectSection: (section: string) => void;
  selectedSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectSection,
  selectedSection,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSectionClick = (section: string) => {
    onSelectSection(section);
    setIsMobileMenuOpen(false); // Close mobile menu when section is selected
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-80 bg-blue-700 text-white p-2 rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle sidebar menu"
      >
        <div className="w-6 h-6 flex flex-col justify-center items-center">
          <span
            className={`block w-5 h-0.5 bg-white mb-1 transition-all duration-300 ${
              isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white mb-1 transition-all duration-300 ${
              isMobileMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-5 h-0.5 bg-white transition-all duration-300 ${
              isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </div>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`bg-blue-700 text-white h-full w-64 p-4 flex flex-col fixed left-0 top-0 z-30 transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center mb-8 mt-8 md:mt-0">
          <img src="/images/logo.svg" alt="SuiLift Logo" className="h-14" />
        </div>

        {/* Menu Items */}
        <nav className="flex-1 min-h-0">
          <div className="flex flex-col justify-between h-full min-h-0">
            {/* upper Items */}
            <ul className="space-y-2 flex-shrink-0">
              <li
                className={`flex items-center p-2 rounded cursor-pointer ${
                  selectedSection === "dashboard"
                    ? "bg-white text-blue-700"
                    : "hover:bg-gray-500 hover:bg-opacity-30"
                }`}
                onClick={() => handleSectionClick("dashboard")}
              >
                <FaTachometerAlt className="mr-3" />
                <span>Dashboard</span>
              </li>

              <li
                className={`flex items-center p-2 rounded cursor-pointer ${
                  selectedSection === "card"
                    ? "bg-white text-blue-700"
                    : "hover:bg-gray-500 hover:bg-opacity-30"
                }`}
                onClick={() => handleSectionClick("card")}
              >
                <FaCreditCard className="mr-3" />
                <span>Card Details</span>
              </li>
              <li
                className={`flex items-center p-2 rounded cursor-pointer ${
                  selectedSection === "funding"
                    ? "bg-white text-blue-700"
                    : "hover:bg-gray-500 hover:bg-opacity-30"
                }`}
                onClick={() => handleSectionClick("funding")}
              >
                <FaWallet className="mr-3" />
                <span>Transaction</span>
              </li>
              <li
                className={`flex items-center p-2 rounded cursor-pointer ${
                  selectedSection === "profile-settings"
                    ? "bg-white text-blue-700"
                    : "hover:bg-gray-500 hover:bg-opacity-30"
                }`}
                onClick={() => handleSectionClick("profile-settings")}
              >
                <FaUserCircle className="mr-3" />
                <span>Profile</span>
              </li>
            </ul>
            {/* lower Items */}
            <ul className="flex-shrink-0 flex flex-col gap-5 mb-10">
              <li
                className={`flex items-center p-2 rounded cursor-pointer text-blue-700 bg-amber-100 ${
                  selectedSection === "activity"
                    ? "bg-gray-700 text-white"
                    : "hover:bg-gray-500 hover:bg-opacity-30"
                }`}
                onClick={() => handleSectionClick("activity")}
              >
                <FaHistory className="mr-3" />
                <span>Recent Activity</span>
              </li>
              <Logout />
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
