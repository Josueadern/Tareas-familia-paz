import React, { useState, useEffect } from 'react';
import { XMarkIcon, GiftIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface RecompensaModalProps {
  isOpen: boolean;
  onClose: () => void;
  recompensaId?: string | null;
}

// Iconos de emoji comunes para recompensas
const ICONOS_RECOMPENSAS = [
  '🎮', '📱', '🍕', '🍔', '🍟', '🍦', '🍪', '🎬',
  '🎵', '📚', '🎨', '⚽', '🏀', '🎾', '🚴', '🏊',
  '🛍️', '💰', '🎁', '🎈', '🎉', '🌟', '💎', '🏆',
  '🎪', '🎭', '🎯', '🎲', '🧸', '🚗', '✈️', '🏖️'
];

export const RecompensaModal: React.FC<RecompensaModalProps> = ({ isOpen, onClose, recompensaId }) => {
  const { state, agregarRecompensa, editarRecompensa } = useApp();
  const [nombre, setNombre] = useState('');
  const [icono, setIcono] = useState(ICONOS_RECOMPENSAS[0]);
  const [umbralPuntos, setUmbralPuntos] = useState(20);
  const [vecesMaximas, setVecesMaximas] = useState(1);
  const [esCooperativa, setEsCooperativa] = useState(false);
  const [errors, setErrors] = useState<{ nombre?: string }>({});

  const esEdicion = !!recompensaId;
  const recompensa = esEdicion ? state.recompensas.find(r => r.id === recompensaId) : null;

  // Cargar datos de la recompensa si es edición
  useEffect(() => {
    if (isOpen) {
      if (esEdicion && recompensa) {
        setNombre(recompensa.nombre);
        setIcono(recompensa.icono);
        setUmbralPuntos(recompensa.umbralPuntos);
        setVecesMaximas(recompensa.vecesMaximas);
        setEsCooperativa(recompensa.esCooperativa);
      } else {
        // Reset para nueva recompensa
        setNombre('');
        setIcono(ICONOS_RECOMPENSAS[0]);
        setUmbralPuntos(20);
        setVecesMaximas(1);
        setEsCooperativa(false);
      }
      setErrors({});
    }
  }, [isOpen, esEdicion, recompensa]);

  const validarFormulario = () => {
    const newErrors: { nombre?: string } = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre de la recompensa es obligatorio';
    } else if (nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    } else if (nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede tener más de 100 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const nombreFormateado = nombre.trim();

    if (esEdicion && recompensaId) {
      editarRecompensa(recompensaId, {
        nombre: nombreFormateado,
        icono,
        umbralPuntos,
        vecesMaximas,
        esCooperativa
      });
    } else {
      agregarRecompensa({
        nombre: nombreFormateado,
        icono,
        umbralPuntos,
        vecesMaximas,
        esCooperativa
      });
    }

    onClose();
  };

  const handleClose = () => {
    setNombre('');
    setIcono(ICONOS_RECOMPENSAS[0]);
    setUmbralPuntos(20);
    setVecesMaximas(1);
    setEsCooperativa(false);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <GiftIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {esEdicion ? 'Editar Recompensa' : 'Agregar Recompensa'}
              </h2>
              <p className="text-sm text-gray-500">
                {esEdicion ? 'Modifica los datos de la recompensa' : 'Crea una nueva recompensa para la familia'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la recompensa *
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                if (errors.nombre) {
                  setErrors({ ...errors, nombre: undefined });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                errors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: Ver una película, Helado extra, Salir al parque..."
              maxLength={100}
              autoFocus
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Selector de icono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Icono de la recompensa
            </label>
            <div className="grid grid-cols-8 gap-2 p-3 border border-gray-300 rounded-lg max-h-32 overflow-y-auto">
              {ICONOS_RECOMPENSAS.map((iconoOption) => (
                <button
                  key={iconoOption}
                  type="button"
                  onClick={() => setIcono(iconoOption)}
                  className={`w-10 h-10 rounded-lg border-2 transition-all flex items-center justify-center text-lg ${
                    icono === iconoOption 
                      ? 'border-yellow-500 bg-yellow-50 scale-110' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  title={`Icono ${iconoOption}`}
                >
                  {iconoOption}
                </button>
              ))}
            </div>
          </div>

          {/* Puntos necesarios */}
          <div>
            <label htmlFor="umbralPuntos" className="block text-sm font-medium text-gray-700 mb-2">
              Puntos necesarios (5-200)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="umbralPuntos"
                min="5"
                max="200"
                step="5"
                value={umbralPuntos}
                onChange={(e) => setUmbralPuntos(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-yellow-600 min-w-[3rem]">
                {umbralPuntos}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Fácil (5)</span>
              <span>Moderado (50)</span>
              <span>Difícil (200)</span>
            </div>
          </div>

          {/* Veces máximas por semana */}
          <div>
            <label htmlFor="vecesMaximas" className="block text-sm font-medium text-gray-700 mb-2">
              Máximo por semana (1-7)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="vecesMaximas"
                min="1"
                max="7"
                value={vecesMaximas}
                onChange={(e) => setVecesMaximas(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-yellow-600 min-w-[1rem]">
                {vecesMaximas}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {vecesMaximas === 1 ? 'Una vez por semana' : `Máximo ${vecesMaximas} veces por semana`}
            </p>
          </div>

          {/* Recompensa cooperativa */}
          <div>
            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={esCooperativa}
                onChange={(e) => setEsCooperativa(e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">Recompensa cooperativa</span>
                </div>
                <p className="text-sm text-gray-500">
                  Requiere puntos combinados de toda la familia
                </p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Vista previa:</p>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="text-2xl">{icono}</div>
                <div>
                  <h4 className="font-bold text-gray-900">{nombre || 'Nombre de la recompensa'}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                      {umbralPuntos} pts
                    </span>
                    {esCooperativa && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <UserGroupIcon className="h-3 w-3 mr-1" />
                        Cooperativa
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Máximo {vecesMaximas} vez{vecesMaximas !== 1 ? 'es' : ''} por semana
              </p>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              {esEdicion ? 'Actualizar' : 'Crear Recompensa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
