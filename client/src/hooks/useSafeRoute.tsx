import { useState, useCallback } from 'react';
import { useLocation } from '@/hooks/useLocation';

interface RoutePoint {
  latitude: number;
  longitude: number;
  address?: string;
}

interface SafetyScore {
  overall: number;
  lighting: number;
  crimeRate: number;
  policeProximity: number;
  communityFeedback: number;
}

interface RouteOption {
  id: string;
  points: RoutePoint[];
  distance: number;
  duration: number;
  safetyScore: SafetyScore;
  warnings: string[];
  crowdTags: string[];
}

interface UseSafeRouteReturn {
  isLoading: boolean;
  routes: RouteOption[];
  recommendedRoute: RouteOption | null;
  calculateSafeRoute: (destination: RoutePoint) => Promise<void>;
  tagRouteSegment: (routeId: string, segmentIndex: number, tags: string[]) => Promise<void>;
}

export function useSafeRoute(): UseSafeRouteReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const { location } = useLocation();

  const calculateSafetyScore = (route: RoutePoint[]): SafetyScore => {
    // Mock safety calculation - in real implementation, this would use:
    // - Crime statistics API
    // - Police station proximity
    // - Street lighting data
    // - Community feedback
    
    const baseScore = Math.random() * 40 + 30; // 30-70 base
    const lightingBonus = Math.random() * 20; // 0-20 lighting
    const crimeDeduction = Math.random() * 15; // 0-15 crime rate
    const policeBonus = Math.random() * 15; // 0-15 police proximity
    const communityBonus = Math.random() * 10; // 0-10 community feedback

    const overall = Math.min(100, Math.max(0, 
      baseScore + lightingBonus - crimeDeduction + policeBonus + communityBonus
    ));

    return {
      overall: Math.round(overall),
      lighting: Math.round(60 + lightingBonus),
      crimeRate: Math.round(80 - crimeDeduction),
      policeProximity: Math.round(50 + policeBonus),
      communityFeedback: Math.round(70 + communityBonus),
    };
  };

  const generateMockRoutes = (destination: RoutePoint): RouteOption[] => {
    if (!location) return [];

    const routes: RouteOption[] = [];
    
    // Generate 2-3 route options
    for (let i = 0; i < 3; i++) {
      const points: RoutePoint[] = [
        { latitude: location.latitude, longitude: location.longitude },
        // Add intermediate points with slight variations
        {
          latitude: location.latitude + (destination.latitude - location.latitude) * 0.3 + (Math.random() - 0.5) * 0.01,
          longitude: location.longitude + (destination.longitude - location.longitude) * 0.3 + (Math.random() - 0.5) * 0.01,
        },
        {
          latitude: location.latitude + (destination.latitude - location.latitude) * 0.7 + (Math.random() - 0.5) * 0.01,
          longitude: location.longitude + (destination.longitude - location.longitude) * 0.7 + (Math.random() - 0.5) * 0.01,
        },
        destination,
      ];

      const safetyScore = calculateSafetyScore(points);
      const distance = Math.random() * 2 + 1; // 1-3 km
      const duration = distance * 12 + Math.random() * 10; // ~12 min/km + variation

      let warnings: string[] = [];
      let crowdTags: string[] = [];

      if (safetyScore.lighting < 50) {
        warnings.push('Poor lighting in some areas');
        crowdTags.push('poorly_lit');
      }
      if (safetyScore.crimeRate < 60) {
        warnings.push('Higher crime rate area');
        crowdTags.push('avoid_night');
      }
      if (safetyScore.policeProximity < 40) {
        warnings.push('Limited police presence');
      } else {
        crowdTags.push('police_patrol');
      }

      if (safetyScore.overall > 75) {
        crowdTags.push('safe', 'recommended');
      } else if (safetyScore.overall < 50) {
        crowdTags.push('unsafe');
      }

      routes.push({
        id: `route_${i + 1}`,
        points,
        distance,
        duration,
        safetyScore,
        warnings,
        crowdTags,
      });
    }

    return routes.sort((a, b) => b.safetyScore.overall - a.safetyScore.overall);
  };

  const calculateSafeRoute = useCallback(async (destination: RoutePoint) => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const calculatedRoutes = generateMockRoutes(destination);
      setRoutes(calculatedRoutes);
      
    } catch (error) {
      console.error('Failed to calculate safe route:', error);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  }, [location]);

  const tagRouteSegment = useCallback(async (routeId: string, segmentIndex: number, tags: string[]) => {
    try {
      // In real implementation, this would send data to backend
      console.log('Tagging route segment:', { routeId, segmentIndex, tags });
      
      // Update local route data
      setRoutes(prev => prev.map(route => {
        if (route.id === routeId) {
          const combinedTags = [...route.crowdTags, ...tags];
          const newTags = Array.from(new Set(combinedTags));
          return { ...route, crowdTags: newTags };
        }
        return route;
      }));
      
    } catch (error) {
      console.error('Failed to tag route segment:', error);
      throw error;
    }
  }, []);

  const recommendedRoute = routes.length > 0 ? routes[0] : null;

  return {
    isLoading,
    routes,
    recommendedRoute,
    calculateSafeRoute,
    tagRouteSegment,
  };
}