import { FaCheckCircle } from "react-icons/fa";

import Header from "./Header";

interface ProfileViewProps {
  onGetVirtualCard?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ onGetVirtualCard }) => {
  return (
    <div className="p-6">
      <div className="min-h-screen bg-black text-white md:px-6 lg:px-30 py-6 font-sans">
        {/* Header */}
        <Header onGetVirtualCard={onGetVirtualCard} />

        {/* Profile Info */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <div className="">
            <h3 className="text-md font-medium mb-2">Profile Overview</h3>
            <p className="text-sm text-gray-400 mb-4">
              Manage your Web3 Payment Card Account
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {/* Account Status */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg">Account Status</p>
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-500 font-bold flex items-center gap-1">
                  KYC: VERIFIED
                </p>
              </div>

              {/* Total Balance */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg ">$ SUI Balance</p>
                <p className="text-xl font-bold">100</p>
                <p className="text-md text-green-400">$2,35</p>
              </div>

              {/* Monthly Spending */}
              <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center gap-2">
                <p className="text-lg">Total Spent</p>
                <p className="text-xl font-bold">50.38</p>
                <p className="text-md text-green-400">$1,15</p>
              </div>

              {/* Spending Limit */}
              {/* <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm mb-1">Spending Limit</p>
                <p className="text-xl font-bold">$700</p>
                <p className="text-xs text-green-400">$500 / $700 Used</p>
                <div className="w-full h-2 mt-2 bg-gray-700 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: "71%" }}
                  ></div>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div>
          {/* <h3 className="text-md font-medium mb-3">Quick Action</h3> */}
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900 rounded-xl p-6 mb-8">
            
            <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <FaCreditCard className="text-green-600 text-xl" />
                <p className="text-lg font-semibold">Fund Card</p>
                <p className="text-sm text-gray-400">Add SUI or USDC</p>
              </div>
            </button>

            
            <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <MdSecurity className="text-blue-600 text-xl" />
                <p className="text-lg font-semibold">Security Settings</p>
                <p className="text-sm text-gray-400">Manage Card Security</p>
              </div>
            </button>

            
            <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <BsFillShieldLockFill className="text-purple-600 text-xl" />
                <p className="text-lg font-semibold">Security Settings</p>
                <p className="text-sm text-gray-400">View Detail Reports</p>
              </div>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
