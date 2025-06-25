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
      <span>{time}</span>
      <span className="font-semibold">{title}</span>
      <div className="flex items-center space-x-1">
        <i className="fas fa-signal text-xs"></i>
        <i className="fas fa-wifi text-xs"></i>
        <i className="fas fa-battery-three-quarters text-xs"></i>
      </div>
    </div>
  );
}
