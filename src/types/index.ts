// Tipos principales para la aplicación de gestión familiar

export interface Miembro {
  id: string;
  nombre: string;
  color: string;
  avatar: string;
  puntos: number;
  tareasCompletadas: string[];
  recompensasGanadas: string[];
  faltas: string[];
}

export interface Tarea {
  id: string;
  nombre: string;
  puntos: number;
  frecuencia: 'diaria' | 'semanal';
  miembrosAsignados: string[];
  esColaborativa: boolean;
  completadaHoy: boolean;
  completadaPorMiembro: { [miembroId: string]: boolean };
  fechaCreacion: string;
}

export interface Recompensa {
  id: string;
  nombre: string;
  icono: string;
  umbralPuntos: number;
  vecesMaximas: number;
  esCooperativa: boolean;
  reclamadaPor: Array<{
    miembroId: string;
    fecha: string;
    semana: string;
  }>;
}

export interface TipoFalta {
  id: string;
  tipo: string;
  puntosNegativos: number;
  descripcion: string;
  compensacionDisponible: boolean;
}

export interface Falta {
  id: string;
  tipoFaltaId: string;
  miembroId: string;
  fecha: string;
  compensada: boolean;
  notasAdmin?: string;
}

export interface Configuracion {
  pinHash: string;
  sonidosActivados: boolean;
  modoKiosco: boolean;
  horaReinicio: string; // formato HH:mm
  diaReinicio: number; // 0 = domingo
  recordatoriosActivados: boolean;
  temaColores: string;
}

export interface SnapshotSemanal {
  id: string;
  semana: string; // formato YYYY-WW
  fechaInicio: string;
  fechaFin: string;
  puntosPorMiembro: { [miembroId: string]: number };
  tareasCompletadas: { [miembroId: string]: string[] };
  recompensasGanadas: { [miembroId: string]: string[] };
  faltasRegistradas: Falta[];
  estadisticas: {
    totalPuntos: number;
    totalTareas: number;
    totalRecompensas: number;
    miembroMasActivo: string;
  };
}

export interface AppState {
  miembros: Miembro[];
  tareas: Tarea[];
  recompensas: Recompensa[];
  tiposFaltas: TipoFalta[];
  faltas: Falta[];
  configuracion: Configuracion;
  historial: SnapshotSemanal[];
  modoAdmin: boolean;
  ultimoReinicio: string;
}

// Colores disponibles para los miembros
export const COLORES_MIEMBRO = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // orange
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#EAB308', // yellow
  '#EF4444', // red
  '#06B6D4', // cyan
];

// Avatares disponibles (emojis de familia)
export const AVATARES_MIEMBRO = [
  '👨', // hombre
  '👩', // mujer
  '👶', // bebé
  '👧', // niña
  '👦', // niño
  '👴', // abuelo
  '👵', // abuela
  '🧑', // persona
];

// Tipos para notificaciones
export type TipoNotificacion = 'success' | 'error' | 'warning' | 'info';

export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  duracion?: number;
  accion?: {
    texto: string;
    callback: () => void;
  };
}

// Tipos para contexto de aplicación
export interface AppContextType {
  state: AppState;
  // Miembros
  agregarMiembro: (miembro: Omit<Miembro, 'id' | 'puntos' | 'tareasCompletadas' | 'recompensasGanadas' | 'faltas'>) => void;
  editarMiembro: (id: string, miembro: Partial<Miembro>) => void;
  eliminarMiembro: (id: string) => void;
  
  // Tareas
  agregarTarea: (tarea: Omit<Tarea, 'id' | 'completadaHoy' | 'completadaPorMiembro' | 'fechaCreacion'>) => void;
  editarTarea: (id: string, tarea: Partial<Tarea>) => void;
  eliminarTarea: (id: string) => void;
  marcarTarea: (tareaId: string, miembroId: string, completada: boolean) => void;
  
  // Recompensas
  agregarRecompensa: (recompensa: Omit<Recompensa, 'id' | 'reclamadaPor'>) => void;
  editarRecompensa: (id: string, recompensa: Partial<Recompensa>) => void;
  eliminarRecompensa: (id: string) => void;
  reclamarRecompensa: (recompensaId: string, miembroId: string) => void;
  
  // Faltas
  agregarTipoFalta: (tipoFalta: Omit<TipoFalta, 'id'>) => void;
  editarTipoFalta: (id: string, tipoFalta: Partial<TipoFalta>) => void;
  eliminarTipoFalta: (id: string) => void;
  penalizarMiembro: (miembroId: string, tipoFaltaId: string, notas?: string) => void;
  
  // Admin
  cambiarModoAdmin: (esAdmin: boolean) => void;
  verificarPin: (pin: string) => boolean;
  cambiarPin: (nuevoPin: string) => void;
  
  // Reinicio
  reiniciarSemana: (manual?: boolean) => void;
  
  // Configuración
  actualizarConfiguracion: (config: Partial<Configuracion>) => void;
  
  // Notificaciones
  mostrarNotificacion: (notificacion: Omit<Notificacion, 'id'>) => void;
  
  // Exportación
  exportarCSV: () => void;
}
