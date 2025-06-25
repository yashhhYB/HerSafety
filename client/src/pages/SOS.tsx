import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from '@/hooks/useLocation';
import { apiRequest } from '@/lib/queryClient';
import { MOCK_USER_ID } from '@/lib/constants';
import type { EmergencyContact } from '@shared/schema';

export function SOS() {
  const [isPressed, setIsPressed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { location } = useLocation();
  const { toast } = useToast();

  const { data: contacts = [] } = useQuery<EmergencyContact[]>({
    queryKey: [`/api/emergency-contacts/${MOCK_USER_ID}`],
  });

  const handleSOSPress = async () => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Please enable location access to send SOS alert.",
        variant: "destructive",
      });
      return;
    }

    try {
      await apiRequest('POST', '/api/sos-alerts', {
        userId: MOCK_USER_ID,
        location: location.address || `${location.latitude}, ${location.longitude}`,
        latitude: location.latitude.toString(),
        longitude: location.longitude.toString(),
      });

      setShowConfirmation(true);
      toast({
        title: "SOS Alert Sent",
        description: "Emergency contacts have been notified with your location.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SOS alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  const mockContacts = contacts.length > 0 ? contacts : [
    { id: 1, userId: MOCK_USER_ID, name: 'Mom', phone: '+91 98765 43210', relationship: 'Mother', isPrimary: true },
    { id: 2, userId: MOCK_USER_ID, name: 'Sarah (Best Friend)', phone: '+91 87654 32109', relationship: 'Friend', isPrimary: false },
  ];

  return (
    <div className="screen active">
      <div className="gradient-accent text-white px-6 py-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ 
              scale: isPressed ? 1.1 : 1,
              opacity: isPressed ? 0.8 : 1 
            }}
            transition={{ duration: 0.1 }}
          >
            <i className="fas fa-exclamation-triangle text-3xl"></i>
          </motion.div>
          <h1 className="text-3xl font-bold mb-2">Need Help Now?</h1>
          <p className="text-red-100">Press the button below to alert emergency contacts</p>
        </motion.div>
      </div>

      <div className="px-6 py-12 text-center">
        {/* SOS Button */}
        <motion.div 
          className="relative mb-12"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            className="w-48 h-48 gradient-accent rounded-full shadow-2xl flex items-center justify-center mx-auto relative overflow-hidden"
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            onClick={handleSOSPress}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-white text-center">
              <i className="fas fa-hand-paper text-4xl mb-3"></i>
              <p className="font-bold text-xl">SOS</p>
              <p className="text-sm opacity-90">Tap to Alert</p>
            </div>
            <motion.div 
              className="absolute inset-0 bg-white bg-opacity-10 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div 
          className="bg-gray-50 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center justify-center">
            <i className="fas fa-users text-primary mr-2"></i>
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {mockContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                className="flex items-center justify-between bg-white rounded-lg p-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-white text-sm"></i>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Voice Trigger */}
        <motion.div 
          className="mt-6 bg-blue-50 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-sm text-gray-700">
            <i className="fas fa-microphone text-blue-500 mr-2"></i>
            You can also say <strong>"Help me"</strong> to trigger SOS
          </p>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 mx-4 text-center max-w-sm"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Alert Sent Successfully</h3>
            <p className="text-gray-600 mb-6">Your emergency contacts have been notified with your current location. Stay calm, help is on the way.</p>
            <Button 
              onClick={() => setShowConfirmation(false)}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Okay
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
