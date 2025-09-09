import React from 'react';
import { Button } from '../ui/button';
import RobotAvatar from './RobotAvatar';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ 
  isOpen, 
  onClose, 
  candidateName = 'Кандидат' 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <RobotAvatar size="lg" isActive={true} className="mx-auto mb-4" />
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Добро пожаловать!
        </h2>
        
        <p className="text-gray-600 mb-6">
          Напоминаем: к разговору подключится<br />
          искусственный интеллект.
        </p>
        
        <Button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
        >
          Присоединиться
        </Button>
      </div>
    </div>
  );
};

export default WelcomeModal;
