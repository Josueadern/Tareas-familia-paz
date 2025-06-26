import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { sha256 } from 'js-sha256';
import { format, startOfWeek, endOfWeek, getWeek, getYear } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  AppState, 
  AppContextType, 
  Miembro, 
  Tarea, 
  Recompensa, 
  TipoFalta, 
  Falta,
  SnapshotSemanal,
  Configuracion,
  Notificacion
} from '../types';

// Estado inicial
const initialState: AppState = {
  miembros: [],
  tareas: [],
  recompensas: [],
  tiposFaltas: [
    {
      id: '1',
      tipo: 'No hacer la cama',
      puntosNegativos: 5,
      descripcion: 'No hacer la cama por la mañana',
      compensacionDisponible: true
    },
    {
      id: '2',
      tipo: 'Dejar juguetes fuera',
      puntosNegativos: 3,
      descripcion: 'No recoger los juguetes después de jugar',
      compensacionDisponible: true
    },
    {
      id: '3',
      tipo: 'No lavarse los dientes',
      puntosNegativos: 8,
      descripcion: 'Saltarse el cepillado de dientes',
      compensacionDisponible: false
    }
  ],
  faltas: [],
  configuracion: {
    pinHash: sha256('123Maria'), // PIN por defecto
    sonidosActivados: true,
    modoKiosco: false,
    horaReinicio: '23:59',
    diaReinicio: 0, // domingo
    recordatoriosActivados: true,
    temaColores: 'family'
  },
  historial: [],
  modoAdmin: false,
  ultimoReinicio: new Date().toISOString()
};

