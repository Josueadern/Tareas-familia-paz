import React, { useState } from 'react';
import { XMarkIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import { useApp } from '../../context/AppContext';

interface PenalizarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PenalizarModal: React.FC<PenalizarModalProps> = ({ isOpen, onClose }) => {
  const { state, penalizarMiembro } = useApp();
  const [miembroSeleccionado, setMiembroSeleccionado] = useState('');
  const [tipoFaltaSeleccionado, setTipoFaltaSeleccionado] = useState('');
  const [notas, setNotas] = useState('');
  const [errors, setErrors] = useState<{ miembro?: string; tipoFalta?: string }>({});

  const validarFormulario = () => {
    const newErrors: { miembro?: string; tipoFalta?: string } = {};

    if (!miembroSeleccionado) {
      newErrors.miembro = 'Debes seleccionar un miembro';
    }

    if (!tipoFaltaSeleccionado) {
      newErrors.tipoFalta = 'Debes seleccionar un tipo de falta';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    penalizarMiembro(miembroSeleccionado, tipoFaltaSeleccionado, notas || undefined);
    handleClose();
  };

  const handleClose = () => {
    setMiembroSeleccionado('');
    setTipoFaltaSeleccionado('');
    setNotas('');
    setErrors({});
    onClose();
  };

  const miembro = state.miembros.find(m => m.id === miembroSeleccionado);
  const tipoFalta = state.tiposFaltas.find(tf => tf.id === tipoFaltaSeleccionado);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <UserMinusIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Penalizar Miembro</h2>
              <p className="text-sm text-gray-500">
                Aplica una penalización a un miembro de la familia
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
          {/* Seleccionar miembro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccionar miembro *
            </label>
            {state.miembros.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                No hay miembros registrados
              </p>
            ) : (
              <div className="space-y-2">
                {state.miembros.map(miembro => (
                  <label
                    key={miembro.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      miembroSeleccionado === miembro.id
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="miembro"
                      value={miembro.id}
                      checked={miembroSeleccionado === miembro.id}
                      onChange={() => {
                        setMiembroSeleccionado(miembro.id);
                        if (errors.miembro) {
                          setErrors({ ...errors, miembro: undefined });
                        }
                      }}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500"
                    />
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${miembro.color}20` }}
                    >
                      {miembro.avatar}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{miembro.nombre}</span>
                      <p className="text-sm text-gray-500">{miembro.puntos} puntos actuales</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
            {errors.miembro && (
              <p className="mt-1 text-sm text-red-600">{errors.miembro}</p>
            )}
          </div>

          {/* Seleccionar tipo de falta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tipo de falta *
            </label>
            {state.tiposFaltas.length === 0 ? (
              <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
                No hay tipos de faltas definidos
              </p>
            ) : (
              <div className="space-y-2">
                {state.tiposFaltas.map(tipoFalta => (
                  <label
                    key={tipoFalta.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      tipoFaltaSeleccionado === tipoFalta.id
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipoFalta"
                      value={tipoFalta.id}
                      checked={tipoFaltaSeleccionado === tipoFalta.id}
                      onChange={() => {
                        setTipoFaltaSeleccionado(tipoFalta.id);
                        if (errors.tipoFalta) {
                          setErrors({ ...errors, tipoFalta: undefined });
                        }
                      }}
                      className="w-4 h-4 text-red-600 border-gray-300 focus:ring-red-500 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-gray-900">{tipoFalta.tipo}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{tipoFalta.puntosNegativos} pts
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{tipoFalta.descripcion}</p>
                      {tipoFalta.compensacionDisponible && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Compensable
                        </span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
            {errors.tipoFalta && (
              <p className="mt-1 text-sm text-red-600">{errors.tipoFalta}</p>
            )}
          </div>

          {/* Notas adicionales */}
          <div>
            <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              id="notas"
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              placeholder="Agrega contexto adicional sobre esta falta..."
              rows={3}
              maxLength={200}
            />
            <p className="mt-1 text-xs text-gray-500">
              {notas.length}/200 caracteres
            </p>
          </div>

          {/* Resumen de la penalización */}
          {miembro && tipoFalta && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Resumen de la penalización:</h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Miembro:</span> {miembro.nombre}</p>
                <p><span className="font-medium">Falta:</span> {tipoFalta.tipo}</p>
                <p><span className="font-medium">Puntos a descontar:</span> -{tipoFalta.puntosNegativos}</p>
                <p><span className="font-medium">Puntos después:</span> {Math.max(0, miembro.puntos - tipoFalta.puntosNegativos)}</p>
                {tipoFalta.compensacionDisponible && (
                  <p className="text-green-700">✓ Podrá compensar esta falta con tareas extras</p>
                )}
              </div>
            </div>
          )}

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
              disabled={state.miembros.length === 0 || state.tiposFaltas.length === 0}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Aplicar Penalización
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
