import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSafeRoute } from '@/hooks/useSafeRoute';

export function SafeRouteWidget() {
  const [destination, setDestination] = useState('');
  const { isLoading, routes, recommendedRoute, calculateSafeRoute } = useSafeRoute();

  const handleCalculateRoute = () => {
    if (!destination.trim()) return;
    
    // Mock destination coordinates (in real app, would geocode the address)
    const mockDestination = {
      latitude: 18.5204 + Math.random() * 0.01,
      longitude: 73.8567 + Math.random() * 0.01,
      address: destination,
    };
    
    calculateSafeRoute(mockDestination);
  };

  const getSafetyColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSafetyBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <motion.div
      className="floating-card p-6 space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center">
          <i className="fas fa-route text-xl text-white"></i>
        </div>
        <div>
          <h3 className="font-bold text-lg">SafeRoute Navigator</h3>
          <p className="text-sm text-muted-foreground">AI-powered safe route planning</p>
        </div>
      </div>

      {/* Route Input */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCalculateRoute()}
            className="flex-1"
          />
          <Button
            onClick={handleCalculateRoute}
            disabled={!destination.trim() || isLoading}
            className="btn-gradient"
          >
            {isLoading ? (
              <i className="fas fa-spinner animate-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          className="text-center py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fas fa-brain text-blue-600 animate-pulse"></i>
          </div>
          <p className="text-sm text-gray-600">Analyzing safety data...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      )}

      {/* Recommended Route */}
      {recommendedRoute && !isLoading && (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-green-800">Recommended Route</h4>
              <Badge className={getSafetyBadgeColor(recommendedRoute.safetyScore.overall)}>
                {recommendedRoute.safetyScore.overall}% Safe
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="text-center">
                <p className="text-lg font-bold text-green-800">
                  {recommendedRoute.distance.toFixed(1)} km
                </p>
                <p className="text-xs text-green-600">Distance</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-green-800">
                  {Math.round(recommendedRoute.duration)} min
                </p>
                <p className="text-xs text-green-600">Duration</p>
              </div>
            </div>

            {/* Safety Breakdown */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-800">Safety Breakdown</h5>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Lighting:</span>
                  <span className={getSafetyColor(recommendedRoute.safetyScore.lighting)}>
                    {recommendedRoute.safetyScore.lighting}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Crime Rate:</span>
                  <span className={getSafetyColor(recommendedRoute.safetyScore.crimeRate)}>
                    {recommendedRoute.safetyScore.crimeRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Police:</span>
                  <span className={getSafetyColor(recommendedRoute.safetyScore.policeProximity)}>
                    {recommendedRoute.safetyScore.policeProximity}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Community:</span>
                  <span className={getSafetyColor(recommendedRoute.safetyScore.communityFeedback)}>
                    {recommendedRoute.safetyScore.communityFeedback}%
                  </span>
                </div>
              </div>
            </div>

            {/* Warnings */}
            {recommendedRoute.warnings.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <h5 className="text-sm font-medium text-orange-800 mb-2">⚠️ Precautions</h5>
                <ul className="space-y-1">
                  {recommendedRoute.warnings.map((warning, index) => (
                    <li key={index} className="text-xs text-orange-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Community Tags */}
            {recommendedRoute.crowdTags.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <h5 className="text-sm font-medium text-gray-800 mb-2">Community Tags</h5>
                <div className="flex flex-wrap gap-1">
                  {recommendedRoute.crowdTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Button className="w-full mt-4 btn-gradient">
              <i className="fas fa-directions mr-2"></i>
              Start Navigation
            </Button>
          </div>

          {/* Alternative Routes */}
          {routes.length > 1 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Alternative Routes</h4>
              {routes.slice(1).map((route, index) => (
                <motion.div
                  key={route.id}
                  className="border border-gray-200 rounded-lg p-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Route {index + 2}</p>
                      <p className="text-xs text-gray-600">
                        {route.distance.toFixed(1)} km • {Math.round(route.duration)} min
                      </p>
                    </div>
                    <Badge className={getSafetyBadgeColor(route.safetyScore.overall)}>
                      {route.safetyScore.overall}%
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Quick Destinations */}
      {!isLoading && routes.length === 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-800">Quick Destinations</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {['Home', 'Work', 'Hospital', 'Police Station'].map((dest) => (
              <Button
                key={dest}
                variant="outline"
                size="sm"
                onClick={() => setDestination(dest)}
                className="text-xs touch-manipulation"
              >
                <i className="fas fa-map-marker-alt mr-1"></i>
                {dest}
              </Button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}