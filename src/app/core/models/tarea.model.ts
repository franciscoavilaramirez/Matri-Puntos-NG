export type EstadoTarea = 'OCULTA' | 'PENDIENTE' | 'EN_VALIDACION';

export interface Tarea {
  id: number;
  nombre: string;
  valorPuntos: number;
  notasAdicionales: string | null;
  estado: EstadoTarea;
  asignadoAId: number | null;
  asignadoANombre: string | null;
  esPredefinida: boolean;
}

export interface CrearTareaRequest {
  nombre: string;
  valorPuntos: number;
  notasAdicionales?: string;
}

export interface EditarTareaRequest {
  nombre: string;
  valorPuntos: number;
  notasAdicionales?: string;
}