import React, { useState } from 'react';
import { 
  ExclamationTriangleIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  UserMinusIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { TipoFaltaModal } from './modals/TipoFaltaModal';
import { PenalizarModal } from './modals/PenalizarModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const Penalizaciones: React.FC = () => {
  const { state, eliminarTipoFalta } = useApp();
  const [mostrarTipoFaltaModal, setMostrarTipoFaltaModal] = useState(false);
  const [mostrarPenalizarModal, setMostrarPenalizarModal] = useState(false);
  const [tipoFaltaEditar, setTipoFaltaEditar] = useState<string | null>(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState<string | null>(null);

  const handleEditarTipoFalta = (tipoFaltaId: string) => {
    setTipoFaltaEditar(tipoFaltaId);
    setMostrarTipoFaltaModal(true);
  };

  const handleEliminarTipoFalta = (tipoFaltaId: string) => {
    setMostrarConfirmEliminar(tipoFaltaId);
  };

  const confirmarEliminar = () => {
    if (mostrarConfirmEliminar) {
      eliminarTipoFalta(mostrarConfirmEliminar);
      setMostrarConfirmEliminar(null);
    }
  };

  const handleCerrarModal = () => {
    setMostrarTipoFaltaModal(false);
    setTipoFaltaEditar(null);
  };

  const tipoFaltaAEliminar = state.tiposFaltas.find(tf => tf.id === mostrarConfirmEliminar);

  // Obtener faltas de esta semana
  const faltasEstaSemanaPorMiembro = state.miembros.reduce((acc, miembro) => {
    acc[miembro.id] = state.faltas.filter(f => f.miembroId === miembro.id).length;
    return acc;
  }, {} as { [key: string]: number });

  const obtenerNombreMiembro = (miembroId: string) => {
    const miembro = state.miembros.find(m => m.id === miembroId);
    return miembro ? miembro.nombre : 'Miembro desconocido';
  };

  const obtenerTipoFalta = (tipoFaltaId: string) => {
    return state.tiposFaltas.find(tf => tf.id === tipoFaltaId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Penalizaciones</h2>
            <p className="text-gray-600">
              Gestiona las faltas y penalizaciones de la familia
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setMostrarPenalizarModal(true)}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            disabled={state.miembros.length === 0}
          >
            <UserMinusIcon className="h-5 w-5" />
            <span>Penalizar</span>
          </button>
          <button
            onClick={() => setMostrarTipoFaltaModal(true)}
            className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Agregar Tipo de Falta</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tipos de faltas */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Faltas</h3>
          {state.tiposFaltas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay tipos de faltas definidos</p>
              <button
                onClick={() => setMostrarTipoFaltaModal(true)}
                className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Agregar Primer Tipo</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.tiposFaltas.map(tipoFalta => (
                <div
                  key={tipoFalta.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{tipoFalta.tipo}</h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleEditarTipoFalta(tipoFalta.id)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar tipo de falta"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarTipoFalta(tipoFalta.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar tipo de falta"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{tipoFalta.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      -{tipoFalta.puntosNegativos} puntos
                    </span>
                    {tipoFalta.compensacionDisponible && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Compensable
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historial de faltas de esta semana */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Faltas de Esta Semana</h3>
          {state.faltas.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay faltas registradas esta semana</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.faltas
                .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
                .map(falta => {
                  const tipoFalta = obtenerTipoFalta(falta.tipoFaltaId);
                  const miembro = state.miembros.find(m => m.id === falta.miembroId);
                  
                  return (
                    <div
                      key={falta.id}
                      className="bg-white rounded-lg border border-red-200 p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {miembro && (
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                              style={{ backgroundColor: `${miembro.color}20` }}
                            >
                              {miembro.avatar}
                            </div>
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {obtenerNombreMiembro(falta.miembroId)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {tipoFalta?.tipo || 'Tipo de falta desconocido'}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(new Date(falta.fecha), 'dd/MM HH:mm', { locale: es })}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          -{tipoFalta?.puntosNegativos || 0} puntos
                        </span>
                        {falta.compensada && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Compensada
                          </span>
                        )}
                      </div>
                      
                      {falta.notasAdmin && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                          <strong>Notas:</strong> {falta.notasAdmin}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Resumen de faltas por miembro */}
      {state.miembros.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen por Miembro (Esta Semana)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.miembros.map(miembro => (
              <div
                key={miembro.id}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${miembro.color}20` }}
                  >
                    {miembro.avatar}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{miembro.nombre}</h4>
                    <p className="text-sm text-gray-600">{miembro.puntos} puntos actuales</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`text-2xl font-bold ${
                    faltasEstaSemanaPorMiembro[miembro.id] === 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {faltasEstaSemanaPorMiembro[miembro.id]}
                  </div>
                  <div className="text-sm text-gray-500">
                    {faltasEstaSemanaPorMiembro[miembro.id] === 0 
                      ? 'Sin faltas' 
                      : `falta${faltasEstaSemanaPorMiembro[miembro.id] !== 1 ? 's' : ''} esta semana`
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para agregar/editar tipo de falta */}
      <TipoFaltaModal
        isOpen={mostrarTipoFaltaModal}
        onClose={handleCerrarModal}
        tipoFaltaId={tipoFaltaEditar}
      />

      {/* Modal para penalizar miembro */}
      <PenalizarModal
        isOpen={mostrarPenalizarModal}
        onClose={() => setMostrarPenalizarModal(false)}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(null)}
        onConfirm={confirmarEliminar}
        title="Eliminar Tipo de Falta"
        message={
          tipoFaltaAEliminar
            ? `¿Estás seguro de que quieres eliminar el tipo de falta "${tipoFaltaAEliminar.tipo}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />
    </div>
  );
};
