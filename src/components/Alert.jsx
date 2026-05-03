import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Alert({ type = 'info', message, onClose }) {
  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  const iconColor = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconColor[type]}`} size={20} />;
      case 'error':
        return <AlertCircle className={`${iconColor[type]}`} size={20} />;
      case 'warning':
        return <AlertCircle className={`${iconColor[type]}`} size={20} />;
      default:
        return <Info className={`${iconColor[type]}`} size={20} />;
    }
  };

  return (
    <div className={`${bgColors[type]} border rounded-xl p-4 flex items-start gap-3 mb-4 shadow-sm`}>
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="flex-1">
        <p className={`${textColors[type]} text-sm font-medium`}>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
