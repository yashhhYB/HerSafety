import { motion } from 'framer-motion';

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  onClick: () => void;
}

export function ActionCard({ title, subtitle, icon, gradient, onClick }: ActionCardProps) {
  return (
    <motion.div
      className={`action-card text-white ${gradient}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
        <h3 className="font-semibold text-sm">{title}</h3>
        <p className="text-xs opacity-90 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
}
