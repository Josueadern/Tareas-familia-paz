import React, { useState, useEffect } from 'react';
import { XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface TipoFaltaModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipoFaltaId?: string | null;
}

export const TipoFaltaModal: React.FC<TipoFaltaModalProps> = ({ isOpen, onClose, tipoFaltaId }) => {
  const { state, agregarTipoFalta, editarTipoFalta } = useApp();
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [puntosNegativos, setPuntosNegativos] = useState(3);
  const [compensacionDisponible, setCompensacionDisponible] = useState(true);
  const [errors, setErrors] = useState<{ tipo?: string; descripcion?: string }>({});

  const esEdicion = !!tipoFaltaId;
  const tipoFalta = esEdicion ? state.tiposFaltas.find(tf => tf.id === tipoFaltaId) : null;

  // Cargar datos del tipo de falta si es edición
  useEffect(() => {
    if (isOpen) {
      if (esEdicion && tipoFalta) {
        setTipo(tipoFalta.tipo);
        setDescripcion(tipoFalta.descripcion);
        setPuntosNegativos(tipoFalta.puntosNegativos);
        setCompensacionDisponible(tipoFalta.compensacionDisponible);
      } else {
        // Reset para nuevo tipo de falta
        setTipo('');
        setDescripcion('');
        setPuntosNegativos(3);
        setCompensacionDisponible(true);
      }
      setErrors({});
    }
  }, [isOpen, esEdicion, tipoFalta]);

  const validarFormulario = () => {
    const newErrors: { tipo?: string; descripcion?: string } = {};

    if (!tipo.trim()) {
      newErrors.tipo = 'El tipo de falta es obligatorio';
    } else if (tipo.trim().length < 3) {
      newErrors.tipo = 'El tipo debe tener al menos 3 caracteres';
    } else if (tipo.trim().length > 100) {
      newErrors.tipo = 'El tipo no puede tener más de 100 caracteres';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (descripcion.trim().length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    } else if (descripcion.trim().length > 200) {
      newErrors.descripcion = 'La descripción no puede tener más de 200 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    const tipoFormateado = tipo.trim();
    const descripcionFormateada = descripcion.trim();

    if (esEdicion && tipoFaltaId) {
      editarTipoFalta(tipoFaltaId, {
        tipo: tipoFormateado,
        descripcion: descripcionFormateada,
        puntosNegativos,
        compensacionDisponible
      });
    } else {
      agregarTipoFalta({
        tipo: tipoFormateado,
        descripcion: descripcionFormateada,
        puntosNegativos,
        compensacionDisponible
      });
    }

    onClose();
  };

  const handleClose = () => {
    setTipo('');
    setDescripcion('');
    setPuntosNegativos(3);
    setCompensacionDisponible(true);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {esEdicion ? 'Editar Tipo de Falta' : 'Agregar Tipo de Falta'}
              </h2>
              <p className="text-sm text-gray-500">
                {esEdicion ? 'Modifica los datos del tipo de falta' : 'Define un nuevo tipo de falta'}
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
          {/* Tipo de falta */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de falta *
            </label>
            <input
              type="text"
              id="tipo"
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value);
                if (errors.tipo) {
                  setErrors({ ...errors, tipo: undefined });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.tipo ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ej: No hacer la cama, Dejar juguetes fuera..."
              maxLength={100}
              autoFocus
            />
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value);
                if (errors.descripcion) {
                  setErrors({ ...errors, descripcion: undefined });
                }
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                errors.descripcion ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe cuándo se aplica esta falta..."
              rows={3}
              maxLength={200}
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {descripcion.length}/200 caracteres
            </p>
          </div>

          {/* Puntos negativos */}
          <div>
            <label htmlFor="puntosNegativos" className="block text-sm font-medium text-gray-700 mb-2">
              Puntos que se restan (1-20)
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                id="puntosNegativos"
                min="1"
                max="20"
                value={puntosNegativos}
                onChange={(e) => setPuntosNegativos(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-bold text-red-600 min-w-[2rem]">
                -{puntosNegativos}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Leve (-1)</span>
              <span>Moderada (-10)</span>
              <span>Grave (-20)</span>
            </div>
          </div>

          {/* Compensación disponible */}
          <div>
            <label className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={compensacionDisponible}
                onChange={(e) => setCompensacionDisponible(e.target.checked)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <div className="font-medium text-gray-900">Compensación disponible</div>
                <p className="text-sm text-gray-500">
                  Permite que el miembro pueda recuperar puntos con tareas extras
                </p>
              </div>
            </label>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
            <div className="bg-white rounded-lg border border-red-200 p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">
                  {tipo || 'Tipo de falta'}
                </h4>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  -{puntosNegativos} puntos
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {descripcion || 'Descripción de la falta...'}
              </p>
              {compensacionDisponible && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Compensable
                </span>
              )}
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
              className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {esEdicion ? 'Actualizar' : 'Crear Tipo de Falta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
