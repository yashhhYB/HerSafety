import { motion } from 'framer-motion';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'home', icon: 'home', label: 'Home' },
  { id: 'map', icon: 'map-marker-alt', label: 'Map' },
  { id: 'sos', icon: 'exclamation-triangle', label: 'SOS' },
  { id: 'guardian', icon: 'brain', label: 'AI Guard' },
  { id: 'learn', icon: 'graduation-cap', label: 'Learn' },
  { id: 'settings', icon: 'cog', label: 'Settings' },
];

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
      <div className="floating-card mx-3 mb-safe-area-inset-bottom mb-4 px-2 py-3 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl">
        <div className="flex justify-around items-center gap-1">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              className={`nav-item relative flex-1 max-w-[80px] ${activeTab === tab.id ? 'active' : ''} ${
                tab.id === 'sos' ? 'sos-tab' : ''
              } ${tab.id === 'guardian' ? 'guardian-tab' : ''}`}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              
              {/* SOS special styling */}
              {tab.id === 'sos' ? (
                <div className={`relative ${activeTab === 'sos' ? 'text-white' : 'text-accent'}`}>
                  {activeTab === 'sos' && (
                    <motion.div
                      className="absolute inset-0 bg-accent rounded-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.i 
                      className={`fas fa-${tab.icon} text-lg mb-1`}
                      animate={activeTab === 'sos' ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-xs font-bold">{tab.label}</span>
                  </div>
                </div>
              ) : tab.id === 'guardian' ? (
                <div className={`relative ${activeTab === 'guardian' ? 'text-white' : 'text-purple-600'}`}>
                  {activeTab === 'guardian' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.i 
                      className={`fas fa-${tab.icon} text-lg mb-1`}
                      animate={activeTab === 'guardian' ? { rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-bold">{tab.label}</span>
                  </div>
                </div>
              ) : (
                <>
                  <motion.i 
                    className={`fas fa-${tab.icon} text-lg mb-1`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  />
                  <span className="text-xs font-medium">{tab.label}</span>
                </>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
