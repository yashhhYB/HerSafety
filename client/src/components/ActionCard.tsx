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
      className={`action-card text-white ${gradient} relative overflow-hidden group`}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="text-center relative z-10">
        <motion.div 
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-white/30 transition-colors duration-300"
          whileHover={{ rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <i className={`fas fa-${icon} text-xl sm:text-2xl`}></i>
        </motion.div>
        <h3 className="font-bold text-sm sm:text-base mb-1">{title}</h3>
        <p className="text-xs sm:text-sm opacity-90">{subtitle}</p>
      </div>
      
      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-white/10 rounded-bl-2xl"></div>
    </motion.div>
  );
}
