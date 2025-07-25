import {
  FaUser,
  FaCreditCard,
  FaWallet,
  FaExchangeAlt,
  FaCog,
} from "react-icons/fa";

interface SidebarProps {
  onSelectSection: (section: string) => void;
  selectedSection: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  onSelectSection,
  selectedSection,
}) => {
  return (
    <div className="bg-blue-700 text-white h-screen w-64 p-4 flex flex-col">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <img src="/images/logo.svg" alt="SuiLift Logo" className="h-14" />
      </div>

      {/* Menu Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
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
            <span>Funding Option</span>
          </li>
          <li
            className={`flex items-center p-2 rounded cursor-pointer ${
              selectedSection === "transaction"
                ? "bg-white text-blue-700"
                : "hover:bg-gray-500 hover:bg-opacity-30"
            }`}
            onClick={() => onSelectSection("transaction")}
          >
            <FaExchangeAlt className="mr-3" />
            <span>Transaction</span>
          </li>
          <li
            className={`flex items-center p-2 rounded cursor-pointer ${
              selectedSection === "settings"
                ? "bg-white text-blue-700"
                : "hover:bg-gray-500 hover:bg-opacity-30"
            }`}
            onClick={() => onSelectSection("settings")}
          >
            <FaCog className="mr-3" />
            <span>Settings</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
