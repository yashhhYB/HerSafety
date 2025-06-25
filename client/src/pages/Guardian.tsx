import { motion } from 'framer-motion';
import { SmartGuardianPanel } from '@/components/SmartGuardianPanel';
import { ThreatRadarWidget } from '@/components/ThreatRadarWidget';
import { SafeRouteWidget } from '@/components/SafeRouteWidget';

export function Guardian() {
  return (
    <div className="screen active">
      <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white px-6 py-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <i className="fas fa-brain text-3xl"></i>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">AI Safety Intelligence</h1>
          <p className="text-purple-100 text-lg">Advanced protection powered by AI</p>
        </motion.div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Smart Guardian Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SmartGuardianPanel />
        </motion.div>

        {/* Threat Radar Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ThreatRadarWidget />
        </motion.div>

        {/* Safe Route Widget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SafeRouteWidget />
        </motion.div>

        {/* AI Features Overview */}
        <motion.div
          className="floating-card p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="font-bold text-lg flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            AI-Powered Features
          </h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-microphone text-purple-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Voice Pattern Recognition</h4>
                <p className="text-xs text-gray-600">Detects distress keywords and panic triggers in real-time</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-mobile-alt text-blue-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Motion Analysis</h4>
                <p className="text-xs text-gray-600">Analyzes movement patterns to detect emergencies</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-radar-alt text-red-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Live Threat Intelligence</h4>
                <p className="text-xs text-gray-600">Real-time threat monitoring from multiple data sources</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-route text-green-600"></i>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Smart Route Planning</h4>
                <p className="text-xs text-gray-600">AI-optimized routes based on safety data and community feedback</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}