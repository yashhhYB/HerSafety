import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { MOCK_USER_ID } from '@/lib/constants';
import type { EmergencyContact, UserSettings } from '@shared/schema';

export function Settings() {
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const { toast } = useToast();

  const { data: contacts = [] } = useQuery<EmergencyContact[]>({
    queryKey: [`/api/emergency-contacts/${MOCK_USER_ID}`],
  });

  const { data: settings } = useQuery<UserSettings>({
    queryKey: [`/api/user-settings/${MOCK_USER_ID}`],
  });

  const addContactMutation = useMutation({
    mutationFn: (contact: typeof newContact) =>
      apiRequest('POST', '/api/emergency-contacts', {
        ...contact,
        userId: MOCK_USER_ID,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/emergency-contacts/${MOCK_USER_ID}`] });
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: (settingsUpdate: Partial<UserSettings>) =>
      apiRequest('PUT', `/api/user-settings/${MOCK_USER_ID}`, settingsUpdate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user-settings/${MOCK_USER_ID}`] });
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    addContactMutation.mutate(newContact);
  };

  const handleSettingToggle = (key: keyof UserSettings, value: boolean) => {
    updateSettingsMutation.mutate({ [key]: value });
  };

  const mockContacts = contacts.length > 0 ? contacts : [
    { id: 1, userId: MOCK_USER_ID, name: 'Mom', phone: '+91 98765 43210', relationship: 'Mother', isPrimary: true },
    { id: 2, userId: MOCK_USER_ID, name: 'Sarah', phone: '+91 87654 32109', relationship: 'Friend', isPrimary: false },
  ];

  return (
    <div className="screen active">
      <div className="bg-primary text-white px-6 py-8">
        <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Settings
        </motion.h1>
        <motion.p 
          className="text-blue-100 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Customize your safety preferences
        </motion.p>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Emergency Contacts Section */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-users text-primary mr-2"></i>
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {mockContacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                className="flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user text-gray-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-gray-600">{contact.phone}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-accent">
                  Edit
                </Button>
              </motion.div>
            ))}
            
            {showAddContact ? (
              <motion.div
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter contact name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-relationship">Relationship</Label>
                  <Input
                    id="contact-relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Mother, Friend"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleAddContact}
                    disabled={!newContact.name || !newContact.phone || addContactMutation.isPending}
                    size="sm"
                    className="flex-1"
                  >
                    {addContactMutation.isPending ? 'Adding...' : 'Add Contact'}
                  </Button>
                  <Button
                    onClick={() => setShowAddContact(false)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            ) : (
              <button
                onClick={() => setShowAddContact(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>Add Contact
              </button>
            )}
          </div>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-shield-alt text-primary mr-2"></i>
            Privacy & Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Location Tracking</p>
                <p className="text-xs text-gray-600">Allow app to access your location</p>
              </div>
              <Switch
                checked={settings?.locationTracking ?? true}
                onCheckedChange={(checked) => handleSettingToggle('locationTracking', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Panic Mode</p>
                <p className="text-xs text-gray-600">Hide app when tapped</p>
              </div>
              <Switch
                checked={settings?.panicMode ?? false}
                onCheckedChange={(checked) => handleSettingToggle('panicMode', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* Preferences */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-cog text-primary mr-2"></i>
            Preferences
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Language</p>
                <p className="text-xs text-gray-600">English</p>
              </div>
              <Button size="sm" variant="ghost" className="text-accent">
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Dark Mode</p>
                <p className="text-xs text-gray-600">Enable dark theme</p>
              </div>
              <Switch
                checked={settings?.darkMode ?? false}
                onCheckedChange={(checked) => handleSettingToggle('darkMode', checked)}
              />
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-info-circle text-primary mr-2"></i>
            About
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Version</span>
              <span className="text-sm text-gray-600">1.0.0</span>
            </div>
            <button className="w-full text-left text-sm text-gray-700 py-2 hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button className="w-full text-left text-sm text-gray-700 py-2 hover:text-primary transition-colors">
              Terms of Service
            </button>
            <button className="w-full text-left text-sm text-gray-700 py-2 hover:text-primary transition-colors">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
