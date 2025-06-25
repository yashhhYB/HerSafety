import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLocation } from '@/hooks/useLocation';
import { SAFE_ZONE_TYPES } from '@/lib/constants';
import type { SafeZone } from '@shared/schema';

export function Map() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { location } = useLocation();

  const { data: safeZones = [] } = useQuery<SafeZone[]>({
    queryKey: ['/api/safe-zones'],
  });

  const filteredZones = selectedFilter === 'all' 
    ? safeZones 
    : safeZones.filter(zone => zone.type === selectedFilter);

  const getZoneIcon = (type: string) => {
    const zoneType = SAFE_ZONE_TYPES.find(t => t.value === type);
    return zoneType?.icon || 'map-marker-alt';
  };

  const getZoneColor = (type: string) => {
    const colors = {
      police: 'bg-blue-500',
      hospital: 'bg-green-500',
      ngo: 'bg-purple-500',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="screen active">
      <div className="bg-primary text-white px-6 py-6">
        <div className="flex items-center justify-between">
          <motion.h1 
            className="text-xl font-bold"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Safe Zones Near You
          </motion.h1>
          <motion.button 
            className="bg-white bg-opacity-20 rounded-full p-2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <i className="fas fa-filter text-sm"></i>
          </motion.button>
        </div>
      </div>

      {/* Map Container */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Simulated Map Background */}
        <div className="h-96 bg-gray-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
          
          {/* Street patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-0 w-full h-1 bg-gray-300"></div>
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300"></div>
            <div className="absolute top-3/4 left-0 w-full h-1 bg-gray-300"></div>
            <div className="absolute left-1/4 top-0 w-1 h-full bg-gray-300"></div>
            <div className="absolute left-1/2 top-0 w-1 h-full bg-gray-300"></div>
            <div className="absolute left-3/4 top-0 w-1 h-full bg-gray-300"></div>
          </div>
          
          {/* User Location (Center) */}
          <motion.div 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="w-6 h-6 bg-accent rounded-full border-4 border-white shadow-lg"></div>
            <motion.div 
              className="absolute inset-0 bg-accent rounded-full opacity-30"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          {/* Safe Zone Markers */}
          {filteredZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              className={`absolute w-8 h-8 ${getZoneColor(zone.type)} rounded-full flex items-center justify-center shadow-lg cursor-pointer`}
              style={{
                top: `${30 + (index * 15) % 40}%`,
                left: `${25 + (index * 20) % 50}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.2 }}
            >
              <i className={`fas fa-${getZoneIcon(zone.type)} text-white text-xs`}></i>
            </motion.div>
          ))}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 space-y-2">
          <Button size="sm" variant="outline" className="w-10 h-10 p-0">
            <i className="fas fa-crosshairs text-gray-700"></i>
          </Button>
          <Button size="sm" variant="outline" className="w-10 h-10 p-0">
            <i className="fas fa-plus text-gray-700"></i>
          </Button>
          <Button size="sm" variant="outline" className="w-10 h-10 p-0">
            <i className="fas fa-minus text-gray-700"></i>
          </Button>
        </div>
      </motion.div>

      {/* Location Filter */}
      <motion.div 
        className="px-6 py-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex space-x-3 overflow-x-auto">
          <Button
            size="sm"
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {SAFE_ZONE_TYPES.map((type) => (
            <Button
              key={type.value}
              size="sm"
              variant={selectedFilter === type.value ? 'default' : 'outline'}
              onClick={() => setSelectedFilter(type.value)}
              className="whitespace-nowrap"
            >
              <i className={`fas fa-${type.icon} mr-1`}></i>
              {type.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Nearby Locations List */}
      <motion.div 
        className="px-6 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <h3 className="font-semibold text-gray-800 mb-4">Nearby Safe Zones</h3>
        <div className="space-y-3">
          {filteredZones.map((zone, index) => (
            <motion.div
              key={zone.id}
              className="bg-white rounded-lg p-4 shadow-sm border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 ${getZoneColor(zone.type).replace('bg-', 'bg-opacity-20 bg-')} rounded-full flex items-center justify-center`}>
                    <i className={`fas fa-${getZoneIcon(zone.type)} ${getZoneColor(zone.type).replace('bg-', 'text-')}`}></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{zone.name}</h4>
                    <p className="text-xs text-gray-600">24/7 • {Math.random() * 2 + 0.5}km away</p>
                    <p className="text-xs text-gray-500 mt-1">{zone.address}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-primary">
                  Directions
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
