import React from 'react';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Спасибо!
        </h2>

        <p className="text-gray-600 mb-6">
          Ваши ответы записаны и зафиксированы
        </p>

        <Button
          onClick={onClose}
          className="w-full"
        >
          Закрыть
        </Button>
      </div>
    </div>
  );
};

export default CompletionModal;
