import React, { useState } from 'react';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface CambiarPinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CambiarPinModal: React.FC<CambiarPinModalProps> = ({ isOpen, onClose }) => {
  const { verificarPin, cambiarPin, mostrarNotificacion } = useApp();
  const [pinActual, setPinActual] = useState('');
  const [nuevoPin, setNuevoPin] = useState('');
  const [confirmarPin, setConfirmarPin] = useState('');
  const [errors, setErrors] = useState<{ 
    pinActual?: string; 
    nuevoPin?: string; 
    confirmarPin?: string; 
  }>({});
  const [paso, setPaso] = useState<'verificar' | 'cambiar'>('verificar');

  const validarPinActual = () => {
    if (!pinActual) {
      setErrors({ pinActual: 'Introduce el PIN actual' });
      return false;
    }

    if (!verificarPin(pinActual)) {
      setErrors({ pinActual: 'PIN incorrecto' });
      return false;
    }

    setErrors({});
    return true;
  };

  const validarNuevoPin = () => {
    const newErrors: { nuevoPin?: string; confirmarPin?: string } = {};

    if (!nuevoPin) {
      newErrors.nuevoPin = 'Introduce el nuevo PIN';
    } else if (nuevoPin.length < 4) {
      newErrors.nuevoPin = 'El PIN debe tener al menos 4 caracteres';
    } else if (nuevoPin.length > 20) {
      newErrors.nuevoPin = 'El PIN no puede tener más de 20 caracteres';
    }

    if (!confirmarPin) {
      newErrors.confirmarPin = 'Confirma el nuevo PIN';
    } else if (nuevoPin !== confirmarPin) {
      newErrors.confirmarPin = 'Los PINs no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerificarPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarPinActual()) {
      setPaso('cambiar');
    }
  };

  const handleCambiarPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarNuevoPin()) {
      cambiarPin(nuevoPin);
      handleClose();
    }
  };

  const handleClose = () => {
    setPinActual('');
    setNuevoPin('');
    setConfirmarPin('');
    setErrors({});
    setPaso('verificar');
    onClose();
  };

  const handleVolver = () => {
    setNuevoPin('');
    setConfirmarPin('');
    setErrors({});
    setPaso('verificar');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <KeyIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Cambiar PIN</h2>
              <p className="text-sm text-gray-500">
                {paso === 'verificar' 
                  ? 'Verifica tu PIN actual para continuar'
                  : 'Introduce tu nuevo PIN de administrador'
                }
              </p>
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
        <div className="p-6">
          {paso === 'verificar' ? (
            // Paso 1: Verificar PIN actual
            <form onSubmit={handleVerificarPin} className="space-y-4">
              <div>
                <label htmlFor="pinActual" className="block text-sm font-medium text-gray-700 mb-2">
                  PIN actual
                </label>
                <input
                  type="password"
                  id="pinActual"
                  value={pinActual}
                  onChange={(e) => {
                    setPinActual(e.target.value);
                    if (errors.pinActual) {
                      setErrors({ ...errors, pinActual: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg tracking-widest ${
                    errors.pinActual ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••"
                  autoFocus
                />
                {errors.pinActual && (
                  <p className="mt-2 text-sm text-red-600">{errors.pinActual}</p>
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
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Verificar
                </button>
              </div>
            </form>
          ) : (
            // Paso 2: Cambiar PIN
            <form onSubmit={handleCambiarPin} className="space-y-4">
              <div>
                <label htmlFor="nuevoPin" className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo PIN
                </label>
                <input
                  type="password"
                  id="nuevoPin"
                  value={nuevoPin}
                  onChange={(e) => {
                    setNuevoPin(e.target.value);
                    if (errors.nuevoPin) {
                      setErrors({ ...errors, nuevoPin: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg tracking-widest ${
                    errors.nuevoPin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••"
                  autoFocus
                />
                {errors.nuevoPin && (
                  <p className="mt-2 text-sm text-red-600">{errors.nuevoPin}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmarPin" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nuevo PIN
                </label>
                <input
                  type="password"
                  id="confirmarPin"
                  value={confirmarPin}
                  onChange={(e) => {
                    setConfirmarPin(e.target.value);
                    if (errors.confirmarPin) {
                      setErrors({ ...errors, confirmarPin: undefined });
                    }
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-center text-lg tracking-widest ${
                    errors.confirmarPin ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="••••"
                />
                {errors.confirmarPin && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmarPin}</p>
                )}
              </div>

              {/* Indicador de fortaleza del PIN */}
              {nuevoPin && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Fortaleza del PIN:</p>
                  <div className="flex space-x-1">
                    <div className={`h-2 flex-1 rounded ${nuevoPin.length >= 4 ? 'bg-red-400' : 'bg-gray-200'}`} />
                    <div className={`h-2 flex-1 rounded ${nuevoPin.length >= 6 ? 'bg-yellow-400' : 'bg-gray-200'}`} />
                    <div className={`h-2 flex-1 rounded ${nuevoPin.length >= 8 ? 'bg-green-400' : 'bg-gray-200'}`} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {nuevoPin.length < 4 && 'Muy débil - Al menos 4 caracteres'}
                    {nuevoPin.length >= 4 && nuevoPin.length < 6 && 'Débil - Considera usar más caracteres'}
                    {nuevoPin.length >= 6 && nuevoPin.length < 8 && 'Medio - Buen nivel de seguridad'}
                    {nuevoPin.length >= 8 && 'Fuerte - Excelente seguridad'}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleVolver}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cambiar PIN
                </button>
              </div>
            </form>
          )}

          {/* Consejos de seguridad */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Consejos de seguridad:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Usa al menos 6 caracteres para mayor seguridad</li>
              <li>• No uses fechas de nacimiento o números secuenciales</li>
              <li>• No compartas tu PIN con los niños</li>
              <li>• Cambia tu PIN regularmente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
