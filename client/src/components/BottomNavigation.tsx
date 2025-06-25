import { motion } from 'framer-motion';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'map', icon: 'map-marker-alt', label: 'Map' },
  { id: 'sos', icon: 'exclamation-triangle', label: 'SOS' },
  { id: 'learn', icon: 'graduation-cap', label: 'Learn' },
  { id: 'settings', icon: 'cog', label: 'Settings' },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-200 px-6 py-2">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? 'active' : ''} ${
              tab.id === 'sos' && activeTab === 'sos' ? 'bg-accent text-white' : ''
            }`}
            onClick={() => onTabChange(tab.id)}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas fa-${tab.icon} text-lg mb-1`}></i>
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
