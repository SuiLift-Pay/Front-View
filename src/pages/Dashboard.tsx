// Dashboard.js
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ProfileView from '../components/ProfileView';
import CardDetails from '../components/CardDetails';
import FundingOption from '../components/FundingOption';
import Activity from '../components/Activity';
import ProfilePage from '../components/Profile';
import Logout from '../components/Logout';

const Dashboard: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState<string>('profile');

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return <ProfileView />;
      case 'card':
        return <CardDetails />;
      case 'funding':
        return <FundingOption />;
      case 'activity':
        return <Activity />;
      case 'profile-settings':
        return <ProfilePage />;
      case 'logout':
        return <Logout />;
      default:
        return <ProfileView />;
    }
  };

  return (
    <main className='flex'>
      <Sidebar
        onSelectSection={setSelectedSection}
        selectedSection={selectedSection}
      />
      <div className='flex-1 p-4 md:p-6 min-h-screen md:ml-64 max-w-full md:max-w-7xl mx-auto w-full'>
        {renderContent()}
      </div>
    </main>
  );
};

export default Dashboard;