// Tipos de acciones
type AppAction = 
  | { type: 'SET_STATE'; payload: Partial<AppState> }
  | { type: 'AGREGAR_MIEMBRO'; payload: Miembro }
  | { type: 'EDITAR_MIEMBRO'; payload: { id: string; miembro: Partial<Miembro> } }
  | { type: 'ELIMINAR_MIEMBRO'; payload: string }
  | { type: 'AGREGAR_TAREA'; payload: Tarea }
  | { type: 'EDITAR_TAREA'; payload: { id: string; tarea: Partial<Tarea> } }
  | { type: 'ELIMINAR_TAREA'; payload: string }
  | { type: 'MARCAR_TAREA'; payload: { tareaId: string; miembroId: string; completada: boolean } }
  | { type: 'AGREGAR_RECOMPENSA'; payload: Recompensa }
  | { type: 'EDITAR_RECOMPENSA'; payload: { id: string; recompensa: Partial<Recompensa> } }
  | { type: 'ELIMINAR_RECOMPENSA'; payload: string }
  | { type: 'RECLAMAR_RECOMPENSA'; payload: { recompensaId: string; miembroId: string } }
  | { type: 'AGREGAR_TIPO_FALTA'; payload: TipoFalta }
  | { type: 'EDITAR_TIPO_FALTA'; payload: { id: string; tipoFalta: Partial<TipoFalta> } }
  | { type: 'ELIMINAR_TIPO_FALTA'; payload: string }
  | { type: 'PENALIZAR_MIEMBRO'; payload: Falta }
  | { type: 'CAMBIAR_MODO_ADMIN'; payload: boolean }
  | { type: 'REINICIAR_SEMANA'; payload: SnapshotSemanal }
  | { type: 'ACTUALIZAR_CONFIGURACION'; payload: Partial<Configuracion> };

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };

    case 'AGREGAR_MIEMBRO':
      return { ...state, miembros: [...state.miembros, action.payload] };

    case 'EDITAR_MIEMBRO':
      return {
        ...state,
        miembros: state.miembros.map(m => 
          m.id === action.payload.id ? { ...m, ...action.payload.miembro } : m
        )
      };

    case 'ELIMINAR_MIEMBRO':
      return {
        ...state,
        miembros: state.miembros.filter(m => m.id !== action.payload),
        tareas: state.tareas.map(t => ({
          ...t,
          miembrosAsignados: t.miembrosAsignados.filter(id => id !== action.payload)
        }))
      };

    case 'AGREGAR_TAREA':
      return { ...state, tareas: [...state.tareas, action.payload] };

    case 'EDITAR_TAREA':
      return {
        ...state,
        tareas: state.tareas.map(t => 
          t.id === action.payload.id ? { ...t, ...action.payload.tarea } : t
        )
      };

    case 'ELIMINAR_TAREA':
      return {
        ...state,
        tareas: state.tareas.filter(t => t.id !== action.payload)
      };

    case 'MARCAR_TAREA': {
      const { tareaId, miembroId, completada } = action.payload;
      const tarea = state.tareas.find(t => t.id === tareaId);
      if (!tarea) return state;

      const miembrosActualizados = state.miembros.map(miembro => {
        if (miembro.id === miembroId) {
          const puntosChange = completada ? tarea.puntos : -tarea.puntos;
          const nuevosPuntos = Math.max(0, miembro.puntos + puntosChange);
          
          return {
            ...miembro,
            puntos: nuevosPuntos,
            tareasCompletadas: completada 
              ? [...miembro.tareasCompletadas, tareaId]
              : miembro.tareasCompletadas.filter(id => id !== tareaId)
          };
        }
        return miembro;
      });

      const tareasActualizadas = state.tareas.map(t => {
        if (t.id === tareaId) {
          const completadaPorMiembro = { ...t.completadaPorMiembro };
          completadaPorMiembro[miembroId] = completada;
          
          // Para tareas colaborativas, verificar si todos la han completado
          const completadaHoy = t.esColaborativa 
            ? t.miembrosAsignados.every(id => completadaPorMiembro[id] === true)
            : Object.values(completadaPorMiembro).some(Boolean);

          return { ...t, completadaPorMiembro, completadaHoy };
        }
        return t;
      });

      return { ...state, miembros: miembrosActualizados, tareas: tareasActualizadas };
    }

    case 'AGREGAR_RECOMPENSA':
      return { ...state, recompensas: [...state.recompensas, action.payload] };

    case 'EDITAR_RECOMPENSA':
      return {
        ...state,
        recompensas: state.recompensas.map(r => 
          r.id === action.payload.id ? { ...r, ...action.payload.recompensa } : r
        )
      };

    case 'ELIMINAR_RECOMPENSA':
      return {
        ...state,
        recompensas: state.recompensas.filter(r => r.id !== action.payload)
      };

    case 'RECLAMAR_RECOMPENSA': {
      const { recompensaId, miembroId } = action.payload;
      const recompensa = state.recompensas.find(r => r.id === recompensaId);
      if (!recompensa) return state;

      const miembrosActualizados = state.miembros.map(miembro => {
        if (miembro.id === miembroId) {
          return {
            ...miembro,
            puntos: Math.max(0, miembro.puntos - recompensa.umbralPuntos),
            recompensasGanadas: [...miembro.recompensasGanadas, recompensaId]
          };
        }
        return miembro;
      });

      const recompensasActualizadas = state.recompensas.map(r => {
        if (r.id === recompensaId) {
          return {
            ...r,
            reclamadaPor: [...r.reclamadaPor, {
              miembroId,
              fecha: new Date().toISOString(),
              semana: format(new Date(), 'yyyy-II', { locale: es })
            }]
          };
        }
        return r;
      });

      return { ...state, miembros: miembrosActualizados, recompensas: recompensasActualizadas };
    }

    case 'AGREGAR_TIPO_FALTA':
      return { ...state, tiposFaltas: [...state.tiposFaltas, action.payload] };

    case 'EDITAR_TIPO_FALTA':
      return {
        ...state,
        tiposFaltas: state.tiposFaltas.map(tf => 
          tf.id === action.payload.id ? { ...tf, ...action.payload.tipoFalta } : tf
        )
      };

    case 'ELIMINAR_TIPO_FALTA':
      return {
        ...state,
        tiposFaltas: state.tiposFaltas.filter(tf => tf.id !== action.payload)
      };

    case 'PENALIZAR_MIEMBRO': {
      const falta = action.payload;
      const tipoFalta = state.tiposFaltas.find(tf => tf.id === falta.tipoFaltaId);
      if (!tipoFalta) return state;

      const miembrosActualizados = state.miembros.map(miembro => {
        if (miembro.id === falta.miembroId) {
          return {
            ...miembro,
            puntos: Math.max(0, miembro.puntos - tipoFalta.puntosNegativos),
            faltas: [...miembro.faltas, falta.id]
          };
        }
        return miembro;
      });

      return { 
        ...state, 
        miembros: miembrosActualizados,
        faltas: [...state.faltas, falta]
      };
    }

    case 'CAMBIAR_MODO_ADMIN':
      return { ...state, modoAdmin: action.payload };

    case 'REINICIAR_SEMANA': {
      // Guardar snapshot en historial
      const nuevoHistorial = [...state.historial, action.payload];
      
      // Resetear tareas completadas
      const tareasReiniciadas = state.tareas.map(tarea => ({
        ...tarea,
        completadaHoy: false,
        completadaPorMiembro: {}
      }));

      // Limpiar tareas completadas de miembros pero mantener puntos
      const miembrosReiniciados = state.miembros.map(miembro => ({
        ...miembro,
        tareasCompletadas: [],
        faltas: [] // Limpiar faltas de la semana anterior
      }));

      return {
        ...state,
        historial: nuevoHistorial,
        tareas: tareasReiniciadas,
        miembros: miembrosReiniciados,
        faltas: [], // Limpiar faltas actuales
        ultimoReinicio: new Date().toISOString()
      };
    }

    case 'ACTUALIZAR_CONFIGURACION':
      return {
        ...state,
        configuracion: { ...state.configuracion, ...action.payload }
      };

    default:
      return state;
  }
};

