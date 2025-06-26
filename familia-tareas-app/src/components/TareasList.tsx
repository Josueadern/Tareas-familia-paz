import React, { useState } from 'react';
import { 
  CheckIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { TareaModal } from './modals/TareaModal';
import { ConfirmModal } from './modals/ConfirmModal';

export const TareasList: React.FC = () => {
  const { state, marcarTarea, eliminarTarea } = useApp();
  const [mostrarTareaModal, setMostrarTareaModal] = useState(false);
  const [tareaEditar, setTareaEditar] = useState<string | null>(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState<string | null>(null);

  const handleEditarTarea = (tareaId: string) => {
    setTareaEditar(tareaId);
    setMostrarTareaModal(true);
  };

  const handleEliminarTarea = (tareaId: string) => {
    setMostrarConfirmEliminar(tareaId);
  };

  const confirmarEliminar = () => {
    if (mostrarConfirmEliminar) {
      eliminarTarea(mostrarConfirmEliminar);
      setMostrarConfirmEliminar(null);
    }
  };

  const handleCerrarModal = () => {
    setMostrarTareaModal(false);
    setTareaEditar(null);
  };

  const handleMarcarTarea = (tareaId: string, miembroId: string) => {
    const tarea = state.tareas.find(t => t.id === tareaId);
    if (!tarea) return;

    const yaCompletada = tarea.completadaPorMiembro[miembroId] || false;
    marcarTarea(tareaId, miembroId, !yaCompletada);
  };

  const tareaAEliminar = state.tareas.find(t => t.id === mostrarConfirmEliminar);

  // Filtrar tareas por frecuencia
  const tareasDiarias = state.tareas.filter(t => t.frecuencia === 'diaria');
  const tareasSemanales = state.tareas.filter(t => t.frecuencia === 'semanal');

  const renderTarea = (tarea: any) => (
    <div
      key={tarea.id}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200"
    >
      <div className="p-4">
        {/* Header de la tarea */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900">{tarea.nombre}</h3>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {tarea.puntos} pts
              </span>
              {tarea.esColaborativa && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <UserGroupIcon className="h-3 w-3 mr-1" />
                  Colaborativa
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <ClockIcon className="h-4 w-4" />
                <span className="capitalize">{tarea.frecuencia}</span>
              </span>
              <span>
                {tarea.miembrosAsignados.length} miembro{tarea.miembrosAsignados.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Botones de admin */}
          {state.modoAdmin && (
            <div className="flex space-x-1 ml-4">
              <button
                onClick={() => handleEditarTarea(tarea.id)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Editar tarea"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEliminarTarea(tarea.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Eliminar tarea"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Miembros asignados */}
        <div className="space-y-2">
          {tarea.miembrosAsignados.map((miembroId: string) => {
            const miembro = state.miembros.find(m => m.id === miembroId);
            if (!miembro) return null;

            const completada = tarea.completadaPorMiembro[miembroId] || false;

            return (
              <div
                key={miembroId}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                    style={{ backgroundColor: `${miembro.color}20` }}
                  >
                    {miembro.avatar}
                  </div>
                  <span className="font-medium text-gray-900">{miembro.nombre}</span>
                </div>
                
                <button
                  onClick={() => handleMarcarTarea(tarea.id, miembroId)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                    completada
                      ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                      : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
                  }`}
                  title={completada ? 'Marcar como no completada' : 'Marcar como completada'}
                >
                  {completada && <CheckIcon className="h-5 w-5" />}
                </button>
              </div>
            );
          })}
        </div>

        {/* Estado de tarea colaborativa */}
        {tarea.esColaborativa && (
          <div className="mt-3 p-2 rounded-lg bg-purple-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-700">
                Tarea colaborativa: {Object.values(tarea.completadaPorMiembro).filter(Boolean).length} / {tarea.miembrosAsignados.length} completada
              </span>
              {tarea.completadaHoy && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✓ Completada por todos
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-green-100 p-2 rounded-lg">
            <CalendarDaysIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tareas</h2>
            <p className="text-gray-600">
              {state.tareas.length === 0 
                ? 'No hay tareas creadas'
                : `${state.tareas.filter(t => t.completadaHoy).length} de ${state.tareas.length} tareas completadas`
              }
            </p>
          </div>
        </div>
        
        {state.modoAdmin && (
          <button
            onClick={() => setMostrarTareaModal(true)}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Agregar Tarea</span>
          </button>
        )}
      </div>

      {/* Lista de tareas */}
      {state.tareas.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <CalendarDaysIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay tareas registradas</h3>
          <p className="text-gray-500 mb-6">
            {state.modoAdmin 
              ? 'Agrega la primera tarea para comenzar.'
              : 'El administrador no ha creado tareas aún.'
            }
          </p>
          {state.modoAdmin && (
            <button
              onClick={() => setMostrarTareaModal(true)}
              className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Agregar Primera Tarea</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tareas diarias */}
          {tareasDiarias.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
                Tareas Diarias ({tareasDiarias.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tareasDiarias.map(renderTarea)}
              </div>
            </div>
          )}

          {/* Tareas semanales */}
          {tareasSemanales.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CalendarDaysIcon className="h-5 w-5 mr-2 text-purple-600" />
                Tareas Semanales ({tareasSemanales.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tareasSemanales.map(renderTarea)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal para agregar/editar tarea */}
      <TareaModal
        isOpen={mostrarTareaModal}
        onClose={handleCerrarModal}
        tareaId={tareaEditar}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(null)}
        onConfirm={confirmarEliminar}
        title="Eliminar Tarea"
        message={
          tareaAEliminar
            ? `¿Estás seguro de que quieres eliminar la tarea "${tareaAEliminar.nombre}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />
    </div>
  );
};
