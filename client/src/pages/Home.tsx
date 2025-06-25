import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ActionCard } from '@/components/ActionCard';
import { IncidentCard } from '@/components/IncidentCard';
import { ReportModal } from '@/components/ReportModal';
import type { Incident } from '@shared/schema';

interface HomeProps {
  onNavigate: (tab: string) => void;
}

export function Home({ onNavigate }: HomeProps) {
  const [showReportModal, setShowReportModal] = useState(false);

  const { data: incidents = [] } = useQuery<Incident[]>({
    queryKey: ['/api/incidents?limit=3'],
  });

  const actionCards = [
    {
      title: 'SOS Help',
      subtitle: 'Emergency Alert',
      icon: 'exclamation-triangle',
      gradient: 'gradient-accent',
      onClick: () => onNavigate('sos'),
    },
    {
      title: 'Find Nearby Help',
      subtitle: 'Safe Zones',
      icon: 'map-marker-alt',
      gradient: 'gradient-blue',
      onClick: () => onNavigate('map'),
    },
    {
      title: 'Report Incident',
      subtitle: 'Anonymous',
      icon: 'flag',
      gradient: 'gradient-amber',
      onClick: () => setShowReportModal(true),
    },
    {
      title: 'Learn About Safety',
      subtitle: 'Education Hub',
      icon: 'graduation-cap',
      gradient: 'gradient-purple',
      onClick: () => onNavigate('learn'),
    },
  ];

  return (
    <div className="screen active">
      {/* Header */}
      <div className="gradient-primary text-white px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <motion.h1 
              className="text-2xl font-bold"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Welcome to Sefty1st
            </motion.h1>
            <motion.p 
              className="text-blue-100 mt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              You are not alone.
            </motion.p>
          </div>
          <motion.div 
            className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <i className="fas fa-shield-alt text-xl"></i>
          </motion.div>
        </div>
        
        {/* Alert Status */}
        <motion.div 
          className="bg-white bg-opacity-10 rounded-lg p-3 flex items-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Your safety network is active</span>
        </motion.div>
      </div>

      {/* Action Cards */}
      <div className="px-6 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {actionCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <ActionCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="px-6 pb-6">
        <motion.h3 
          className="font-semibold text-gray-800 mb-4 flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <i className="fas fa-bell text-accent mr-2"></i>
          Recent Alerts
        </motion.h3>
        
        <div className="space-y-3">
          {incidents.length > 0 ? (
            incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
              >
                <IncidentCard
                  type={incident.type}
                  location={incident.location}
                  timeAgo={incident.createdAt ? `${Math.floor((Date.now() - new Date(incident.createdAt).getTime()) / 60000)} mins ago` : 'Recently'}
                  priority="high"
                  distance="2.3 km"
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <i className="fas fa-shield-alt text-4xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">No recent alerts in your area</p>
              <p className="text-sm text-gray-400 mt-1">Stay safe and alert</p>
            </motion.div>
          )}
        </div>
      </div>

      <ReportModal 
        isOpen={showReportModal} 
        onClose={() => setShowReportModal(false)} 
      />
    </div>
  );
}
