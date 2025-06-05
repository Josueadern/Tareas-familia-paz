import React, { useState } from 'react';
import { XMarkIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { verificarPin, mostrarNotificacion } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [intentos, setIntentos] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setError('El PIN debe tener al menos 4 caracteres');
      return;
    }

    if (verificarPin(pin)) {
      onSuccess();
      setPin('');
      setError('');
      setIntentos(0);
      mostrarNotificacion({
        tipo: 'success',
        titulo: 'Acceso concedido',
        mensaje: 'Bienvenido al modo administrador'
      });
    } else {
      setIntentos(prev => prev + 1);
      setError('PIN incorrecto');
      setPin('');
      
      if (intentos >= 2) {
        mostrarNotificacion({
          tipo: 'error',
          titulo: 'Demasiados intentos',
          mensaje: 'Has fallado 3 veces. Inténtalo más tarde.'
        });
        onClose();
        setTimeout(() => setIntentos(0), 30000); // Reset intentos después de 30 segundos
      }
    }
  };

  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <LockClosedIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Acceso Administrador</h2>
              <p className="text-sm text-gray-500">Introduce tu PIN para continuar</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700 mb-2">
              PIN de Administrador
            </label>
            <input
              type="password"
              id="pin"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
              placeholder="••••"
              maxLength={20}
              autoFocus
              disabled={intentos >= 3}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span>
                {error}
              </p>
            )}
            {intentos > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Intentos restantes: {3 - intentos}
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!pin || intentos >= 3}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Acceder
            </button>
          </div>

          {/* Hint para desarrollo */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Desarrollo:</strong> PIN por defecto es "123Maria"
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
