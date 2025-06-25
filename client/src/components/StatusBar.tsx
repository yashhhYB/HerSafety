interface StatusBarProps {
  title?: string;
}

export function StatusBar({ title = "Sefty1st" }: StatusBarProps) {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="status-bar">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">{time}</span>
        <div className="flex items-center space-x-1">
          <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs">Live</span>
        </div>
      </div>
      <span className="font-bold text-white">{title}</span>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <i className="fas fa-signal text-xs opacity-90"></i>
          <i className="fas fa-wifi text-xs opacity-90"></i>
          <i className="fas fa-battery-three-quarters text-xs opacity-90"></i>
        </div>
        <div className="text-xs">100%</div>
      </div>
    </div>
  );
}
