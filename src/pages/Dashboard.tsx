// Dashboard.js
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProfileView from "../components/ProfileView";
import CardDetails from "../components/CardDetails";
import FundingOption from "../components/FundingOption";
import Transaction from "../components/Transaction";
import Settings from "../components/Settings";

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>("profile");

  const renderContent = () => {
    switch (selectedSection) {
      case "profile":
        return <ProfileView />;
      case "card":
        return <CardDetails />;
      case "funding":
        return <FundingOption />;
      case "transaction":
        return <Transaction />;
      case "settings":
        return <Settings />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <main className="flex">
      <Sidebar
        onSelectSection={setSelectedSection}
        selectedSection={selectedSection}
      />
      <div className="flex-1 p-6 min-h-screen">{renderContent()}</div>
    </main>
  );
};

export default Dashboard;
