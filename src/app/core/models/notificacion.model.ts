export interface Notificacion {
    id: number;
    mensaje: string;
    leida: boolean;
    fechaCreacion: string;
    tareaId?: number; // Pendiente de confirmar si el backend ya lo incluye
    tipo?: string;
  }