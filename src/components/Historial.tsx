import React, { useState } from 'react';
import { 
  ClockIcon, 
  ChevronDownIcon, 
  ChevronRightIcon,
  DocumentArrowDownIcon,
  TrophyIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const Historial: React.FC = () => {
  const { state, exportarCSV } = useApp();
  const [semanaExpandida, setSemanaExpandida] = useState<string | null>(null);

  const toggleSemana = (semanaId: string) => {
    setSemanaExpandida(semanaExpandida === semanaId ? null : semanaId);
  };

  const formatearFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), 'dd MMM yyyy', { locale: es });
    } catch {
      return fecha;
    }
  };

  const obtenerNombreMiembro = (miembroId: string) => {
    const miembro = state.miembros.find(m => m.id === miembroId);
    return miembro ? miembro.nombre : 'Miembro desconocido';
  };

  // Ordenar historial por fecha (más reciente primero)
  const historialOrdenado = [...state.historial].sort((a, b) => 
    new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <ClockIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Historial Familiar</h2>
            <p className="text-gray-600">
              {historialOrdenado.length === 0 
                ? 'No hay historial disponible'
                : `${historialOrdenado.length} semana${historialOrdenado.length !== 1 ? 's' : ''} registrada${historialOrdenado.length !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        
        {historialOrdenado.length > 0 && (
          <button
            onClick={exportarCSV}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Exportar CSV</span>
          </button>
        )}
      </div>

      {/* Lista de historial */}
      {historialOrdenado.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <ClockIcon className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay historial disponible</h3>
          <p className="text-gray-500">
            El historial se genera automáticamente cada semana o cuando se hace un reinicio manual.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {historialOrdenado.map((snapshot) => {
            const estaExpandida = semanaExpandida === snapshot.id;
            const totalMiembros = Object.keys(snapshot.puntosPorMiembro).length;
            
            return (
              <div
                key={snapshot.id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Header de la semana */}
                <button
                  onClick={() => toggleSemana(snapshot.id)}
                  className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        {estaExpandida ? (
                          <ChevronDownIcon className="h-5 w-5 text-purple-600" />
                        ) : (
                          <ChevronRightIcon className="h-5 w-5 text-purple-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          Semana {snapshot.semana}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatearFecha(snapshot.fechaInicio)} - {formatearFecha(snapshot.fechaFin)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Estadísticas rápidas */}
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-purple-600">{snapshot.estadisticas.totalPuntos}</div>
                        <div className="text-gray-500">Puntos</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{snapshot.estadisticas.totalTareas}</div>
                        <div className="text-gray-500">Tareas</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-yellow-600">{snapshot.estadisticas.totalRecompensas}</div>
                        <div className="text-gray-500">Premios</div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Contenido expandible */}
                {estaExpandida && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Puntos por miembro */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <TrophyIcon className="h-5 w-5 mr-2 text-purple-600" />
                          Puntos por Miembro
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(snapshot.puntosPorMiembro)
                            .sort(([,a], [,b]) => (b as number) - (a as number))
                            .map(([miembroId, puntos]) => {
                              const miembro = state.miembros.find(m => m.id === miembroId);
                              return (
                                <div key={miembroId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    {miembro && (
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                        style={{ backgroundColor: `${miembro.color}20` }}
                                      >
                                        {miembro.avatar}
                                      </div>
                                    )}
                                    <span className="font-medium text-gray-900">
                                      {obtenerNombreMiembro(miembroId)}
                                    </span>
                                  </div>
                                  <span className="font-bold text-purple-600">
                                    {puntos} pts
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      {/* Tareas completadas */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <CalendarDaysIcon className="h-5 w-5 mr-2 text-green-600" />
                          Tareas Completadas
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(snapshot.tareasCompletadas)
                            .sort(([,a], [,b]) => (b as string[]).length - (a as string[]).length)
                            .map(([miembroId, tareas]) => (
                              <div key={miembroId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div className="flex items-center space-x-3">
                                  {(() => {
                                    const miembro = state.miembros.find(m => m.id === miembroId);
                                    return miembro && (
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                        style={{ backgroundColor: `${miembro.color}20` }}
                                      >
                                        {miembro.avatar}
                                      </div>
                                    );
                                  })()}
                                  <span className="font-medium text-gray-900">
                                    {obtenerNombreMiembro(miembroId)}
                                  </span>
                                </div>
                                <span className="font-bold text-green-600">
                                  {(tareas as string[]).length} tareas
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Recompensas ganadas */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <TrophyIcon className="h-5 w-5 mr-2 text-yellow-600" />
                          Recompensas Ganadas
                        </h4>
                        <div className="space-y-3">
                          {Object.entries(snapshot.recompensasGanadas)
                            .filter(([, recompensas]) => (recompensas as string[]).length > 0)
                            .sort(([,a], [,b]) => (b as string[]).length - (a as string[]).length)
                            .map(([miembroId, recompensas]) => (
                              <div key={miembroId} className="flex items-center justify-between p-3 bg-white rounded-lg">
                                <div className="flex items-center space-x-3">
                                  {(() => {
                                    const miembro = state.miembros.find(m => m.id === miembroId);
                                    return miembro && (
                                      <div 
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                                        style={{ backgroundColor: `${miembro.color}20` }}
                                      >
                                        {miembro.avatar}
                                      </div>
                                    );
                                  })()}
                                  <span className="font-medium text-gray-900">
                                    {obtenerNombreMiembro(miembroId)}
                                  </span>
                                </div>
                                <span className="font-bold text-yellow-600">
                                  {(recompensas as string[]).length} premios
                                </span>
                              </div>
                            ))}
                          {Object.values(snapshot.recompensasGanadas).every(r => (r as string[]).length === 0) && (
                            <div className="text-center py-4 text-gray-500">
                              No se ganaron recompensas esta semana
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Estadísticas adicionales */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <UserGroupIcon className="h-5 w-5 mr-2 text-blue-600" />
                          Estadísticas de la Semana
                        </h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-white rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Miembro más activo</span>
                              <span className="font-medium text-blue-600">
                                {obtenerNombreMiembro(snapshot.estadisticas.miembroMasActivo)}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Promedio de puntos</span>
                              <span className="font-medium text-blue-600">
                                {Math.round(snapshot.estadisticas.totalPuntos / Math.max(totalMiembros, 1))}
                              </span>
                            </div>
                          </div>
                          <div className="p-3 bg-white rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Faltas registradas</span>
                              <span className="font-medium text-red-600">
                                {snapshot.faltasRegistradas.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resumen móvil */}
                    <div className="md:hidden mt-6 grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-white rounded-lg">
                        <div className="font-bold text-purple-600">{snapshot.estadisticas.totalPuntos}</div>
                        <div className="text-xs text-gray-500">Puntos</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <div className="font-bold text-green-600">{snapshot.estadisticas.totalTareas}</div>
                        <div className="text-xs text-gray-500">Tareas</div>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <div className="font-bold text-yellow-600">{snapshot.estadisticas.totalRecompensas}</div>
                        <div className="text-xs text-gray-500">Premios</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
