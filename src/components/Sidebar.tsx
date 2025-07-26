import {
  FaUser,
  FaCreditCard,
  FaWallet,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import Logout from "./Logout";

interface SidebarProps {
  onSelectSection: (section: string) => void;
  selectedSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectSection,
  selectedSection,
}) => {
  return (
    <div className="bg-blue-700 text-white h-screen w-64 p-4 flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src="/images/logo.svg" alt="SuiLift Logo" className="h-14" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1 min-h-0">
        <div className="flex flex-col justify-between h-full min-h-0">
          {/* upper Items */}
          <ul className="space-y-2 flex-shrink-0">
            <li
              className={`flex items-center p-2 rounded cursor-pointer ${
                selectedSection === "profile"
                  ? "bg-white text-blue-700"
                  : "hover:bg-gray-500 hover:bg-opacity-30"
              }`}
              onClick={() => onSelectSection("profile")}
            >
              <FaUser className="mr-3" />
              <span>Profile View</span>
            </li>
            <li
              className={`flex items-center p-2 rounded cursor-pointer ${
                selectedSection === "card"
                  ? "bg-white text-blue-700"
                  : "hover:bg-gray-500 hover:bg-opacity-30"
              }`}
              onClick={() => onSelectSection("card")}
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
              onClick={() => onSelectSection("funding")}
            >
              <FaWallet className="mr-3" />
              <span>Transaction</span>
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
              onClick={() => onSelectSection("activity")}
            >
              <FaHistory className="mr-3" />
              <span>Recent Activity</span>
            </li>
            <Logout />
            {/* <li
              className={`flex items-center p-2 rounded cursor-pointer  text-blue-700 bg-amber-100 ${
                selectedSection === "logout"
                  ? "bg-gray-700 text-white"
                  : "hover:bg-gray-500 hover:bg-opacity-30"
              }`}
              onClick={() => onSelectSection("logout")}
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </li> */}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