// Base de datos IndexedDB
let db: IDBPDatabase | null = null;

const initDB = async () => {
  if (db) return db;
  
  db = await openDB('FamiliaTasksDB', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('historial')) {
        db.createObjectStore('historial', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('snapshots')) {
        db.createObjectStore('snapshots', { keyPath: 'id' });
      }
    },
  });
  
  return db;
};

// Contexto
const AppContext = createContext<AppContextType | null>(null);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [notificaciones, setNotificaciones] = React.useState<Notificacion[]>([]);

  // Cargar estado desde localStorage al iniciar
  useEffect(() => {
    const cargarEstado = async () => {
      try {
        const estadoGuardado = localStorage.getItem('familiaTasksState');
        if (estadoGuardado) {
          const estado = JSON.parse(estadoGuardado);
          dispatch({ type: 'SET_STATE', payload: estado });
        }

        // Cargar historial desde IndexedDB
        const database = await initDB();
        const historial = await database.getAll('historial');
        if (historial.length > 0) {
          dispatch({ type: 'SET_STATE', payload: { historial } });
        }
      } catch (error) {
        console.error('Error cargando estado:', error);
      }
    };

    cargarEstado();
  }, []);

  // Guardar estado en localStorage cuando cambie
  useEffect(() => {
    const estadoParaGuardar = {
      ...state,
      historial: [] // El historial se guarda en IndexedDB
    };
    localStorage.setItem('familiaTasksState', JSON.stringify(estadoParaGuardar));
  }, [state]);

  // Verificar reinicio automático cada minuto
  useEffect(() => {
    const verificarReinicio = () => {
      const ahora = new Date();
      const ultimoReinicio = new Date(state.ultimoReinicio);
      
      // Verificar si es domingo y la hora de reinicio
      if (ahora.getDay() === state.configuracion.diaReinicio) {
        const [hora, minuto] = state.configuracion.horaReinicio.split(':').map(Number);
        if (ahora.getHours() === hora && ahora.getMinutes() === minuto) {
          // Verificar que no haya sido reiniciado hoy
          const hoyInicio = new Date(ahora);
          hoyInicio.setHours(0, 0, 0, 0);
          
          if (ultimoReinicio < hoyInicio) {
            reiniciarSemana();
          }
        }
      }
    };

    const interval = setInterval(verificarReinicio, 60000); // Cada minuto
    return () => clearInterval(interval);
  }, [state.ultimoReinicio, state.configuracion]);

  // Funciones del contexto
  const agregarMiembro = (miembroData: Omit<Miembro, 'id' | 'puntos' | 'tareasCompletadas' | 'recompensasGanadas' | 'faltas'>) => {
    const miembro: Miembro = {
      ...miembroData,
      id: Date.now().toString(),
      puntos: 0,
      tareasCompletadas: [],
      recompensasGanadas: [],
      faltas: []
    };
    dispatch({ type: 'AGREGAR_MIEMBRO', payload: miembro });
    mostrarNotificacion({
      tipo: 'success',
      titulo: '¡Miembro agregado!',
      mensaje: `${miembro.nombre} se ha unido a la familia.`
    });
  };

  const editarMiembro = (id: string, miembro: Partial<Miembro>) => {
    dispatch({ type: 'EDITAR_MIEMBRO', payload: { id, miembro } });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'Miembro actualizado',
      mensaje: 'Los datos del miembro han sido actualizados.'
    });
  };

  const eliminarMiembro = (id: string) => {
    const miembro = state.miembros.find(m => m.id === id);
    dispatch({ type: 'ELIMINAR_MIEMBRO', payload: id });
    mostrarNotificacion({
      tipo: 'info',
      titulo: 'Miembro eliminado',
      mensaje: `${miembro?.nombre || 'El miembro'} ha sido eliminado de la familia.`
    });
  };

  const agregarTarea = (tareaData: Omit<Tarea, 'id' | 'completadaHoy' | 'completadaPorMiembro' | 'fechaCreacion'>) => {
    const tarea: Tarea = {
      ...tareaData,
      id: Date.now().toString(),
      completadaHoy: false,
      completadaPorMiembro: {},
      fechaCreacion: new Date().toISOString()
    };
    dispatch({ type: 'AGREGAR_TAREA', payload: tarea });
    mostrarNotificacion({
      tipo: 'success',
      titulo: '¡Tarea creada!',
      mensaje: `La tarea "${tarea.nombre}" ha sido agregada.`
    });
  };

  const editarTarea = (id: string, tarea: Partial<Tarea>) => {
    dispatch({ type: 'EDITAR_TAREA', payload: { id, tarea } });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'Tarea actualizada',
      mensaje: 'La tarea ha sido actualizada correctamente.'
    });
  };

  const eliminarTarea = (id: string) => {
    const tarea = state.tareas.find(t => t.id === id);
    dispatch({ type: 'ELIMINAR_TAREA', payload: id });
    mostrarNotificacion({
      tipo: 'info',
      titulo: 'Tarea eliminada',
      mensaje: `La tarea "${tarea?.nombre || ''}" ha sido eliminada.`
    });
  };

  const marcarTarea = (tareaId: string, miembroId: string, completada: boolean) => {
    const tarea = state.tareas.find(t => t.id === tareaId);
    const miembro = state.miembros.find(m => m.id === miembroId);
    
    if (tarea && miembro) {
      dispatch({ type: 'MARCAR_TAREA', payload: { tareaId, miembroId, completada } });
      
      if (completada) {
        mostrarNotificacion({
          tipo: 'success',
          titulo: '¡Tarea completada!',
          mensaje: `${miembro.nombre} ganó ${tarea.puntos} puntos por "${tarea.nombre}".`
        });
        
        // Reproducir sonido si está habilitado
        if (state.configuracion.sonidosActivados) {
          reproducirSonido('success');
        }
      } else {
        mostrarNotificacion({
          tipo: 'info',
          titulo: 'Tarea desmarcada',
          mensaje: `${miembro.nombre} perdió ${tarea.puntos} puntos por "${tarea.nombre}".`
        });
      }
    }
  };

  const agregarRecompensa = (recompensaData: Omit<Recompensa, 'id' | 'reclamadaPor'>) => {
    const recompensa: Recompensa = {
      ...recompensaData,
      id: Date.now().toString(),
      reclamadaPor: []
    };
    dispatch({ type: 'AGREGAR_RECOMPENSA', payload: recompensa });
    mostrarNotificacion({
      tipo: 'success',
      titulo: '¡Recompensa creada!',
      mensaje: `La recompensa "${recompensa.nombre}" está disponible.`
    });
  };

  const editarRecompensa = (id: string, recompensa: Partial<Recompensa>) => {
    dispatch({ type: 'EDITAR_RECOMPENSA', payload: { id, recompensa } });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'Recompensa actualizada',
      mensaje: 'La recompensa ha sido actualizada.'
    });
  };

  const eliminarRecompensa = (id: string) => {
    const recompensa = state.recompensas.find(r => r.id === id);
    dispatch({ type: 'ELIMINAR_RECOMPENSA', payload: id });
    mostrarNotificacion({
      tipo: 'info',
      titulo: 'Recompensa eliminada',
      mensaje: `La recompensa "${recompensa?.nombre || ''}" ha sido eliminada.`
    });
  };

  const reclamarRecompensa = (recompensaId: string, miembroId: string) => {
    const recompensa = state.recompensas.find(r => r.id === recompensaId);
    const miembro = state.miembros.find(m => m.id === miembroId);
    
    if (recompensa && miembro) {
      dispatch({ type: 'RECLAMAR_RECOMPENSA', payload: { recompensaId, miembroId } });
      mostrarNotificacion({
        tipo: 'success',
        titulo: '¡Recompensa obtenida!',
        mensaje: `${miembro.nombre} ha reclamado "${recompensa.nombre}".`
      });
      
      if (state.configuracion.sonidosActivados) {
        reproducirSonido('reward');
      }
    }
  };

  const agregarTipoFalta = (tipoFaltaData: Omit<TipoFalta, 'id'>) => {
    const tipoFalta: TipoFalta = {
      ...tipoFaltaData,
      id: Date.now().toString()
    };
    dispatch({ type: 'AGREGAR_TIPO_FALTA', payload: tipoFalta });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'Tipo de falta creado',
      mensaje: `"${tipoFalta.tipo}" ha sido agregado.`
    });
  };

  const editarTipoFalta = (id: string, tipoFalta: Partial<TipoFalta>) => {
    dispatch({ type: 'EDITAR_TIPO_FALTA', payload: { id, tipoFalta } });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'Tipo de falta actualizado',
      mensaje: 'El tipo de falta ha sido actualizado.'
    });
  };

  const eliminarTipoFalta = (id: string) => {
    const tipoFalta = state.tiposFaltas.find(tf => tf.id === id);
    dispatch({ type: 'ELIMINAR_TIPO_FALTA', payload: id });
    mostrarNotificacion({
      tipo: 'info',
      titulo: 'Tipo de falta eliminado',
      mensaje: `"${tipoFalta?.tipo || ''}" ha sido eliminado.`
    });
  };

  const penalizarMiembro = (miembroId: string, tipoFaltaId: string, notas?: string) => {
    const falta: Falta = {
      id: Date.now().toString(),
      tipoFaltaId,
      miembroId,
      fecha: new Date().toISOString(),
      compensada: false,
      notasAdmin: notas
    };
    
    const tipoFalta = state.tiposFaltas.find(tf => tf.id === tipoFaltaId);
    const miembro = state.miembros.find(m => m.id === miembroId);
    
    if (tipoFalta && miembro) {
      dispatch({ type: 'PENALIZAR_MIEMBRO', payload: falta });
      mostrarNotificacion({
        tipo: 'warning',
        titulo: 'Penalización aplicada',
        mensaje: `${miembro.nombre} perdió ${tipoFalta.puntosNegativos} puntos por "${tipoFalta.tipo}".`
      });
    }
  };

  const cambiarModoAdmin = (esAdmin: boolean) => {
    dispatch({ type: 'CAMBIAR_MODO_ADMIN', payload: esAdmin });
  };

  const verificarPin = (pin: string): boolean => {
    const pinHash = sha256(pin);
    return pinHash === state.configuracion.pinHash;
  };

  const cambiarPin = (nuevoPin: string) => {
    const nuevoHash = sha256(nuevoPin);
    dispatch({ 
      type: 'ACTUALIZAR_CONFIGURACION', 
      payload: { pinHash: nuevoHash } 
    });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'PIN actualizado',
      mensaje: 'El PIN de administrador ha sido cambiado.'
    });
  };

  const reiniciarSemana = async (manual = false) => {
    const ahora = new Date();
    const semanaActual = format(ahora, 'yyyy-II', { locale: es });
    const inicioSemana = startOfWeek(ahora, { weekStartsOn: 1 });
    const finSemana = endOfWeek(ahora, { weekStartsOn: 1 });

    // Crear snapshot de la semana
    const snapshot: SnapshotSemanal = {
      id: semanaActual,
      semana: semanaActual,
      fechaInicio: inicioSemana.toISOString(),
      fechaFin: finSemana.toISOString(),
      puntosPorMiembro: state.miembros.reduce((acc, m) => {
        acc[m.id] = m.puntos;
        return acc;
      }, {} as { [key: string]: number }),
      tareasCompletadas: state.miembros.reduce((acc, m) => {
        acc[m.id] = m.tareasCompletadas;
        return acc;
      }, {} as { [key: string]: string[] }),
      recompensasGanadas: state.miembros.reduce((acc, m) => {
        acc[m.id] = m.recompensasGanadas;
        return acc;
      }, {} as { [key: string]: string[] }),
      faltasRegistradas: [...state.faltas],
      estadisticas: {
        totalPuntos: state.miembros.reduce((sum, m) => sum + m.puntos, 0),
        totalTareas: state.miembros.reduce((sum, m) => sum + m.tareasCompletadas.length, 0),
        totalRecompensas: state.miembros.reduce((sum, m) => sum + m.recompensasGanadas.length, 0),
        miembroMasActivo: state.miembros.length > 0 
          ? state.miembros.reduce((prev, current) => 
              current.tareasCompletadas.length > prev.tareasCompletadas.length ? current : prev
            ).id
          : ''
      }
    };

    // Guardar en IndexedDB
    try {
      const database = await initDB();
      await database.put('historial', snapshot);
    } catch (error) {
      console.error('Error guardando snapshot:', error);
    }

    dispatch({ type: 'REINICIAR_SEMANA', payload: snapshot });
    
    mostrarNotificacion({
      tipo: 'success',
      titulo: manual ? 'Semana reiniciada manualmente' : '¡Nueva semana!',
      mensaje: 'Las tareas se han reiniciado. ¡A por una nueva semana!'
    });
  };

  const actualizarConfiguracion = (config: Partial<Configuracion>) => {
    dispatch({ type: 'ACTUALIZAR_CONFIGURACION', payload: config });
    mostrarNotificacion({
      tipo: 'success',
      titulo: 'Configuración actualizada',
      mensaje: 'Los ajustes han sido guardados.'
    });
  };

  const mostrarNotificacion = (notificacion: Omit<Notificacion, 'id'>) => {
    const nuevaNotificacion: Notificacion = {
      ...notificacion,
      id: Date.now().toString(),
      duracion: notificacion.duracion || 5000
    };
    
    setNotificaciones(prev => [...prev, nuevaNotificacion]);
    
    // Auto-remover después de la duración especificada
    setTimeout(() => {
      setNotificaciones(prev => prev.filter(n => n.id !== nuevaNotificacion.id));
    }, nuevaNotificacion.duracion);
  };

  const exportarCSV = () => {
    const datos = [
      ['Semana', 'Miembro', 'Puntos', 'Tareas Completadas', 'Recompensas Ganadas'],
      ...state.historial.flatMap(snapshot => 
        state.miembros.map(miembro => [
          snapshot.semana,
          miembro.nombre,
          snapshot.puntosPorMiembro[miembro.id] || 0,
          (snapshot.tareasCompletadas[miembro.id] || []).length,
          (snapshot.recompensasGanadas[miembro.id] || []).length
        ])
      )
    ];

    const csvContent = datos.map(fila => fila.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `familia-tareas-historial-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    mostrarNotificacion({
      tipo: 'success',
      titulo: 'CSV exportado',
      mensaje: 'El historial ha sido descargado correctamente.'
    });
  };

  // Función para lanzar confeti celebratorio
  const lanzarConfeti = () => {
    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Explosion desde el centro
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const particles: any[] = [];
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF69B4'];
    
    // Crear explosión radial
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 * i) / 60;
      const velocity = Math.random() * 8 + 4;
      
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Actualizar posición
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // Gravedad ligera
        p.life -= p.decay;
        
        // Dibujar con transparencia
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Eliminar partículas muertas
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }
      
      if (particles.length > 0) {
        requestAnimationFrame(animate);
      } else {
        document.body.removeChild(canvas);
      }
    };
    
    animate();
  };

  // Función para reproducir sonidos mejorados
  const reproducirSonido = (tipo: 'success' | 'error' | 'reward') => {
    if (!state.configuracion.sonidosActivados) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      switch (tipo) {
        case 'success':
          reproducirMelodiaSuccess(audioContext);
          break;
        case 'reward':
          reproducirFanfarriaReward(audioContext);
          lanzarConfeti(); // 🎊 CONFETI PARA RECOMPENSAS!
          break;
        case 'error':
          reproducirSonidoError(audioContext);
          break;
      }
    } catch (error) {
      console.warn('No se pudo reproducir el sonido:', error);
    }
  };

  // Melodía alegre para completar tareas
  const reproducirMelodiaSuccess = (audioContext: AudioContext) => {
    const notas = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 587.33, time: 0.1 },   // D5
      { freq: 659.25, time: 0.2 },   // E5
      { freq: 698.46, time: 0.3 }    // F5
    ];
    
    notas.forEach(nota => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(nota.freq, audioContext.currentTime + nota.time);
      osc.type = 'sine';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + nota.time);
      gainNode.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + nota.time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + nota.time + 0.15);
      
      osc.start(audioContext.currentTime + nota.time);
      osc.stop(audioContext.currentTime + nota.time + 0.15);
    });
  };

  // Fanfarria especial para recompensas
  const reproducirFanfarriaReward = (audioContext: AudioContext) => {
    const secuencia = [
      { freq: 523.25, time: 0, duration: 0.1 },    // C5
      { freq: 659.25, time: 0.1, duration: 0.1 },  // E5
      { freq: 783.99, time: 0.2, duration: 0.1 },  // G5
      { freq: 1046.5, time: 0.3, duration: 0.2 },  // C6 (octava)
      { freq: 783.99, time: 0.5, duration: 0.1 },  // G5
      { freq: 1046.5, time: 0.6, duration: 0.3 }   // C6 final
    ];
    
    secuencia.forEach(nota => {
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(nota.freq, audioContext.currentTime + nota.time);
      osc.type = 'triangle';
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime + nota.time);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + nota.time + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + nota.time + nota.duration);
      
      osc.start(audioContext.currentTime + nota.time);
      osc.stop(audioContext.currentTime + nota.time + nota.duration);
    });
  };

  // Sonido de error más suave
  const reproducirSonidoError = (audioContext: AudioContext) => {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc.frequency.setValueAtTime(220, audioContext.currentTime);
    osc.frequency.linearRampToValueAtTime(196, audioContext.currentTime + 0.5);
    osc.type = 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.5);
  };

  const contextValue: AppContextType = {
    state,
    agregarMiembro,
    editarMiembro,
    eliminarMiembro,
    agregarTarea,
    editarTarea,
    eliminarTarea,
    marcarTarea,
    agregarRecompensa,
    editarRecompensa,
    eliminarRecompensa,
    reclamarRecompensa,
    agregarTipoFalta,
    editarTipoFalta,
    eliminarTipoFalta,
    penalizarMiembro,
    cambiarModoAdmin,
    verificarPin,
    cambiarPin,
    reiniciarSemana,
    actualizarConfiguracion,
    mostrarNotificacion,
    exportarCSV
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
      {/* Renderizar notificaciones */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notificaciones.map(notificacion => (
          <div
            key={notificacion.id}
            className={`max-w-sm w-full bg-white border-l-4 rounded-lg shadow-lg p-4 transform transition-all duration-300 ${
              notificacion.tipo === 'success' ? 'border-green-400' :
              notificacion.tipo === 'error' ? 'border-red-400' :
              notificacion.tipo === 'warning' ? 'border-yellow-400' :
              'border-blue-400'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{notificacion.titulo}</h4>
                <p className="text-sm text-gray-600 mt-1">{notificacion.mensaje}</p>
              </div>
              <button
                onClick={() => setNotificaciones(prev => prev.filter(n => n.id !== notificacion.id))}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            {notificacion.accion && (
              <button
                onClick={notificacion.accion.callback}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {notificacion.accion.texto}
              </button>
            )}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

// Hook personalizado
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};
