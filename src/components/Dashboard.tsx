import React, { useState } from 'react';
import { PlusIcon, UsersIcon } from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { MiembroCard } from './MiembroCard';
import { MiembroModal } from './modals/MiembroModal';
import { ConfirmModal } from './modals/ConfirmModal';

export const Dashboard: React.FC = () => {
  const { state, eliminarMiembro, mostrarNotificacion } = useApp();
  const [mostrarMiembroModal, setMostrarMiembroModal] = useState(false);
  const [miembroEditar, setMiembroEditar] = useState<string | null>(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState<string | null>(null);

  const handleEditarMiembro = (miembroId: string) => {
    setMiembroEditar(miembroId);
    setMostrarMiembroModal(true);
  };

  const handleEliminarMiembro = (miembroId: string) => {
    setMostrarConfirmEliminar(miembroId);
  };

  const confirmarEliminar = () => {
    if (mostrarConfirmEliminar) {
      eliminarMiembro(mostrarConfirmEliminar);
      setMostrarConfirmEliminar(null);
    }
  };

  const handleCerrarModal = () => {
    setMostrarMiembroModal(false);
    setMiembroEditar(null);
  };

  const miembroAEliminar = state.miembros.find(m => m.id === mostrarConfirmEliminar);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header de sección */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UsersIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nuestra Familia</h2>
            <p className="text-gray-600">
              {state.miembros.length === 0 
                ? 'Agrega el primer miembro de tu familia'
                : `${state.miembros.length} miembro${state.miembros.length !== 1 ? 's' : ''} registrado${state.miembros.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        
        {/* Botón agregar miembro (solo en modo admin) */}
        {state.modoAdmin && (
          <button
            onClick={() => setMostrarMiembroModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Agregar Miembro</span>
          </button>
        )}
      </div>

      {/* Grid de miembros */}
      {state.miembros.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay miembros registrados</h3>
          <p className="text-gray-500 mb-6">
            {state.modoAdmin 
              ? 'Agrega el primer miembro de tu familia para comenzar.'
              : 'Pide al administrador que agregue miembros a la familia.'
            }
          </p>
          {state.modoAdmin && (
            <button
              onClick={() => setMostrarMiembroModal(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Agregar Primer Miembro</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.miembros.map(miembro => (
            <MiembroCard
              key={miembro.id}
              miembro={miembro}
              onEdit={state.modoAdmin ? () => handleEditarMiembro(miembro.id) : undefined}
              onDelete={state.modoAdmin ? () => handleEliminarMiembro(miembro.id) : undefined}
            />
          ))}
        </div>
      )}

      {/* Estadísticas familiares */}
      {state.miembros.length > 0 && (
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas Familiares</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {state.miembros.reduce((sum, m) => sum + m.puntos, 0)}
              </div>
              <div className="text-sm text-gray-600">Puntos Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {state.miembros.reduce((sum, m) => sum + m.tareasCompletadas.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Tareas Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {state.miembros.reduce((sum, m) => sum + m.recompensasGanadas.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Recompensas Ganadas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(
                  state.miembros.reduce((sum, m) => sum + m.puntos, 0) / 
                  Math.max(state.miembros.length, 1)
                )}
              </div>
              <div className="text-sm text-gray-600">Promedio por Miembro</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar/editar miembro */}
      <MiembroModal
        isOpen={mostrarMiembroModal}
        onClose={handleCerrarModal}
        miembroId={miembroEditar}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(null)}
        onConfirm={confirmarEliminar}
        title="Eliminar Miembro"
        message={
          miembroAEliminar
            ? `¿Estás seguro de que quieres eliminar a ${miembroAEliminar.nombre}? Esta acción no se puede deshacer.`
            : ''
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />
    </div>
  );
};
