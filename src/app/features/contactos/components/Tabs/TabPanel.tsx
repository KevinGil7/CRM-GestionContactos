import React from 'react';

interface TabPanelProps {
  isActive: boolean;
  children: React.ReactNode;
}

const TabPanel: React.FC<TabPanelProps> = ({ isActive, children }) => {
  if (!isActive) return null;

  return (
    <div className="space-y-6">
      {children}
    </div>
  );
};

export default TabPanel;
