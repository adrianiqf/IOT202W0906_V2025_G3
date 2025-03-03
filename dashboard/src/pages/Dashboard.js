import React, { useState } from 'react';
import Header from '../components/dashboard/layout/Header';
import DashboardTabs from '../components/dashboard/layout/DashboardTabs';
import KpiSection from '../components/dashboard/sections/KpiSection';
import { DashboardProvider } from '../context/DashboardContext';

const Dashboard = () => {
  return (
    <DashboardProvider>
      <div className="flex flex-col h-full bg-gray-100">
        <Header />
        <main className="container mx-auto py-6 px-4 flex-1">
          <KpiSection />
          <DashboardTabs />
        </main>
      </div>
    </DashboardProvider>
  );
};

export default Dashboard;