import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from '@/hooks/useLocation';

interface LiveThreat {
  id: number;
  source: string;
  type: string;
  description: string;
  location: string;
  latitude: string;
  longitude: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  isVerified: boolean;
  verificationCount: number;
  createdAt: Date;
  distance?: number;
}

interface UseLiveThreatRadarReturn {
  threats: LiveThreat[];
  nearbyThreats: LiveThreat[];
  isLoading: boolean;
  error: string | null;
  refreshThreats: () => void;
  confirmThreat: (threatId: number, confirmationType: string, notes?: string) => Promise<void>;
}

export function useLiveThreatRadar(): UseLiveThreatRadarReturn {
  const [threats, setThreats] = useState<LiveThreat[]>([]);
  const { location } = useLocation();

  // Query live threats
  const { data: threatData = [], isLoading, error, refetch } = useQuery<LiveThreat[]>({
    queryKey: ['/api/live-threats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Calculate distance between two coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Process threats with distance calculations
  useEffect(() => {
    if (threatData && location) {
      const threatsWithDistance = threatData.map(threat => ({
        ...threat,
        distance: calculateDistance(
          location.latitude,
          location.longitude,
          parseFloat(threat.latitude),
          parseFloat(threat.longitude)
        )
      }));
      setThreats(threatsWithDistance);
    } else {
      setThreats(threatData);
    }
  }, [threatData, location]);

  // Filter nearby threats (within 5km)
  const nearbyThreats = threats.filter(threat => 
    threat.distance !== undefined && threat.distance <= 5
  );

  // Mock threat simulation for demonstration
  useEffect(() => {
    const simulateThreats = () => {
      if (!location) return;

      const mockThreats: Partial<LiveThreat>[] = [
        {
          id: Date.now(),
          source: 'police_feed',
          type: 'harassment',
          description: 'Reported harassment incident at FC Road bus stop',
          location: 'FC Road, Pune',
          latitude: (location.latitude + 0.001).toString(),
          longitude: (location.longitude + 0.001).toString(),
          severity: 'medium',
          confidence: 0.85,
          isVerified: false,
          verificationCount: 0,
          createdAt: new Date(),
        },
        {
          id: Date.now() + 1,
          source: 'community',
          type: 'unsafe_area',
          description: 'Poor lighting and suspicious activity reported',
          location: 'Koregaon Park, Pune',
          latitude: (location.latitude + 0.003).toString(),
          longitude: (location.longitude - 0.002).toString(),
          severity: 'low',
          confidence: 0.6,
          isVerified: true,
          verificationCount: 3,
          createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        }
      ];

      // Simulate adding threats occasionally
      if (Math.random() > 0.7) {
        setThreats(prev => [...prev, ...mockThreats as LiveThreat[]]);
      }
    };

    const interval = setInterval(simulateThreats, 60000); // Every minute
    return () => clearInterval(interval);
  }, [location]);

  const confirmThreat = async (threatId: number, confirmationType: string, notes?: string) => {
    try {
      // In a real implementation, this would make an API call
      console.log('Confirming threat:', { threatId, confirmationType, notes });
      
      // Update local state to reflect confirmation
      setThreats(prev => prev.map(threat => 
        threat.id === threatId 
          ? { 
              ...threat, 
              verificationCount: threat.verificationCount + 1,
              isVerified: confirmationType !== 'false_alarm'
            }
          : threat
      ));
    } catch (error) {
      console.error('Failed to confirm threat:', error);
      throw error;
    }
  };

  const refreshThreats = () => {
    refetch();
  };

  return {
    threats,
    nearbyThreats,
    isLoading,
    error: error ? 'Failed to load threat data' : null,
    refreshThreats,
    confirmThreat,
  };
}