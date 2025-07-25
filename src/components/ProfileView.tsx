import { FaCheckCircle, FaCreditCard } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { BsFillShieldLockFill } from "react-icons/bs";
import Header from "./Header";

const ProfileView = () => {
  const name = "Mark Millian";
  const walletAddress = "0x345d...6819 45p9u4";
  return (
    <div className="p-6">
      <div className="min-h-screen bg-black text-white md:px-6 lg:px-30 py-6 font-sans">
        {/* Header */}
        <Header name={name} walletAddress={walletAddress} />

        {/* Profile Info */}
        <div className="bg-gray-900 rounded-xl p-6 mb-8">
          <section className="flex justify-between items-center">
            <div className="flex items-center gap-4 mb-4">
              <img
                src="/images/user.jpg"
                alt="User"
                className="w-14 h-14 rounded-full border"
              />
              <div>
                <h2 className="text-lg font-semibold">Mark Millian</h2>
                <p className="text-green-500 text-sm font-medium flex items-center gap-1">
                  <FaCheckCircle className="text-green-500" />
                  KYC: VERIFIED
                </p>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2">
              <FaCreditCard />
              Virtual Card
            </button>
          </section>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-md font-medium mb-2">Profile Overview</h3>
            <p className="text-sm text-gray-400 mb-4">
              Manage your Web3 Payment Card Account
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Account Status */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm mb-2">Account Status</p>
                <p className="text-green-500 font-bold flex items-center gap-1">
                  <FaCheckCircle />
                  KYC: VERIFIED
                </p>
              </div>

              {/* Total Balance */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm mb-1">Total Balance</p>
                <p className="text-xl font-bold">$2,350</p>
                <p className="text-xs text-green-400">100 SUI + 500 USDC</p>
              </div>

              {/* Monthly Spending */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm mb-1">Monthly Spending</p>
                <p className="text-xl font-bold">$500.38</p>
                <p className="text-xs text-green-400">+12% from last month</p>
              </div>

              {/* Spending Limit */}
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm mb-1">Spending Limit</p>
                <p className="text-xl font-bold">$700</p>
                <p className="text-xs text-green-400">$500 / $700 Used</p>
                <div className="w-full h-2 mt-2 bg-gray-700 rounded">
                  <div
                    className="bg-green-500 h-2 rounded"
                    style={{ width: "71%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action */}
        <div>
          <h3 className="text-md font-medium mb-3">Quick Action</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900 rounded-xl p-6 mb-8">
            {/* Fund Card */}
            <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <FaCreditCard className="text-green-600 text-xl" />
                <p className="text-lg font-semibold">Fund Card</p>
                <p className="text-sm text-gray-400">Add SUI or USDC</p>
              </div>
            </button>

            {/* Manage Card Security */}
            <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <MdSecurity className="text-blue-600 text-xl" />
                <p className="text-lg font-semibold">Security Settings</p>
                <p className="text-sm text-gray-400">Manage Card Security</p>
              </div>
            </button>

            {/* View Reports */}
            <button className="bg-gray-800 rounded-xl p-4 text-left hover:bg-gray-700">
              <div className="flex flex-col items-center gap-2 mb-2">
                <BsFillShieldLockFill className="text-purple-600 text-xl" />
                <p className="text-lg font-semibold">Security Settings</p>
                <p className="text-sm text-gray-400">View Detail Reports</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
