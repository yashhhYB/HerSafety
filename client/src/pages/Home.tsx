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
      title: 'AI Guardian',
      subtitle: 'Smart Protection',
      icon: 'brain',
      gradient: 'gradient-purple',
      onClick: () => onNavigate('guardian'),
    },
    {
      title: 'Safe Zones',
      subtitle: 'Find Help Nearby',
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
  ];

  return (
    <div className="screen active">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="gradient-primary text-white px-6 py-8 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
            <div className="absolute top-4 right-4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-shadow mb-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  Welcome to Sefty1st
                </motion.h1>
                <motion.p 
                  className="text-blue-100 text-lg font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  You are not alone.
                </motion.p>
              </div>
              <motion.div 
                className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-float"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <i className="fas fa-shield-alt text-2xl"></i>
              </motion.div>
            </div>
            
            {/* Enhanced Alert Status */}
            <motion.div 
              className="floating-card p-4 flex items-center justify-between"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                  <div className="pulse-ring w-4 h-4 bg-green-400"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Safety Network Active</p>
                  <p className="text-xs text-gray-600">All systems operational</p>
                </div>
              </div>
              <div className="text-green-600">
                <i className="fas fa-check-circle text-lg"></i>
              </div>
            </motion.div>
          </div>
        </div>
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
