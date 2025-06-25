import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { EMERGENCY_NUMBERS } from '@/lib/constants';

export function Learn() {
  const [openAccordion, setOpenAccordion] = useState<string>('');

  const educationContent = [
    {
      id: 'consent',
      title: 'Understanding Consent',
      icon: 'handshake',
      color: 'bg-purple-100 text-purple-600',
      content: `Consent is a clear, voluntary agreement to engage in specific activities. Learn about the importance of ongoing consent, how to recognize when it's absent, and how to communicate boundaries effectively. Remember that consent can be withdrawn at any time, and silence does not mean consent.`,
      tag: 'Essential',
      tagColor: 'bg-purple-100 text-purple-800',
      readTime: '5 min read',
    },
    {
      id: 'legal',
      title: 'Legal Rights in India',
      icon: 'balance-scale',
      color: 'bg-blue-100 text-blue-600',
      content: `Know your rights under Indian law including the Criminal Law Amendment Act 2013, workplace harassment laws (POSH Act), and legal remedies available. Understanding your rights empowers you to take action. Key rights include the right to file complaints, protection from harassment, and access to legal aid.`,
      tag: 'Legal',
      tagColor: 'bg-blue-100 text-blue-800',
      readTime: '8 min read',
    },
    {
      id: 'emergency',
      title: 'Emergency Response',
      icon: 'shield-alt',
      color: 'bg-red-100 text-red-600',
      content: `Learn essential self-defense techniques, how to de-escalate dangerous situations, and create safety plans. Practice breathing techniques to stay calm during emergencies. Key strategies include situational awareness, trusting your instincts, and having multiple exit strategies.`,
      tag: 'Critical',
      tagColor: 'bg-red-100 text-red-800',
      readTime: '12 min read',
    },
    {
      id: 'support',
      title: 'Building Support Networks',
      icon: 'users',
      color: 'bg-green-100 text-green-600',
      content: `Create strong support systems with family, friends, and community. Learn how to identify trustworthy allies and communicate your needs effectively during difficult times. Building a support network includes maintaining regular check-ins and establishing code words for emergencies.`,
      tag: 'Support',
      tagColor: 'bg-green-100 text-green-800',
      readTime: '6 min read',
    },
  ];

  return (
    <div className="screen active">
      <div className="gradient-purple text-white px-6 py-8">
        <motion.h1 
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Safety Education Hub
        </motion.h1>
        <motion.p 
          className="text-purple-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Knowledge is your first line of defense
        </motion.p>
      </div>

      <div className="px-6 py-6 space-y-4">
        <Accordion type="single" collapsible value={openAccordion} onValueChange={setOpenAccordion}>
          {educationContent.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <AccordionItem value={item.id} className="border-0">
                <AccordionTrigger className="w-full bg-white rounded-lg p-4 flex items-center justify-between shadow-sm border hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center`}>
                      <i className={`fas fa-${item.icon}`}></i>
                    </div>
                    <span className="font-medium text-gray-800">{item.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <motion.div
                    className="bg-gray-50 rounded-b-lg p-4 border-t-0"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed mb-3">
                      {item.content}
                    </p>
                    <div className="flex space-x-2">
                      <span className={`${item.tagColor} text-xs px-2 py-1 rounded-full`}>
                        {item.tag}
                      </span>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {item.readTime}
                      </span>
                    </div>
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>

      {/* Emergency Numbers */}
      <motion.div 
        className="px-6 pb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="gradient-accent text-white rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Emergency Numbers</h3>
          <div className="grid grid-cols-2 gap-4">
            {EMERGENCY_NUMBERS.map((emergency, index) => (
              <motion.div
                key={emergency.number}
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              >
                <p className="text-2xl font-bold">{emergency.number}</p>
                <p className="text-xs text-red-100">{emergency.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
