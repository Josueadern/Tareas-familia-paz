import React, { useState } from 'react';
import { 
  TrophyIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  GiftIcon,
  UserGroupIcon,
  LockClosedIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { RecompensaModal } from './modals/RecompensaModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const RecompensasList: React.FC = () => {
  const { state, eliminarRecompensa, reclamarRecompensa } = useApp();
  const [mostrarRecompensaModal, setMostrarRecompensaModal] = useState(false);
  const [recompensaEditar, setRecompensaEditar] = useState<string | null>(null);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState<string | null>(null);
  const [mostrarConfirmReclamar, setMostrarConfirmReclamar] = useState<{recompensaId: string, miembroId: string} | null>(null);

  const handleEditarRecompensa = (recompensaId: string) => {
    setRecompensaEditar(recompensaId);
    setMostrarRecompensaModal(true);
  };

  const handleEliminarRecompensa = (recompensaId: string) => {
    setMostrarConfirmEliminar(recompensaId);
  };

  const confirmarEliminar = () => {
    if (mostrarConfirmEliminar) {
      eliminarRecompensa(mostrarConfirmEliminar);
      setMostrarConfirmEliminar(null);
    }
  };

  const handleCerrarModal = () => {
    setMostrarRecompensaModal(false);
    setRecompensaEditar(null);
  };

  const handleReclamarRecompensa = (recompensaId: string, miembroId: string) => {
    setMostrarConfirmReclamar({ recompensaId, miembroId });
  };

  const confirmarReclamar = () => {
    if (mostrarConfirmReclamar) {
      reclamarRecompensa(mostrarConfirmReclamar.recompensaId, mostrarConfirmReclamar.miembroId);
      setMostrarConfirmReclamar(null);
    }
  };

  const recompensaAEliminar = state.recompensas.find(r => r.id === mostrarConfirmEliminar);
  const recompensaAReclamar = mostrarConfirmReclamar 
    ? state.recompensas.find(r => r.id === mostrarConfirmReclamar.recompensaId)
    : null;
  const miembroReclamante = mostrarConfirmReclamar
    ? state.miembros.find(m => m.id === mostrarConfirmReclamar.miembroId)
    : null;

  // Función para verificar si una recompensa está disponible para un miembro
  const estaDisponible = (recompensa: any, miembroId: string) => {
    const miembro = state.miembros.find(m => m.id === miembroId);
    if (!miembro) return false;

    // Verificar si tiene suficientes puntos
    const tienePuntos = recompensa.esCooperativa 
      ? state.miembros.reduce((sum, m) => sum + m.puntos, 0) >= recompensa.umbralPuntos
      : miembro.puntos >= recompensa.umbralPuntos;

    if (!tienePuntos) return false;

    // Verificar límite semanal
    const semanaActual = format(new Date(), 'yyyy-II', { locale: es });
    const reclamacionesEstaSemana = recompensa.reclamadaPor.filter((r: any) => 
      r.miembroId === miembroId && r.semana === semanaActual
    ).length;

    return reclamacionesEstaSemana < recompensa.vecesMaximas;
  };

  const renderRecompensa = (recompensa: any) => (
    <div
      key={recompensa.id}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{recompensa.icono}</div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{recompensa.nombre}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  {recompensa.umbralPuntos} pts
                </span>
                {recompensa.esCooperativa && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <UserGroupIcon className="h-3 w-3 mr-1" />
                    Cooperativa
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botones de admin */}
          {state.modoAdmin && (
            <div className="flex space-x-1">
              <button
                onClick={() => handleEditarRecompensa(recompensa.id)}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                title="Editar recompensa"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleEliminarRecompensa(recompensa.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                title="Eliminar recompensa"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div className="mb-4 text-sm text-gray-600">
          <p>Límite: {recompensa.vecesMaximas} vez{recompensa.vecesMaximas !== 1 ? 'es' : ''} por semana</p>
          {recompensa.esCooperativa && (
            <p className="text-purple-600">Requiere puntos combinados de toda la familia</p>
          )}
        </div>

        {/* Estado para cada miembro */}
        <div className="space-y-3">
          {recompensa.esCooperativa ? (
            // Recompensa cooperativa - mostrar estado familiar
            <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-900">Progreso Familiar</span>
                <span className="text-sm text-purple-700">
                  {state.miembros.reduce((sum, m) => sum + m.puntos, 0)} / {recompensa.umbralPuntos} pts
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(
                      (state.miembros.reduce((sum, m) => sum + m.puntos, 0) / recompensa.umbralPuntos) * 100, 
                      100
                    )}%`
                  }}
                />
              </div>
              {estaDisponible(recompensa, state.miembros[0]?.id) ? (
                <button
                  onClick={() => handleReclamarRecompensa(recompensa.id, 'familia')}
                  className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  🎉 ¡Reclamar para la familia!
                </button>
              ) : (
                <div className="text-center text-purple-600 py-2">
                  <LockClosedIcon className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm">Necesitan más puntos</span>
                </div>
              )}
            </div>
          ) : (
            // Recompensa individual - mostrar estado por miembro
            state.miembros.map(miembro => {
              const disponible = estaDisponible(recompensa, miembro.id);
              const progreso = (miembro.puntos / recompensa.umbralPuntos) * 100;
              
              return (
                <div 
                  key={miembro.id}
                  className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                        style={{ backgroundColor: `${miembro.color}20` }}
                      >
                        {miembro.avatar}
                      </div>
                      <span className="font-medium text-gray-900">{miembro.nombre}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {miembro.puntos} / {recompensa.umbralPuntos} pts
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(progreso, 100)}%`,
                        backgroundColor: miembro.color
                      }}
                    />
                  </div>

                  {disponible ? (
                    <button
                      onClick={() => handleReclamarRecompensa(recompensa.id, miembro.id)}
                      className="w-full text-white py-2 px-4 rounded-lg transition-colors font-medium"
                      style={{ backgroundColor: miembro.color }}
                    >
                      🎁 ¡Reclamar recompensa!
                    </button>
                  ) : miembro.puntos >= recompensa.umbralPuntos ? (
                    <div className="text-center text-gray-500 py-2">
                      <CheckCircleIcon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">Límite semanal alcanzado</span>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-2">
                      <LockClosedIcon className="h-5 w-5 mx-auto mb-1" />
                      <span className="text-sm">
                        Faltan {recompensa.umbralPuntos - miembro.puntos} puntos
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Historial de reclamaciones recientes */}
        {recompensa.reclamadaPor.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Últimas reclamaciones:</p>
            <div className="space-y-1">
              {recompensa.reclamadaPor.slice(-3).map((reclamacion: any, index: number) => {
                const miembro = state.miembros.find(m => m.id === reclamacion.miembroId);
                return (
                  <div key={index} className="text-xs text-gray-500">
                    {miembro?.nombre || 'Familia'} - {format(new Date(reclamacion.fecha), 'dd/MM/yyyy', { locale: es })}
                  </div>
                );
              })}
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
          <div className="bg-yellow-100 p-2 rounded-lg">
            <TrophyIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recompensas</h2>
            <p className="text-gray-600">
              {state.recompensas.length === 0 
                ? 'No hay recompensas creadas'
                : `${state.recompensas.length} recompensa${state.recompensas.length !== 1 ? 's' : ''} disponible${state.recompensas.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        
        {state.modoAdmin && (
          <button
            onClick={() => setMostrarRecompensaModal(true)}
            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Agregar Recompensa</span>
          </button>
        )}
      </div>

      {/* Lista de recompensas */}
      {state.recompensas.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <GiftIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay recompensas creadas</h3>
          <p className="text-gray-500 mb-6">
            {state.modoAdmin 
              ? 'Agrega la primera recompensa para motivar a la familia.'
              : 'El administrador no ha creado recompensas aún.'
            }
          </p>
          {state.modoAdmin && (
            <button
              onClick={() => setMostrarRecompensaModal(true)}
              className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Agregar Primera Recompensa</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.recompensas
            .sort((a, b) => a.umbralPuntos - b.umbralPuntos)
            .map(renderRecompensa)}
        </div>
      )}

      {/* Modal para agregar/editar recompensa */}
      <RecompensaModal
        isOpen={mostrarRecompensaModal}
        onClose={handleCerrarModal}
        recompensaId={recompensaEditar}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!mostrarConfirmEliminar}
        onClose={() => setMostrarConfirmEliminar(null)}
        onConfirm={confirmarEliminar}
        title="Eliminar Recompensa"
        message={
          recompensaAEliminar
            ? `¿Estás seguro de que quieres eliminar la recompensa "${recompensaAEliminar.nombre}"? Esta acción no se puede deshacer.`
            : ''
        }
        confirmText="Eliminar"
        confirmVariant="danger"
      />

      {/* Modal de confirmación para reclamar */}
      <ConfirmModal
        isOpen={!!mostrarConfirmReclamar}
        onClose={() => setMostrarConfirmReclamar(null)}
        onConfirm={confirmarReclamar}
        title="Reclamar Recompensa"
        message={
          recompensaAReclamar && miembroReclamante
            ? `¿Confirmas que ${miembroReclamante.nombre} quiere reclamar "${recompensaAReclamar.nombre}"? Se descontarán ${recompensaAReclamar.umbralPuntos} puntos.`
            : ''
        }
        confirmText="Reclamar"
        confirmVariant="success"
      />
    </div>
  );
};
