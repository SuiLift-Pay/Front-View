import { useNavigate } from "react-router-dom";
import { useCurrentAccount, useDisconnectWallet } from "@mysten/dapp-kit";
import { FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

function Logout() {
  const account = useCurrentAccount();
  const disconnectWallet = useDisconnectWallet();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    if (!account) return;
    setLoading(true);

    setTimeout(() => {
      disconnectWallet.mutate();
      navigate("/signin");
    }, 2000); // 2 seconds delay
  };

  return (
    <button
      onClick={handleLogout}
      disabled={!account || loading}
      className={`flex items-center p-2 rounded cursor-pointer text-blue-700 bg-amber-100 hover:bg-gray-500 hover:bg-opacity-30 w-full text-left ${
        !account || loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <FaSignOutAlt className="mr-3" />
      <span>{loading ? "Logging out..." : "Logout"}</span>
    </button>
  );
}

export default Logout;
