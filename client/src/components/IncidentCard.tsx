import { motion } from 'framer-motion';

interface IncidentCardProps {
  type: string;
  location: string;
  timeAgo: string;
  priority: 'high' | 'medium' | 'low';
  distance?: string;
}

export function IncidentCard({ type, location, timeAgo, priority, distance }: IncidentCardProps) {
  const priorityColors = {
    high: 'bg-red-50 border-red-500',
    medium: 'bg-yellow-50 border-yellow-500',
    low: 'bg-blue-50 border-blue-500',
  };

  const priorityBadgeColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-blue-100 text-blue-800',
  };

  return (
    <motion.div
      className={`${priorityColors[priority]} border-l-4 rounded-lg p-4`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{type} at {location}</p>
          <p className="text-xs text-gray-600 mt-1">
            {timeAgo}{distance && ` • ${distance} away`}
          </p>
        </div>
        <span className={`${priorityBadgeColors[priority]} text-xs px-2 py-1 rounded-full capitalize`}>
          {priority}
        </span>
      </div>
    </motion.div>
  );
}
