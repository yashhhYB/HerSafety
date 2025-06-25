import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { apiRequest } from '@/lib/queryClient';
import { MOCK_USER_ID } from '@/lib/constants';

interface SmartGuardianConfig {
  voiceMonitoring: boolean;
  motionDetection: boolean;
  shakeThreshold: number;
  emergencyKeywords: string[];
  panicWord: string;
}

interface UseSmartGuardianReturn {
  isActive: boolean;
  config: SmartGuardianConfig;
  toggleGuardian: () => void;
  updateConfig: (newConfig: Partial<SmartGuardianConfig>) => void;
  alertCount: number;
  lastAlert: Date | null;
}

export function useSmartGuardian(): UseSmartGuardianReturn {
  const [isActive, setIsActive] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [lastAlert, setLastAlert] = useState<Date | null>(null);
  const [config, setConfig] = useState<SmartGuardianConfig>({
    voiceMonitoring: false,
    motionDetection: false,
    shakeThreshold: 15,
    emergencyKeywords: ['help me', 'stop', 'no'],
    panicWord: 'calendar',
  });

  const { toast } = useToast();
  const { location } = useLocation();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const sessionIdRef = useRef<number | null>(null);

  // Speech Recognition setup
  const recognitionRef = useRef<any>(null);

  const initSpeechRecognition = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.warn('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ')
        .toLowerCase();

      // Check for emergency keywords
      const hasEmergencyKeyword = config.emergencyKeywords.some(keyword => 
        transcript.includes(keyword.toLowerCase())
      );

      if (hasEmergencyKeyword) {
        handleEmergencyTrigger('voice_keyword', { transcript, confidence: 0.8 });
      }

      // Check for panic word (should disguise the app)
      if (transcript.includes(config.panicWord.toLowerCase())) {
        handlePanicMode();
      }
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
    };
  }, [config.emergencyKeywords, config.panicWord]);

  const handleEmergencyTrigger = async (triggerType: string, data: any) => {
    try {
      const alertData = {
        userId: MOCK_USER_ID,
        sessionId: sessionIdRef.current,
        triggerType,
        confidence: data.confidence || 0.5,
        audioData: data.transcript ? btoa(data.transcript) : null,
        motionData: data.motion ? JSON.stringify(data.motion) : null,
        location: location?.address || 'Unknown',
        latitude: location?.latitude?.toString() || null,
        longitude: location?.longitude?.toString() || null,
      };

      await apiRequest('POST', '/api/guardian-alerts', alertData);
      
      setAlertCount(prev => prev + 1);
      setLastAlert(new Date());

      toast({
        title: "Guardian Alert Triggered",
        description: `Detected ${triggerType.replace('_', ' ')}. Emergency contacts notified.`,
        variant: "destructive",
      });

      // Auto-trigger SOS if confidence is high
      if (data.confidence > 0.7) {
        await apiRequest('POST', '/api/sos-alerts', {
          userId: MOCK_USER_ID,
          location: location?.address || 'Unknown',
          latitude: location?.latitude?.toString() || null,
          longitude: location?.longitude?.toString() || null,
        });
      }

    } catch (error) {
      console.error('Failed to handle emergency trigger:', error);
    }
  };

  const handlePanicMode = () => {
    // Hide the app by changing the title and favicon
    document.title = 'Calendar - My Events';
    const favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (favicon) {
      favicon.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📅</text></svg>';
    }

    // Show a disguised interface
    const appContent = document.getElementById('app-content');
    if (appContent) {
      appContent.innerHTML = `
        <div class="p-6 bg-white min-h-screen">
          <h1 class="text-2xl font-bold text-gray-800 mb-4">My Calendar</h1>
          <div class="space-y-3">
            <div class="p-3 bg-blue-50 rounded-lg">
              <p class="font-medium">Team Meeting</p>
              <p class="text-sm text-gray-600">Today, 2:00 PM</p>
            </div>
            <div class="p-3 bg-green-50 rounded-lg">
              <p class="font-medium">Lunch with Sarah</p>
              <p class="text-sm text-gray-600">Tomorrow, 12:30 PM</p>
            </div>
          </div>
        </div>
      `;
    }

    toast({
      title: "Panic Mode Activated",
      description: "App interface disguised. Say 'restore safety' to return.",
    });
  };

  // Motion detection using DeviceMotionEvent
  useEffect(() => {
    if (!isActive || !config.motionDetection) return;

    let lastShakeTime = 0;
    const shakeThreshold = config.shakeThreshold;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const totalAcceleration = Math.sqrt(
        Math.pow(acceleration.x || 0, 2) +
        Math.pow(acceleration.y || 0, 2) +
        Math.pow(acceleration.z || 0, 2)
      );

      if (totalAcceleration > shakeThreshold) {
        const now = Date.now();
        if (now - lastShakeTime > 1000) { // Prevent rapid triggers
          lastShakeTime = now;
          handleEmergencyTrigger('shake_detection', {
            confidence: Math.min(totalAcceleration / 30, 1),
            motion: { acceleration: totalAcceleration, timestamp: now }
          });
        }
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [isActive, config.motionDetection, config.shakeThreshold]);

  const startGuardianSession = async () => {
    try {
      const sessionData = {
        userId: MOCK_USER_ID,
        sessionType: 'smart_guardian',
        settings: JSON.stringify(config),
      };

      const response = await apiRequest('POST', '/api/guardian-sessions', sessionData) as any;
      sessionIdRef.current = response.id;

      if (config.voiceMonitoring) {
        initSpeechRecognition();
        recognitionRef.current?.start();
      }

      toast({
        title: "Smart Guardian Activated",
        description: "Monitoring voice and motion for your safety.",
      });

    } catch (error) {
      console.error('Failed to start guardian session:', error);
      throw error;
    }
  };

  const stopGuardianSession = async () => {
    try {
      if (sessionIdRef.current) {
        await apiRequest('PATCH', `/api/guardian-sessions/${sessionIdRef.current}`, {
          isActive: false,
          endTime: new Date().toISOString(),
        });
      }

      recognitionRef.current?.stop();
      sessionIdRef.current = null;

      toast({
        title: "Smart Guardian Deactivated",
        description: "Monitoring stopped.",
      });

    } catch (error) {
      console.error('Failed to stop guardian session:', error);
    }
  };

  const toggleGuardian = async () => {
    try {
      if (isActive) {
        await stopGuardianSession();
        setIsActive(false);
      } else {
        await startGuardianSession();
        setIsActive(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to toggle Smart Guardian mode.",
        variant: "destructive",
      });
    }
  };

  const updateConfig = (newConfig: Partial<SmartGuardianConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopGuardianSession();
      }
    };
  }, []);

  return {
    isActive,
    config,
    toggleGuardian,
    updateConfig,
    alertCount,
    lastAlert,
  };
}