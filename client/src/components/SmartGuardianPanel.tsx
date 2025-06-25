import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useSmartGuardian } from '@/hooks/useSmartGuardian';

export function SmartGuardianPanel() {
  const {
    isActive,
    config,
    toggleGuardian,
    updateConfig,
    alertCount,
    lastAlert,
  } = useSmartGuardian();

  return (
    <motion.div
      className="floating-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-100'
          }`}>
            <i className={`fas fa-brain text-xl ${isActive ? 'text-white' : 'text-gray-600'}`}></i>
          </div>
          <div>
            <h3 className="font-bold text-lg">Smart Guardian</h3>
            <p className="text-sm text-muted-foreground">AI-powered safety monitoring</p>
          </div>
        </div>
        <Switch checked={isActive} onCheckedChange={toggleGuardian} />
      </div>

      {/* Status */}
      {isActive && (
        <motion.div
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Monitoring Active</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Alerts Today</p>
              <p className="font-bold text-blue-800">{alertCount}</p>
            </div>
            <div>
              <p className="text-blue-600">Last Alert</p>
              <p className="font-bold text-blue-800">
                {lastAlert ? lastAlert.toLocaleTimeString() : 'None'}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Configuration */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Configuration</h4>
        
        {/* Voice Monitoring */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Voice Monitoring</Label>
            <p className="text-xs text-muted-foreground">Detect emergency keywords</p>
          </div>
          <Switch
            checked={config.voiceMonitoring}
            onCheckedChange={(checked) => updateConfig({ voiceMonitoring: checked })}
          />
        </div>

        {/* Motion Detection */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="font-medium">Motion Detection</Label>
            <p className="text-xs text-muted-foreground">Detect sudden movements</p>
          </div>
          <Switch
            checked={config.motionDetection}
            onCheckedChange={(checked) => updateConfig({ motionDetection: checked })}
          />
        </div>

        {/* Shake Sensitivity */}
        {config.motionDetection && (
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Label className="font-medium">Shake Sensitivity</Label>
            <Slider
              value={[config.shakeThreshold]}
              onValueChange={([value]) => updateConfig({ shakeThreshold: value })}
              max={30}
              min={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Less Sensitive</span>
              <span>More Sensitive</span>
            </div>
          </motion.div>
        )}

        {/* Emergency Keywords */}
        <div className="space-y-2">
          <Label className="font-medium">Emergency Keywords</Label>
          <div className="flex flex-wrap gap-2">
            {config.emergencyKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        {/* Panic Word */}
        <div className="space-y-2">
          <Label className="font-medium">Panic Word</Label>
          <p className="text-xs text-muted-foreground">
            Say "<strong>{config.panicWord}</strong>" to disguise the app
          </p>
        </div>
      </div>

      {/* Test Features */}
      <div className="pt-4 border-t">
        <h4 className="font-semibold text-gray-800 mb-3">Test Features</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Voice test triggered!')}
            className="text-xs"
          >
            <i className="fas fa-microphone mr-1"></i>
            Test Voice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert('Motion test triggered!')}
            className="text-xs"
          >
            <i className="fas fa-mobile-alt mr-1"></i>
            Test Motion
          </Button>
        </div>
      </div>
    </motion.div>
  );
}