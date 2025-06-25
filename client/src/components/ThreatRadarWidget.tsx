import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLiveThreatRadar } from '@/hooks/useLiveThreatRadar';

export function ThreatRadarWidget() {
  const { nearbyThreats, isLoading, refreshThreats, confirmThreat } = useLiveThreatRadar();

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      high: 'bg-red-100 text-red-800 border-red-200',
      critical: 'bg-red-200 text-red-900 border-red-300',
    };
    return colors[severity as keyof typeof colors] || colors.low;
  };

  const getSourceIcon = (source: string) => {
    const icons = {
      police_feed: 'fas fa-shield-alt',
      news_api: 'fas fa-newspaper',
      community: 'fas fa-users',
    };
    return icons[source as keyof typeof icons] || 'fas fa-exclamation-triangle';
  };

  return (
    <motion.div
      className="floating-card p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <i className="fas fa-radar text-xl text-white"></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">Live Threat Radar</h3>
            <p className="text-sm text-muted-foreground">Real-time safety alerts</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshThreats}
          disabled={isLoading}
          className="text-muted-foreground hover:text-foreground"
        >
          <i className={`fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}`}></i>
        </Button>
      </div>

      {/* Threat Count */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-800">{nearbyThreats.length}</p>
          <p className="text-xs text-gray-600">Active Alerts</p>
        </div>
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-2xl font-bold text-red-600">
            {nearbyThreats.filter(t => t.severity === 'high' || t.severity === 'critical').length}
          </p>
          <p className="text-xs text-red-600">High Priority</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">
            {nearbyThreats.filter(t => t.isVerified).length}
          </p>
          <p className="text-xs text-green-600">Verified</p>
        </div>
      </div>

      {/* Recent Threats */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-800">Nearby Threats</h4>
        {nearbyThreats.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {nearbyThreats.slice(0, 5).map((threat, index) => (
              <motion.div
                key={threat.id}
                className="border border-gray-200 rounded-lg p-3 space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-2">
                    <i className={`${getSourceIcon(threat.source)} text-gray-600 mt-1`}></i>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{threat.type.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-600">{threat.location}</p>
                      {threat.distance && (
                        <p className="text-xs text-blue-600">{threat.distance.toFixed(1)}km away</p>
                      )}
                    </div>
                  </div>
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity}
                  </Badge>
                </div>
                
                <p className="text-xs text-gray-700">{threat.description}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">
                      {new Date(threat.createdAt).toLocaleTimeString()}
                    </span>
                    {threat.isVerified && (
                      <span className="text-green-600 flex items-center">
                        <i className="fas fa-check-circle mr-1"></i>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmThreat(threat.id, 'still_active')}
                      className="h-6 px-2 text-xs text-orange-600 hover:text-orange-800"
                    >
                      Still Active
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmThreat(threat.id, 'safe_now')}
                      className="h-6 px-2 text-xs text-green-600 hover:text-green-800"
                    >
                      Safe Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-shield-alt text-4xl text-green-500 mb-3"></i>
            <p className="text-green-600 font-medium">No active threats nearby</p>
            <p className="text-sm text-gray-500">Your area appears safe</p>
          </div>
        )}
      </div>

      {/* Safety Mood */}
      <div className="pt-4 border-t">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Area Safety Mood</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600 font-medium">Generally Safe</span>
          </div>
        </div>
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    </motion.div>
  );
}