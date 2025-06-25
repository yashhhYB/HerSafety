import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { StatusBar } from '@/components/StatusBar';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Home } from '@/pages/Home';
import { Map } from '@/pages/Map';
import { SOS } from '@/pages/SOS';
import { Guardian } from '@/pages/Guardian';
import { Learn } from '@/pages/Learn';
import { Settings } from '@/pages/Settings';
import { useTouch } from '@/hooks/useTouch';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  useTouch(); // Initialize touch handling

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home onNavigate={setActiveTab} />;
      case 'map':
        return <Map />;
      case 'sos':
        return <SOS />;
      case 'guardian':
        return <Guardian />;
      case 'learn':
        return <Learn />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={setActiveTab} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container">
          <StatusBar />
          <div id="app-content">
            {renderActiveScreen()}
          </div>
          <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
